export interface CulturalRules {
  currency: string;
  symbol: string;
  dateFormat: string;
  units: string;
  rtl?: boolean;
}

export const CULTURAL_RULES: Record<string, CulturalRules> = {
  FR: { currency: "EUR", symbol: "€", dateFormat: "DD/MM/YYYY", units: "metric" },
  EN: { currency: "USD", symbol: "$", dateFormat: "MM/DD/YYYY", units: "imperial" },
  ES: { currency: "EUR", symbol: "€", dateFormat: "DD/MM/YYYY", units: "metric" },
  DE: { currency: "EUR", symbol: "€", dateFormat: "DD.MM.YYYY", units: "metric" },
  IT: { currency: "EUR", symbol: "€", dateFormat: "DD/MM/YYYY", units: "metric" },
  PT: { currency: "EUR", symbol: "€", dateFormat: "DD/MM/YYYY", units: "metric" },
  AR: { currency: "SAR", symbol: "﷼", dateFormat: "DD/MM/YYYY", units: "metric", rtl: true },
  ZH: { currency: "CNY", symbol: "¥", dateFormat: "YYYY/MM/DD", units: "metric" },
  JA: { currency: "JPY", symbol: "¥", dateFormat: "YYYY/MM/DD", units: "metric" },
  RU: { currency: "RUB", symbol: "₽", dateFormat: "DD.MM.YYYY", units: "metric" },
};

export const LANG_NAMES: Record<string, { name: string; flag: string; native: string }> = {
  FR: { name: "Français", flag: "🇫🇷", native: "Français" },
  EN: { name: "English", flag: "🇬🇧", native: "English" },
  ES: { name: "Español", flag: "🇪🇸", native: "Español" },
  DE: { name: "Deutsch", flag: "🇩🇪", native: "Deutsch" },
  IT: { name: "Italiano", flag: "🇮🇹", native: "Italiano" },
  PT: { name: "Português", flag: "🇵🇹", native: "Português" },
  AR: { name: "العربية", flag: "🇸🇦", native: "العربية" },
  ZH: { name: "中文", flag: "🇨🇳", native: "中文" },
  JA: { name: "日本語", flag: "🇯🇵", native: "日本語" },
  RU: { name: "Русский", flag: "🇷🇺", native: "Русский" },
};

export class QwenKeyRotator {
  private keys: { key: string; usage: number; status: "active" | "cooldown"; errors: number }[];

  constructor(keys: string[]) {
    this.keys = keys.map((k) => ({ key: k, usage: 0, status: "active" as const, errors: 0 }));
  }

  getNextKey(): string | null {
    const activeKeys = this.keys.filter((k) => k.status === "active");
    if (activeKeys.length === 0) return null;
    const sorted = activeKeys.sort((a, b) => a.usage - b.usage);
    const selected = sorted[0];
    selected.usage++;
    return selected.key;
  }

  markSuccess(key: string) {
    const k = this.keys.find((k) => k.key === key);
    if (k) k.errors = 0;
  }

  markError(key: string) {
    const k = this.keys.find((k) => k.key === key);
    if (k) {
      k.errors++;
      if (k.errors >= 3) {
        k.status = "cooldown";
        setTimeout(() => {
          k.status = "active";
          k.errors = 0;
        }, 120000);
      }
    }
  }
}

function buildTranslationPrompt(html: string, targetLang: string): string {
  const culture = CULTURAL_RULES[targetLang];
  const langName = LANG_NAMES[targetLang]?.name ?? targetLang;
  return `Tu es un expert en traduction et adaptation culturelle. 
Traduis le contenu HTML suivant du français vers ${langName}.
Culture cible: ${targetLang} — devise ${culture?.symbol}, format date ${culture?.dateFormat}.
${culture?.rtl ? 'IMPORTANT: Cette langue s\'écrit de droite à gauche (RTL). Ajoute dir="rtl" au tag html.' : ""}

RÈGLES STRICTES:
- Traduis UNIQUEMENT le texte visible, PAS les balises HTML, attributs, classes CSS, IDs, ou URLs
- Conserve exactement la même structure HTML
- Adapte les expressions culturellement (pas de traduction littérale des idiomes)
- Traduis les noms dans les témoignages pour qu'ils sonnent local
- Garde les emojis tels quels

HTML À TRADUIRE:
${html}

RETOURNE UNIQUEMENT LE HTML TRADUIT, sans markdown, sans explications, sans balises de code.`;
}

async function translateWithOpenAI(html: string, targetLang: string): Promise<string> {
  const { openai } = await import("@workspace/integrations-openai-ai-server");
  const prompt = buildTranslationPrompt(html, targetLang);

  const response = await openai.chat.completions.create({
    model: "gpt-5-mini",
    max_completion_tokens: 8192,
    messages: [{ role: "user", content: prompt }],
  });

  const result = response.choices[0]?.message?.content ?? "";
  if (!result.trim()) throw new Error("Empty OpenAI response");
  return result.trim();
}

async function translateWithQwen(
  html: string,
  targetLang: string,
  apiKey: string,
  rotator?: QwenKeyRotator
): Promise<string> {
  const prompt = buildTranslationPrompt(html, targetLang);
  const response = await fetch(
    "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "qwen-plus",
        input: { messages: [{ role: "user", content: prompt }] },
        parameters: { result_format: "message" },
      }),
      signal: AbortSignal.timeout(60000),
    }
  );
  if (!response.ok) throw new Error(`QWEN API error: ${response.status}`);
  const data = (await response.json()) as any;
  if (rotator) rotator.markSuccess(apiKey);
  return data.output.choices[0].message.content as string;
}

export async function translateHtmlWithOpenAI(
  html: string,
  targetLang: string,
  apiKeys: string[],
  rotator?: QwenKeyRotator
): Promise<string> {
  if (targetLang === "FR") return html;

  // Priority 1: Replit OpenAI AI Integration
  try {
    const result = await translateWithOpenAI(html, targetLang);
    return result;
  } catch (openaiErr) {
    // Fall through to QWEN
  }

  // Priority 2: QWEN API (user-provided keys)
  if (apiKeys.length > 0 && rotator) {
    const apiKey = rotator.getNextKey();
    if (apiKey) {
      try {
        const result = await translateWithQwen(html, targetLang, apiKey, rotator);
        return result;
      } catch {
        rotator.markError(apiKey ?? "");
      }
    }
  }

  // Priority 3: Return French as ultimate fallback
  return html;
}
