import { Router, type IRouter } from "express";
import JSZip from "jszip";
import { eq, desc } from "drizzle-orm";
import {
  generateEbookHTML,
  generateBrandName,
  generateUniqueDesign,
} from "../lib/ebook-content.js";
import { LANG_NAMES, QwenKeyRotator, translateHtmlWithOpenAI } from "../lib/ebook-translator.js";
import { GenerateEbookBody } from "@workspace/api-zod";
import { db, ebookBundlesTable } from "@workspace/db";

const router: IRouter = Router();

router.post("/generate", async (req, res) => {
  try {
    const body = GenerateEbookBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "validation_error", message: body.error.message });
      return;
    }

    const {
      ebookTitle,
      ebookSubtitle,
      authorName,
      githubRepoLink,
      brandName: rawBrand,
      priceStarter,
      pricePro,
      priceLifetime,
      promoEndDate,
      apiKeys,
      selectedLangs,
    } = body.data;

    const brandName = rawBrand || generateBrandName(ebookTitle);
    const design = generateUniqueDesign(brandName + (ebookTitle ?? ""));

    const params = {
      title: ebookTitle ?? "L'USINE À MICRO-BUSINESSES GOD TIER",
      subtitle: ebookSubtitle ?? "Créez des micro-businesses rentables avec l'IA — 0€ de budget",
      author: authorName,
      githubLink: githubRepoLink ?? "",
      brandName,
      prices: {
        starter: priceStarter ?? 49,
        pro: pricePro ?? 149,
        lifetime: priceLifetime ?? 499,
      },
      promoEndDate: promoEndDate ?? new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
      design,
    };

    const frenchHTML = generateEbookHTML(params);

    const langs = selectedLangs ?? ["FR"];
    const rotator = apiKeys && apiKeys.length > 0 ? new QwenKeyRotator(apiKeys) : undefined;
    const files: Record<string, string> = { FR: frenchHTML };

    const langsToTranslate = langs.filter((l) => l !== "FR");

    if (langsToTranslate.length > 0) {
      const results = await Promise.allSettled(
        langsToTranslate.map(async (lang) => {
          const translated = await translateHtmlWithOpenAI(frenchHTML, lang, apiKeys ?? [], rotator);
          return { lang, html: translated };
        })
      );

      for (const result of results) {
        if (result.status === "fulfilled") {
          files[result.value.lang] = result.value.html;
        }
      }
    }

    const bundleId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const generatedAt = new Date().toISOString();

    await db.insert(ebookBundlesTable).values({
      id: bundleId,
      ebookTitle: params.title,
      authorName,
      brandName,
      designTheme: design.name,
      selectedLangs: langs,
      languageCount: langs.length,
      htmlFiles: files,
      coverImageBase64: null,
    });

    res.json({
      bundleId,
      success: true,
      brandName,
      designTheme: design.name,
      languageCount: langs.length,
      generatedAt,
    });

    // Générer la couverture en arrière-plan (ne bloque pas la réponse)
    (async () => {
      try {
        const { generateImageBuffer } = await import(
          "@workspace/integrations-openai-ai-server/image"
        );
        const coverPrompt = `Professional ebook cover for "${params.title}" by ${authorName}. Style: ultra-premium dark space background with gold and violet gradient accents, modern glassmorphism design, futuristic bold typography, luxury tech aesthetic. Brand: ${brandName}. High quality digital art.`;
        const imgBuffer = await generateImageBuffer(coverPrompt, "1024x1024");
        const coverImageBase64 = imgBuffer.toString("base64");
        await db
          .update(ebookBundlesTable)
          .set({ coverImageBase64 })
          .where(eq(ebookBundlesTable.id, bundleId));
      } catch (imgErr: any) {
        req.log.warn({ imgErr }, "Background cover generation failed");
      }
    })();
  } catch (err: any) {
    req.log.error({ err }, "Error generating ebook");
    res.status(500).json({ error: "generation_failed", message: err.message ?? "Unknown error" });
  }
});

router.get("/preview/:bundleId", async (req, res) => {
  try {
    const [bundle] = await db
      .select()
      .from(ebookBundlesTable)
      .where(eq(ebookBundlesTable.id, req.params.bundleId));

    if (!bundle) {
      res.status(404).json({ error: "not_found", message: "Bundle non trouvé" });
      return;
    }

    const languages = bundle.selectedLangs
      .filter((code) => (bundle.htmlFiles as Record<string, string>)[code])
      .map((code) => ({
        code,
        name: LANG_NAMES[code]?.name ?? code,
        flag: LANG_NAMES[code]?.flag ?? "🌐",
        native: LANG_NAMES[code]?.native ?? code,
      }));

    res.json({
      bundleId: req.params.bundleId,
      languages,
      brandName: bundle.brandName,
      designTheme: bundle.designTheme,
      generatedAt: bundle.createdAt.toISOString(),
      coverImageBase64: bundle.coverImageBase64 ?? undefined,
    });
  } catch (err: any) {
    req.log.error({ err }, "Error fetching preview");
    res.status(500).json({ error: "server_error", message: err.message });
  }
});

router.get("/html/:bundleId", async (req, res) => {
  try {
    const lang = (req.query.lang as string) || "FR";
    const [bundle] = await db
      .select()
      .from(ebookBundlesTable)
      .where(eq(ebookBundlesTable.id, req.params.bundleId));

    if (!bundle) {
      res.status(404).json({ error: "not_found", message: "Bundle non trouvé" });
      return;
    }

    const htmlFiles = bundle.htmlFiles as Record<string, string>;
    const html = htmlFiles[lang] ?? htmlFiles["FR"];

    if (!html) {
      res.status(404).json({ error: "not_found", message: "Langue non disponible" });
      return;
    }

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.send(html);
  } catch (err: any) {
    req.log.error({ err }, "Error fetching HTML");
    res.status(500).json({ error: "server_error", message: err.message });
  }
});

router.get("/history", async (req, res) => {
  try {
    const bundles = await db
      .select({
        id: ebookBundlesTable.id,
        ebookTitle: ebookBundlesTable.ebookTitle,
        authorName: ebookBundlesTable.authorName,
        brandName: ebookBundlesTable.brandName,
        designTheme: ebookBundlesTable.designTheme,
        languageCount: ebookBundlesTable.languageCount,
        selectedLangs: ebookBundlesTable.selectedLangs,
        createdAt: ebookBundlesTable.createdAt,
      })
      .from(ebookBundlesTable)
      .orderBy(desc(ebookBundlesTable.createdAt))
      .limit(50);

    res.json({
      items: bundles.map((b) => ({
        ...b,
        createdAt: b.createdAt.toISOString(),
      })),
      total: bundles.length,
    });
  } catch (err: any) {
    req.log.error({ err }, "Error fetching history");
    res.status(500).json({ error: "server_error", message: err.message });
  }
});

router.get("/download/:bundleId", async (req, res) => {
  try {
    const [bundle] = await db
      .select()
      .from(ebookBundlesTable)
      .where(eq(ebookBundlesTable.id, req.params.bundleId));

    if (!bundle) {
      res.status(404).json({ error: "not_found", message: "Bundle non trouvé" });
      return;
    }

    const htmlFiles = bundle.htmlFiles as Record<string, string>;
    const zip = new JSZip();

    for (const [lang, html] of Object.entries(htmlFiles)) {
      const filename = `ebook-${bundle.brandName.replace(/\s+/g, "-").toLowerCase()}-${lang.toLowerCase()}.html`;
      zip.file(filename, html);
    }

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });

    const safeFileName = `ebook-bundle-${req.params.bundleId}.zip`;
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="${safeFileName}"`);
    res.setHeader("Content-Length", zipBuffer.length.toString());
    res.send(zipBuffer);
  } catch (err: any) {
    req.log.error({ err }, "Error downloading bundle");
    res.status(500).json({ error: "server_error", message: err.message });
  }
});

export default router;
