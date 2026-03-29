export interface EbookParams {
  title: string;
  subtitle: string;
  author: string;
  githubLink: string;
  brandName: string;
  prices: { starter: number; pro: number; lifetime: number };
  promoEndDate: string;
  design: DesignConfig;
}

export interface DesignConfig {
  palette: PaletteConfig;
  typography: TypographyConfig;
  architecture: string;
  name: string;
}

export interface PaletteConfig {
  name: string;
  bg: string;
  surface: string;
  primary: string;
  accent: string;
  text: string;
  textMuted: string;
}

export interface TypographyConfig {
  heading: string;
  body: string;
  headingImport: string;
  bodyImport: string;
}

export const PALETTES: PaletteConfig[] = [
  { name: "Or et Nuit", bg: "#1A1A2E", surface: "#0F3460", primary: "#E94560", accent: "#533483", text: "#FFFFFF", textMuted: "#A0A0C0" },
  { name: "Forêt et Or", bg: "#0D1B2A", surface: "#1B4332", primary: "#FFB703", accent: "#2D6A4F", text: "#FFFFFF", textMuted: "#A8C5B0" },
  { name: "Cyan Profond", bg: "#08090A", surface: "#1E2025", primary: "#00D9FF", accent: "#4A9FD4", text: "#FFFFFF", textMuted: "#8090A0" },
  { name: "Magma", bg: "#2B1B17", surface: "#3D1C04", primary: "#E25822", accent: "#8B3A0F", text: "#FFFFFF", textMuted: "#C09080" },
  { name: "Jade", bg: "#0A1128", surface: "#1C2E4A", primary: "#00FFAA", accent: "#1282A2", text: "#FFFFFF", textMuted: "#80B0A0" },
  { name: "Améthyste", bg: "#1F1B24", surface: "#2C2A3A", primary: "#B388FF", accent: "#7C4DFF", text: "#FFFFFF", textMuted: "#9080B0" },
  { name: "Rubis", bg: "#2A0A0A", surface: "#4A1515", primary: "#FF2A2A", accent: "#8B0000", text: "#FFFFFF", textMuted: "#C08080" },
  { name: "Saphir", bg: "#0A192F", surface: "#112240", primary: "#00B4D8", accent: "#0077B6", text: "#FFFFFF", textMuted: "#8090B0" },
  { name: "Émeraude", bg: "#081C15", surface: "#1B4332", primary: "#40916C", accent: "#2D6A4F", text: "#FFFFFF", textMuted: "#80C0A0" },
  { name: "Topaze", bg: "#2B1F1B", surface: "#3A2A22", primary: "#FF8C42", accent: "#D65C00", text: "#FFFFFF", textMuted: "#C09070" },
  { name: "Perle", bg: "#F5F0E6", surface: "#E8DCD0", primary: "#B76E79", accent: "#8C5A6B", text: "#1A1A1A", textMuted: "#555555" },
  { name: "Obsidienne", bg: "#111111", surface: "#222222", primary: "#F5F5F5", accent: "#666666", text: "#FFFFFF", textMuted: "#888888" },
];

export const TYPOGRAPHIES: TypographyConfig[] = [
  {
    heading: "'Playfair Display', Georgia, serif",
    body: "'Inter', system-ui, sans-serif",
    headingImport: "Playfair+Display:wght@700;900",
    bodyImport: "Inter:wght@400;500;600",
  },
  {
    heading: "'Montserrat', system-ui, sans-serif",
    body: "'Open Sans', system-ui, sans-serif",
    headingImport: "Montserrat:wght@700;900",
    bodyImport: "Open+Sans:wght@400;500;600",
  },
  {
    heading: "'Poppins', system-ui, sans-serif",
    body: "'Roboto', system-ui, sans-serif",
    headingImport: "Poppins:wght@700;900",
    bodyImport: "Roboto:wght@400;500;600",
  },
  {
    heading: "'DM Serif Display', Georgia, serif",
    body: "'DM Sans', system-ui, sans-serif",
    headingImport: "DM+Serif+Display:wght@400",
    bodyImport: "DM+Sans:wght@400;500;600",
  },
];

export const ARCHITECTURES = ["tabs", "sidebar", "grid", "terminal"];

export const ADJECTIVES = ["Ultimate", "God", "Elite", "Supreme", "Legendary", "Infinite", "Absolute", "Divine", "Mighty", "Prime", "Apex", "Zenith", "Summit", "Pinnacle", "Peak"];
export const NOUNS = ["Factory", "Engine", "Machine", "Forge", "Lab", "Studio", "Workshop", "Arsenal", "Hive", "Nexus", "Core", "Matrix", "Blueprint", "System", "Formula"];
export const SUFFIXES = ["Pro", "AI", "X", "Next", "Ultra", "Max", "Elite", "Prime", "One", "Zero", "Core", "Plus", "Labs", "Tech", "Flow"];

export function generateBrandName(seed?: string): string {
  const rand = (arr: string[], s: number) => arr[s % arr.length];
  const s = seed ? seed.charCodeAt(0) + seed.length : Date.now();
  return `${rand(ADJECTIVES, s)} ${rand(NOUNS, s + 7)} ${rand(SUFFIXES, s + 13)}`;
}

export function generateUniqueDesign(seed: string): DesignConfig {
  const ts = Date.now();
  const s = ts % 10000 + seed.length * 7;
  const palette = PALETTES[s % PALETTES.length];
  const typography = TYPOGRAPHIES[(s + 3) % TYPOGRAPHIES.length];
  const architecture = ARCHITECTURES[(s + 5) % ARCHITECTURES.length];

  return { palette, typography, architecture, name: palette.name };
}

export function getQrCodeUrl(url: string): string {
  const encoded = encodeURIComponent(url || "https://github.com");
  return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encoded}&color=FFFFFF&bgcolor=00000000`;
}

export function generateEbookHTML(params: EbookParams): string {
  const { title, subtitle, author, githubLink, brandName, prices, promoEndDate, design } = params;
  const { palette, typography, architecture } = design;
  const qrUrl = getQrCodeUrl(githubLink);

  const fontImport = `https://fonts.googleapis.com/css2?family=${typography.headingImport}&family=${typography.bodyImport}&display=swap`;

  const chapters = buildChapters(params);
  const content = architecture === "terminal"
    ? buildTerminalLayout(palette, typography, title, subtitle, author, brandName, githubLink, qrUrl, prices, promoEndDate, chapters)
    : architecture === "sidebar"
    ? buildSidebarLayout(palette, typography, title, subtitle, author, brandName, githubLink, qrUrl, prices, promoEndDate, chapters)
    : architecture === "grid"
    ? buildGridLayout(palette, typography, title, subtitle, author, brandName, githubLink, qrUrl, prices, promoEndDate, chapters)
    : buildTabsLayout(palette, typography, title, subtitle, author, brandName, githubLink, qrUrl, prices, promoEndDate, chapters);

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} — ${brandName}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${fontImport}" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: ${palette.bg};
    --surface: ${palette.surface};
    --primary: ${palette.primary};
    --accent: ${palette.accent};
    --text: ${palette.text};
    --muted: ${palette.textMuted};
    --font-heading: ${typography.heading};
    --font-body: ${typography.body};
    --radius: 12px;
    --glow: 0 0 30px ${palette.primary}40;
  }
  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    line-height: 1.7;
    min-height: 100vh;
  }
  h1, h2, h3, h4 { font-family: var(--font-heading); line-height: 1.2; }
  a { color: var(--primary); text-decoration: none; }
  a:hover { opacity: 0.85; }
  .btn {
    display: inline-block;
    background: var(--primary);
    color: var(--bg) !important;
    font-weight: 700;
    padding: 14px 32px;
    border-radius: var(--radius);
    cursor: pointer;
    border: none;
    font-size: 1rem;
    transition: all 0.2s;
    box-shadow: var(--glow);
  }
  .btn:hover { transform: translateY(-2px); box-shadow: 0 0 40px ${palette.primary}60; }
  .card {
    background: var(--surface);
    border: 1px solid ${palette.primary}30;
    border-radius: var(--radius);
    padding: 2rem;
    margin-bottom: 1.5rem;
  }
  .badge {
    display: inline-block;
    background: ${palette.primary}20;
    color: var(--primary);
    border: 1px solid ${palette.primary}50;
    border-radius: 999px;
    padding: 4px 12px;
    font-size: 0.8rem;
    font-weight: 600;
  }
  .highlight { color: var(--primary); }
  .muted { color: var(--muted); }
  .separator { border: none; border-top: 1px solid ${palette.primary}20; margin: 2rem 0; }
  .copy-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: ${palette.accent}30;
    border: 1px solid ${palette.accent}50;
    color: var(--text);
    padding: 6px 14px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.15s;
  }
  .copy-btn:hover { background: ${palette.accent}50; }
  .price-card {
    background: var(--surface);
    border: 2px solid ${palette.primary}30;
    border-radius: 16px;
    padding: 2rem;
    text-align: center;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .price-card:hover { transform: translateY(-4px); box-shadow: var(--glow); }
  .price-card.featured {
    border-color: var(--primary);
    box-shadow: var(--glow);
  }
  .price-amount {
    font-family: var(--font-heading);
    font-size: 3rem;
    font-weight: 900;
    color: var(--primary);
  }
  .countdown { display: flex; gap: 1rem; justify-content: center; margin: 1.5rem 0; }
  .countdown-item { text-align: center; }
  .countdown-value {
    display: block;
    font-family: var(--font-heading);
    font-size: 2.5rem;
    font-weight: 900;
    color: var(--primary);
    line-height: 1;
  }
  .countdown-label { font-size: 0.75rem; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; }
  .checklist li { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 10px; }
  .checklist li::before { content: "✓"; color: var(--primary); font-weight: 700; flex-shrink: 0; }
  .step-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin: 2rem 0; }
  .step-item { background: ${palette.accent}15; border: 1px solid ${palette.accent}30; border-radius: var(--radius); padding: 1.5rem; text-align: center; }
  .step-number { font-family: var(--font-heading); font-size: 2.5rem; font-weight: 900; color: var(--primary); }
  .faq-item { margin-bottom: 1rem; }
  .faq-q { font-weight: 700; color: var(--primary); margin-bottom: 0.5rem; }
  .testimonial { background: ${palette.accent}10; border-left: 3px solid var(--primary); padding: 1rem 1.5rem; border-radius: 0 var(--radius) var(--radius) 0; margin-bottom: 1rem; }
  .testimonial-author { color: var(--muted); font-size: 0.9rem; margin-top: 0.5rem; }
  @media (max-width: 768px) {
    .grid-3, .grid-2 { grid-template-columns: 1fr !important; }
  }
</style>
</head>
<body>
${content}
<script>
function copyText(id) {
  const el = document.getElementById(id);
  if (!el) return;
  navigator.clipboard.writeText(el.innerText).then(() => {
    const btn = el.parentElement.querySelector('.copy-btn');
    if (btn) { btn.textContent = '✓ Copié!'; setTimeout(() => btn.textContent = '📋 Copier', 1500); }
  });
}
// Countdown timer
function updateCountdown() {
  const endDate = new Date('${promoEndDate}T23:59:59');
  const now = new Date();
  const diff = endDate - now;
  if (diff <= 0) {
    document.querySelectorAll('.countdown').forEach(el => el.innerHTML = '<span style="color:var(--muted)">Offre expirée</span>');
    return;
  }
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  document.querySelectorAll('[data-countdown="days"]').forEach(el => el.textContent = String(days).padStart(2,'0'));
  document.querySelectorAll('[data-countdown="hours"]').forEach(el => el.textContent = String(hours).padStart(2,'0'));
  document.querySelectorAll('[data-countdown="minutes"]').forEach(el => el.textContent = String(minutes).padStart(2,'0'));
  document.querySelectorAll('[data-countdown="seconds"]').forEach(el => el.textContent = String(seconds).padStart(2,'0'));
}
updateCountdown();
setInterval(updateCountdown, 1000);
</script>
</body>
</html>`;
}

function buildChapters(p: EbookParams) {
  return {
    preface: buildPreface(p),
    ch1: buildChapter1(p),
    ch2: buildChapter2(p),
    ch3: buildChapter3(p),
    ch4: buildChapter4(p),
    ch5: buildChapter5(p),
    ch6: buildChapter6(p),
    ch7: buildChapter7(p),
    ch8: buildChapter8(p),
    offers: buildOffers(p),
    faq: buildFaq(p),
    bonuses: buildBonuses(p),
  };
}

function buildPreface(p: EbookParams): string {
  return `
<h2>Préface : La philosophie de l'usine digitale à 0€</h2>
<p>Bienvenue dans <strong class="highlight">${p.title}</strong>.</p>
<p>Ce guide est né d'une conviction simple : <em>tout le monde peut créer des micro-businesses rentables en 2024, sans budget, sans expérience, et sans perdre des mois à apprendre.</em></p>
<p>L'IA a changé les règles du jeu. Ce qui prenait des semaines peut maintenant être fait en 15 minutes. Ce qui coûtait des milliers d'euros est désormais gratuit.</p>
<p>Votre seul investissement : du <strong class="highlight">temps</strong> et de la <strong class="highlight">méthode</strong>.</p>
<p>C'est exactement ce que vous trouverez ici : une méthode testée, un outil prêt à l'emploi, et un système de production scalable.</p>
<p class="muted">— ${p.author || "L'Auteur"}</p>`;
}

function buildChapter1(p: EbookParams): string {
  return `
<h2>Chapitre 1 : Les pré-requis (15 minutes)</h2>
<h3>1.1 Créer un compte Replit</h3>
<p>Replit est votre environnement de développement cloud. Gratuit, accessible depuis n'importe quel navigateur.</p>
<ul class="checklist">
  <li>Rendez-vous sur <a href="https://replit.com" target="_blank">replit.com</a></li>
  <li>Cliquez sur "Sign Up" et créez votre compte gratuit</li>
  <li>Vérifiez votre email</li>
  <li>Explorez le dashboard</li>
</ul>
<h3>1.2 S'inscrire sur les plateformes IA gratuites</h3>
<p>Ces plateformes sont votre arsenal gratuit :</p>
<ul class="checklist">
  <li><strong>Meta.ai</strong> — IA Llama gratuite et très puissante</li>
  <li><strong>Perplexity.ai</strong> — Recherche + IA combinées</li>
  <li><strong>Google AI Studio</strong> — Gemini Flash gratuit</li>
  <li><strong>Mistral le Chat</strong> — Modèles européens performants</li>
  <li><strong>Claude.ai</strong> — Excellent pour la rédaction</li>
</ul>
<h3>1.3 Préparer son environnement de travail</h3>
<p>Ouvrez ces onglets dans votre navigateur :</p>
<ul class="checklist">
  <li>Replit (environnement de développement)</li>
  <li>Une plateforme IA gratuite de votre choix</li>
  <li>Google Sheets (suivi de production)</li>
  <li>Un dossier organisé pour vos fichiers</li>
</ul>
<h3>1.4 Checklist de départ</h3>
<ul class="checklist">
  <li>Compte Replit créé ✓</li>
  <li>Au moins 2 comptes IA gratuits ✓</li>
  <li>15 minutes devant vous ✓</li>
  <li>Motivation God Tier ✓</li>
</ul>`;
}

function buildChapter2(p: EbookParams): string {
  const qrHtml = p.githubLink
    ? `<div style="text-align:center;margin:2rem 0">
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(p.githubLink)}" alt="QR Code GitHub" style="border-radius:8px;max-width:150px" />
        <p class="muted" style="margin-top:8px;font-size:0.85rem">Scanner pour accéder au repo</p>
      </div>`
    : "";
  return `
<h2>Chapitre 2 : L'outil — Le Repo GitHub</h2>
<h3>2.1 Accès au repository</h3>
<p>L'outil au cœur de votre usine est disponible ici :</p>
${p.githubLink
  ? `<div class="card" style="text-align:center">
      <a href="${p.githubLink}" target="_blank" class="btn">🔗 Accéder au Repository</a>
      ${qrHtml}
    </div>`
  : `<div class="card"><p class="muted">Lien GitHub à configurer</p></div>`}
<h3>2.2 Installation en 1 clic sur Replit</h3>
<div class="step-grid">
  <div class="step-item"><div class="step-number">1</div><p>Ouvrez le lien GitHub</p></div>
  <div class="step-item"><div class="step-number">2</div><p>Cliquez "Import to Replit"</p></div>
  <div class="step-item"><div class="step-number">3</div><p>Attendez l'installation</p></div>
  <div class="step-item"><div class="step-number">4</div><p>Cliquez "Run" ▶️</p></div>
  <div class="step-item"><div class="step-number">5</div><p>L'app est prête !</p></div>
</div>
<h3>2.3 Configuration initiale</h3>
<ul class="checklist">
  <li>L'app se lance automatiquement</li>
  <li>Aucune configuration requise</li>
  <li>Interface intuitive prête à l'emploi</li>
</ul>
<h3>2.4 Test de l'application</h3>
<p>Générez votre premier produit test en moins de 5 minutes pour valider l'installation.</p>`;
}

function buildChapter3(p: EbookParams): string {
  return `
<h2>Chapitre 3 : Le protocole d'exécution</h2>
<h3>3.1 Comprendre le système de prompts God Tier</h3>
<p>Un prompt God Tier n'est pas une simple question. C'est un <strong class="highlight">cadre de mission complet</strong> qui donne à l'IA tout ce dont elle a besoin pour produire un résultat professionnel du premier coup.</p>
<p>Structure d'un prompt God Tier :</p>
<ul class="checklist">
  <li><strong>Rôle</strong> : Qui est l'IA ? (Expert, Consultant, Développeur...)</li>
  <li><strong>Contexte</strong> : Quel est l'objectif final ?</li>
  <li><strong>Instructions</strong> : Les étapes précises à suivre</li>
  <li><strong>Contraintes</strong> : Ce qu'il faut absolument inclure/éviter</li>
  <li><strong>Format</strong> : Comment présenter le résultat</li>
</ul>
<h3>3.2 Pas à pas illustré (5 étapes)</h3>
<div class="step-grid">
  <div class="step-item"><div class="step-number">1</div><p><strong>Définir</strong> le produit cible</p></div>
  <div class="step-item"><div class="step-number">2</div><p><strong>Rédiger</strong> le prompt God Tier</p></div>
  <div class="step-item"><div class="step-number">3</div><p><strong>Lancer</strong> la génération</p></div>
  <div class="step-item"><div class="step-number">4</div><p><strong>Vérifier</strong> la qualité</p></div>
  <div class="step-item"><div class="step-number">5</div><p><strong>Exporter</strong> et vendre</p></div>
</div>
<h3>3.3 Optimisation des résultats</h3>
<ul class="checklist">
  <li>Relancez 2-3 fois si le premier résultat n'est pas parfait</li>
  <li>Ajoutez des exemples concrets dans vos prompts</li>
  <li>Utilisez le mode "révision" pour affiner</li>
  <li>Combinez plusieurs IAs pour les meilleures sorties</li>
</ul>
<h3>3.4 Les erreurs à éviter</h3>
<ul class="checklist">
  <li>❌ Prompts trop courts et vagues</li>
  <li>❌ Accepter le premier résultat sans vérifier</li>
  <li>❌ Ignorer le format de sortie</li>
  <li>❌ Ne pas adapter au marché cible</li>
</ul>`;
}

function buildChapter4(p: EbookParams): string {
  return `
<h2>Chapitre 4 : Le système de production</h2>
<h3>4.1 Identifier les produits rentables (matrice)</h3>
<p>Évaluer chaque niche sur deux axes :</p>
<div style="overflow-x:auto;margin:1.5rem 0">
  <table style="width:100%;border-collapse:collapse">
    <thead><tr style="background:${p.design.palette.primary}20">
      <th style="padding:10px;text-align:left;border-bottom:1px solid ${p.design.palette.primary}30">Critère</th>
      <th style="padding:10px;text-align:left;border-bottom:1px solid ${p.design.palette.primary}30">Score</th>
      <th style="padding:10px;text-align:left;border-bottom:1px solid ${p.design.palette.primary}30">Action</th>
    </tr></thead>
    <tbody>
      <tr><td style="padding:10px">Demande forte</td><td style="padding:10px;color:${p.design.palette.primary}">★★★★★</td><td style="padding:10px">Priorité absolue</td></tr>
      <tr><td style="padding:10px">Concurrence faible</td><td style="padding:10px;color:${p.design.palette.primary}">★★★★☆</td><td style="padding:10px">Niche à saisir</td></tr>
      <tr><td style="padding:10px">Marge élevée</td><td style="padding:10px;color:${p.design.palette.primary}">★★★★★</td><td style="padding:10px">Focus ROI</td></tr>
      <tr><td style="padding:10px">Scalabilité</td><td style="padding:10px;color:${p.design.palette.primary}">★★★★★</td><td style="padding:10px">Automatisable</td></tr>
    </tbody>
  </table>
</div>
<h3>4.2 Générer en série (10, 100, 1000 produits)</h3>
<ul class="checklist">
  <li><strong>Niveau 1 :</strong> 10 produits/jour — 2h de travail</li>
  <li><strong>Niveau 2 :</strong> 100 produits/semaine — avec templates</li>
  <li><strong>Niveau 3 :</strong> 1000 produits/mois — avec automatisation</li>
</ul>
<h3>4.3 Contrôle qualité avant vente</h3>
<ul class="checklist">
  <li>Vérification de la structure et cohérence</li>
  <li>Test de lisibilité et expérience utilisateur</li>
  <li>Validation des informations clés</li>
  <li>Optimisation SEO si applicable</li>
</ul>
<h3>4.4 Constitution de votre catalogue</h3>
<p>Un catalogue de 50 produits actifs génère en moyenne <strong class="highlight">3-8 ventes/jour</strong> avec une stratégie de distribution correcte.</p>`;
}

function buildChapter5(p: EbookParams): string {
  return `
<h2>Chapitre 5 : La commercialisation</h2>
<h3>5.1 Stratégie de prix God Tier</h3>
<p>La règle d'or : <strong class="highlight">Prix perception = valeur perçue</strong>. Ne sous-estimez jamais votre travail.</p>
<ul class="checklist">
  <li>Produits d'entrée de gamme : 7-27€ (volume)</li>
  <li>Produits mid-range : 47-197€ (marge)</li>
  <li>Produits premium : 297-997€ (prestige)</li>
  <li>Offres lifetime : 497-1997€ (récurrence inversée)</li>
</ul>
<h3>5.2 Les 10 canaux de vente prioritaires</h3>
<ul class="checklist">
  <li>Gumroad (zéro frais fixes)</li>
  <li>Lemonsqueezy (moderne, faibles commissions)</li>
  <li>Etsy (marketplace établie)</li>
  <li>LinkedIn (B2B premium)</li>
  <li>Malt / Fiverr (freelance)</li>
  <li>Product Hunt (lancement)</li>
  <li>Reddit (communautés niches)</li>
  <li>Discord (communautés ciblées)</li>
  <li>Newsletter propre</li>
  <li>SEO / Blog (long terme)</li>
</ul>
<h3>5.3 Création de votre offre</h3>
<ul class="checklist">
  <li>Définir un problème précis que vous résolvez</li>
  <li>Créer une page de vente en 30 minutes avec l'IA</li>
  <li>Configurer le paiement en ligne (Gumroad = 0€)</li>
  <li>Publier et partager sur vos canaux</li>
</ul>
<h3>5.4 Plateformes de vente comparées</h3>
<div style="overflow-x:auto;margin:1.5rem 0">
  <table style="width:100%;border-collapse:collapse">
    <thead><tr style="background:${p.design.palette.primary}20">
      <th style="padding:10px;text-align:left;border-bottom:1px solid ${p.design.palette.primary}30">Plateforme</th>
      <th style="padding:10px;text-align:left;border-bottom:1px solid ${p.design.palette.primary}30">Commission</th>
      <th style="padding:10px;text-align:left;border-bottom:1px solid ${p.design.palette.primary}30">Trafic inclus</th>
      <th style="padding:10px;text-align:left;border-bottom:1px solid ${p.design.palette.primary}30">Idéal pour</th>
    </tr></thead>
    <tbody>
      <tr><td style="padding:10px">Gumroad</td><td style="padding:10px">10%</td><td style="padding:10px">Non</td><td style="padding:10px">Démarrage</td></tr>
      <tr><td style="padding:10px">Lemon Squeezy</td><td style="padding:10px">5%</td><td style="padding:10px">Non</td><td style="padding:10px">Scale</td></tr>
      <tr><td style="padding:10px">Etsy</td><td style="padding:10px">6.5%</td><td style="padding:10px">Oui</td><td style="padding:10px">Découvrabilité</td></tr>
      <tr><td style="padding:10px">Podia</td><td style="padding:10px">0%</td><td style="padding:10px">Non</td><td style="padding:10px">Courses</td></tr>
    </tbody>
  </table>
</div>`;
}

function buildChapter6(p: EbookParams): string {
  return `
<h2>Chapitre 6 : L'acquisition client</h2>
<h3>6.1 Stratégie LinkedIn</h3>
<ul class="checklist">
  <li>Optimiser votre profil (photo pro, titre accrocheur, résumé vendeur)</li>
  <li>Poster 3x/semaine (tip pratique + cas concret + témoignage)</li>
  <li>Commenter 10 posts/jour dans votre niche</li>
  <li>Envoyer 5 DMs personnalisés/jour</li>
</ul>
<h3>6.2 Stratégie Etsy</h3>
<ul class="checklist">
  <li>Créer des listings avec keywords ciblés</li>
  <li>Optimiser les photos (mockups professionnels)</li>
  <li>Répondre aux messages en moins de 24h</li>
  <li>Demander des avis après chaque vente</li>
</ul>
<h3>6.3 Stratégie Malt / Freelance</h3>
<ul class="checklist">
  <li>Profil complet avec portfolio</li>
  <li>TJM cohérent avec le marché</li>
  <li>Spécialisation dans une niche précise</li>
  <li>Collecte de témoignages systématique</li>
</ul>
<h3>6.4 Stratégie bouche à oreille</h3>
<ul class="checklist">
  <li>Livrer une qualité qui dépasse les attentes</li>
  <li>Demander explicitement les recommandations</li>
  <li>Programme de parrainage : 20% commission</li>
</ul>
<h3>6.5 Stratégie de contenu (SEO)</h3>
<ul class="checklist">
  <li>1 article de fond par semaine (1500+ mots)</li>
  <li>Cibler des keywords longue traîne</li>
  <li>Interlinking stratégique</li>
  <li>Distribution sur Substack / Medium</li>
</ul>`;
}

function buildChapter7(p: EbookParams): string {
  const scripts = [
    {
      title: "Message LinkedIn",
      id: "linkedin-msg",
      content: `Bonjour [Prénom],

Je tombe sur votre profil et je vois que vous travaillez dans [secteur]. Je partage régulièrement des ressources pratiques sur [votre niche] et j'ai pensé que ça pourrait vous intéresser.

J'ai récemment créé un [produit] qui aide les [cible] à [bénéfice clé] en seulement [temps]. Est-ce que ça vous parle ?

Si oui, je serais ravi de vous en dire plus. Pas de pitch agressif, juste un partage entre pros.

Belle journée,
${p.author || "Votre Nom"}`
    },
    {
      title: "Email Froid",
      id: "cold-email",
      content: `Objet : [Bénéfice spécifique] pour [Entreprise]

Bonjour [Prénom],

Je travaille avec des [cible similaire] pour les aider à [résoudre problème].

J'ai récemment aidé [client exemple] à [résultat concret et chiffré].

Est-ce que [défi spécifique] est quelque chose que vous cherchez à améliorer chez [Entreprise] ?

Si oui, je pourrais vous montrer exactement comment on a obtenu ces résultats en 15 minutes.

Bien cordialement,
${p.author || "Votre Nom"}`
    },
    {
      title: "Relance J+3",
      id: "relance-j3",
      content: `Bonjour [Prénom],

Je me permets de revenir vers vous suite à mon message de l'autre jour.

Je sais que vous êtes occupé(e), donc je voulais juste vérifier si mon message vous avait bien atteint.

[Ajoutez une valeur supplémentaire : stat, cas client, offre limitée]

Dites-moi si ce n'est pas le bon moment — je peux revenir dans quelques semaines.

À bientôt,
${p.author || "Votre Nom"}`
    },
    {
      title: "Réponse aux Objections",
      id: "objections",
      content: `"C'est trop cher"
→ "Je comprends. Permettez-moi de vous montrer le ROI : si [produit/service] vous fait économiser X heures/mois au tarif Y, l'investissement est rentabilisé en [Z semaines]."

"J'ai déjà une solution"
→ "Intéressant ! Qu'est-ce qui vous empêche d'obtenir [bénéfice spécifique] avec cette solution ?"

"J'ai besoin de réfléchir"
→ "Bien sûr ! Pour vous aider à réfléchir, qu'est-ce qui serait le facteur décisif pour vous ?"`
    }
  ];

  return `
<h2>Chapitre 7 : Les scripts de prospection</h2>
<p>Voici ${scripts.length} templates prêts à l'emploi. Personnalisez les zones entre [crochets] :</p>
${scripts.map(s => `
<div class="card" style="margin-bottom:1.5rem">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
    <h3>${s.title}</h3>
    <button class="copy-btn" onclick="copyText('${s.id}')">📋 Copier</button>
  </div>
  <pre id="${s.id}" style="white-space:pre-wrap;background:${p.design.palette.bg};padding:1rem;border-radius:8px;font-family:monospace;font-size:0.9rem;border:1px solid ${p.design.palette.primary}20">${s.content}</pre>
</div>`).join("")}`;
}

function buildChapter8(p: EbookParams): string {
  return `
<h2>Chapitre 8 : Démarrer comme un pro</h2>
<h3>8.1 Landing page universelle</h3>
<p>Utilisez ce prompt pour générer votre landing page avec n'importe quelle IA :</p>
<div class="card">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
    <h4>Prompt Landing Page</h4>
    <button class="copy-btn" onclick="copyText('lp-prompt')">📋 Copier</button>
  </div>
  <pre id="lp-prompt" style="white-space:pre-wrap;background:${p.design.palette.bg};padding:1rem;border-radius:8px;font-family:monospace;font-size:0.85rem;border:1px solid ${p.design.palette.primary}20">Crée une landing page ultra-convaincante pour [produit].
Cible : [description précise de l'audience]
Problème résolu : [problème spécifique]
Bénéfice principal : [résultat principal]
Preuves sociales : [témoignages, chiffres, certifications]
Offre : [prix, bonus, garantie]
CTA principal : [action souhaitée]

Structure : Hero → Problème → Solution → Preuve → Offre → CTA → FAQ
Ton : [professionnel/décontracté/urgent]
Longueur : 800-1200 mots
Format : HTML avec Tailwind CSS</pre>
</div>
<h3>8.2 Personnalisation du nom de marque</h3>
<p>Votre marque : <strong class="highlight">${p.brandName}</strong></p>
<p>Utilisez ce nom cohéremment sur tous vos supports.</p>
<h3>8.3 Adresse email pro</h3>
<ul class="checklist">
  <li>Créez contact@votrenom.com (Zoho Mail gratuit)</li>
  <li>Configurez une signature professionnelle</li>
  <li>Activez un auto-répondeur de bienvenue</li>
</ul>
<h3>8.4 Identité visuelle</h3>
<p>Prompt pour générer votre identité visuelle complète avec l'IA :</p>
<div class="card">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
    <h4>Prompt Identité Visuelle</h4>
    <button class="copy-btn" onclick="copyText('brand-prompt')">📋 Copier</button>
  </div>
  <pre id="brand-prompt" style="white-space:pre-wrap;background:${p.design.palette.bg};padding:1rem;border-radius:8px;font-family:monospace;font-size:0.85rem;border:1px solid ${p.design.palette.primary}20">Crée une identité visuelle complète pour la marque ${p.brandName}.
Secteur : [votre secteur]
Valeurs : [3-5 valeurs clés]
Audience : [description]
Style souhaité : [moderne/classique/tech/artistique]
Inclure : Logo concept, palette de couleurs (5 couleurs HEX), typographies (heading + body), guidelines d'utilisation</pre>
</div>
<h3>8.5 Template Devis/Facture</h3>
<p>Utilisez Wave App ou Freebe (gratuits) pour vos devis et factures professionnels.</p>
<h3>8.6 Template Contrat Client</h3>
<ul class="checklist">
  <li>Scope précis des livrables</li>
  <li>Délais et jalons</li>
  <li>Modalités de paiement</li>
  <li>Clause de révisions (max 2 rounds)</li>
  <li>Propriété intellectuelle</li>
</ul>`;
}

function buildOffers(p: EbookParams): string {
  return `
<h2>Nos offres</h2>
<div class="countdown">
  <div class="countdown-item"><span class="countdown-value" data-countdown="days">00</span><span class="countdown-label">Jours</span></div>
  <div class="countdown-item"><span class="countdown-value" data-countdown="hours">00</span><span class="countdown-label">Heures</span></div>
  <div class="countdown-item"><span class="countdown-value" data-countdown="minutes">00</span><span class="countdown-label">Minutes</span></div>
  <div class="countdown-item"><span class="countdown-value" data-countdown="seconds">00</span><span class="countdown-label">Secondes</span></div>
</div>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1.5rem;margin-top:2rem" class="grid-3">
  <div class="price-card">
    <div class="badge">Discovery</div>
    <div class="price-amount" style="font-size:2rem">Gratuit</div>
    <ul class="checklist" style="text-align:left;margin-top:1rem">
      <li>Accès à l'outil de base</li>
      <li>3 générations/mois</li>
      <li>Guide de démarrage</li>
    </ul>
  </div>
  <div class="price-card">
    <div class="badge">Starter</div>
    <div class="price-amount">${p.prices.starter}€</div>
    <ul class="checklist" style="text-align:left;margin-top:1rem">
      <li>Accès complet à l'outil</li>
      <li>Générations illimitées</li>
      <li>Support email</li>
      <li>Mises à jour 6 mois</li>
    </ul>
    <a href="#" class="btn" style="margin-top:1.5rem;display:block">Commencer →</a>
  </div>
  <div class="price-card featured">
    <div class="badge">⭐ Pro</div>
    <div class="price-amount">${p.prices.pro}€</div>
    <ul class="checklist" style="text-align:left;margin-top:1rem">
      <li>Tout le Starter</li>
      <li>10 langues de traduction</li>
      <li>Templates exclusifs</li>
      <li>Support prioritaire</li>
      <li>Mises à jour 1 an</li>
    </ul>
    <a href="#" class="btn" style="margin-top:1.5rem;display:block">Choisir Pro →</a>
  </div>
  <div class="price-card">
    <div class="badge">Lifetime</div>
    <div class="price-amount">${p.prices.lifetime}€</div>
    <ul class="checklist" style="text-align:left;margin-top:1rem">
      <li>Tout le Pro</li>
      <li>Accès à vie</li>
      <li>Mises à jour à vie</li>
      <li>Accès communauté VIP</li>
      <li>Formation avancée</li>
      <li>Licence blanche incluse</li>
    </ul>
    <a href="#" class="btn" style="margin-top:1.5rem;display:block">Offre Lifetime →</a>
  </div>
</div>`;
}

function buildFaq(p: EbookParams): string {
  const faqs = [
    { q: "Est-ce vraiment gratuit pour démarrer ?", a: "Oui, 100%. Replit gratuit + IAs gratuites = 0€ de budget nécessaire pour commencer." },
    { q: "Combien de temps pour voir les premiers résultats ?", a: "La plupart des utilisateurs génèrent leur premier produit vendable en 15-30 minutes. Les premières ventes interviennent généralement dans les 2-4 semaines." },
    { q: "Je n'ai aucune compétence technique, c'est pour moi ?", a: "Absolument. L'outil est conçu pour être utilisé sans aucune connaissance en programmation." },
    { q: "Peut-on vraiment vendre des produits générés par IA ?", a: "Oui, c'est légal et de plus en plus courant. La clé est d'apporter de la valeur réelle à votre audience." },
    { q: "Combien peut-on gagner ?", a: "Cela dépend de votre investissement en temps et de votre stratégie. Certains utilisateurs génèrent 500-3000€/mois en quelques mois." },
    { q: "Y a-t-il un support disponible ?", a: "Oui, selon votre offre : email support (Starter), support prioritaire 24h (Pro), support VIP dédié (Lifetime)." },
    { q: "Les mises à jour sont incluses ?", a: "Oui, selon l'offre choisie. L'offre Lifetime inclut toutes les mises à jour futures à vie." },
    { q: "Puis-je utiliser ça pour mes clients ?", a: "Avec l'offre Pro ou Lifetime, vous pouvez créer des produits pour vos clients. La licence commerciale est incluse." },
    { q: "Est-ce que je garde 100% des revenus ?", a: "Oui. Vous vendez vos produits sur vos propres plateformes. Seules les commissions de la plateforme de vente s'appliquent (ex: Gumroad 10%)." },
    { q: "Comment obtenir un remboursement ?", a: "Garantie satisfait ou remboursé 30 jours, sans question. Envoyez un email avec votre numéro de commande." }
  ];
  return `
<h2>FAQ</h2>
${faqs.map(f => `
<div class="faq-item card">
  <div class="faq-q">❓ ${f.q}</div>
  <p>${f.a}</p>
</div>`).join("")}`;
}

function buildBonuses(p: EbookParams): string {
  return `
<h2>Vos bonus offerts</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1.5rem" class="grid-2">
  <div class="card" style="border-color:${p.design.palette.primary}60">
    <div style="font-size:2rem;margin-bottom:0.75rem">🧮</div>
    <h3>Calculateur de prix</h3>
    <p>Outil interactif pour calculer le prix optimal de vos produits selon votre marché et votre positionnement.</p>
    <div class="badge" style="margin-top:1rem">Valeur : 29€</div>
  </div>
  <div class="card" style="border-color:${p.design.palette.primary}60">
    <div style="font-size:2rem;margin-bottom:0.75rem">⚡</div>
    <h3>50 Prompts God Tier</h3>
    <p>Une bibliothèque de 50 prompts ultra-optimisés pour générer des produits dans n'importe quelle niche.</p>
    <div class="badge" style="margin-top:1rem">Valeur : 49€</div>
  </div>
  <div class="card" style="border-color:${p.design.palette.primary}60">
    <div style="font-size:2rem;margin-bottom:0.75rem">👥</div>
    <h3>Communauté Privée</h3>
    <p>Accès à notre Discord privé : partage d'expériences, de niches rentables et de stratégies exclusives.</p>
    <div class="badge" style="margin-top:1rem">Valeur : 97€</div>
  </div>
  <div class="card" style="border-color:${p.design.palette.primary}60">
    <div style="font-size:2rem;margin-bottom:0.75rem">♾️</div>
    <h3>Mises à jour à vie</h3>
    <p>Toutes les futures améliorations de l'outil, les nouveaux templates et les nouvelles fonctionnalités.</p>
    <div class="badge" style="margin-top:1rem">Valeur : Infini</div>
  </div>
</div>`;
}

function buildTabsLayout(
  pal: PaletteConfig, typ: TypographyConfig,
  title: string, subtitle: string, author: string,
  brandName: string, githubLink: string, qrUrl: string,
  prices: EbookParams["prices"], promoEndDate: string,
  chapters: ReturnType<typeof buildChapters>
): string {
  const tabs = [
    { id: "preface", label: "Préface", content: chapters.preface },
    { id: "ch1", label: "Ch. 1 — Prérequis", content: chapters.ch1 },
    { id: "ch2", label: "Ch. 2 — L'Outil", content: chapters.ch2 },
    { id: "ch3", label: "Ch. 3 — Protocole", content: chapters.ch3 },
    { id: "ch4", label: "Ch. 4 — Production", content: chapters.ch4 },
    { id: "ch5", label: "Ch. 5 — Vente", content: chapters.ch5 },
    { id: "ch6", label: "Ch. 6 — Acquisition", content: chapters.ch6 },
    { id: "ch7", label: "Ch. 7 — Scripts", content: chapters.ch7 },
    { id: "ch8", label: "Ch. 8 — Lancement", content: chapters.ch8 },
    { id: "offers", label: "Offres", content: chapters.offers },
    { id: "bonus", label: "Bonus", content: chapters.bonuses },
    { id: "faq", label: "FAQ", content: chapters.faq },
  ];
  return `
<header style="background:linear-gradient(135deg,${pal.bg} 0%,${pal.surface} 100%);padding:3rem 2rem 2rem;text-align:center;border-bottom:1px solid ${pal.primary}30">
  <div style="max-width:800px;margin:0 auto">
    <span class="badge" style="margin-bottom:1rem">${brandName}</span>
    <h1 style="font-size:clamp(1.8rem,4vw,3rem);font-weight:900;margin:0.5rem 0;background:linear-gradient(90deg,${pal.primary},${pal.accent});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">${title}</h1>
    <p style="font-size:1.15rem;color:${pal.textMuted};margin-bottom:1.5rem">${subtitle}</p>
    <p style="font-size:0.9rem;color:${pal.textMuted}">par <strong style="color:${pal.primary}">${author}</strong></p>
  </div>
</header>
<nav style="background:${pal.surface};border-bottom:1px solid ${pal.primary}20;position:sticky;top:0;z-index:100;overflow-x:auto">
  <div style="display:flex;gap:0;min-width:max-content;padding:0 1rem">
    ${tabs.map((t, i) => `<button onclick="showTab('${t.id}')" id="tab-btn-${t.id}" style="padding:1rem 1.2rem;background:none;border:none;border-bottom:2px solid ${i === 0 ? pal.primary : "transparent"};color:${i === 0 ? pal.primary : pal.textMuted};cursor:pointer;white-space:nowrap;font-family:${typ.body};font-size:0.85rem;font-weight:600;transition:all 0.2s">${t.label}</button>`).join("")}
  </div>
</nav>
<main style="max-width:900px;margin:0 auto;padding:2rem 1.5rem">
  ${tabs.map((t, i) => `<div id="tab-${t.id}" style="display:${i === 0 ? "block" : "none"}">${t.content}</div>`).join("")}
</main>
<footer style="text-align:center;padding:2rem;color:${pal.textMuted};border-top:1px solid ${pal.primary}20;font-size:0.85rem">
  <p>© 2024 ${brandName} — Tous droits réservés</p>
</footer>
<script>
function showTab(id) {
  document.querySelectorAll('[id^="tab-"]').forEach(el => {
    if (!el.id.startsWith('tab-btn-')) el.style.display = 'none';
  });
  document.getElementById('tab-' + id).style.display = 'block';
  document.querySelectorAll('[id^="tab-btn-"]').forEach(btn => {
    btn.style.color = '${pal.textMuted}';
    btn.style.borderBottomColor = 'transparent';
  });
  const activeBtn = document.getElementById('tab-btn-' + id);
  if (activeBtn) {
    activeBtn.style.color = '${pal.primary}';
    activeBtn.style.borderBottomColor = '${pal.primary}';
  }
}
</script>`;
}

function buildSidebarLayout(
  pal: PaletteConfig, typ: TypographyConfig,
  title: string, subtitle: string, author: string,
  brandName: string, githubLink: string, qrUrl: string,
  prices: EbookParams["prices"], promoEndDate: string,
  chapters: ReturnType<typeof buildChapters>
): string {
  const sections = [
    { id: "preface", label: "Préface", content: chapters.preface },
    { id: "ch1", label: "1. Prérequis", content: chapters.ch1 },
    { id: "ch2", label: "2. L'Outil", content: chapters.ch2 },
    { id: "ch3", label: "3. Protocole", content: chapters.ch3 },
    { id: "ch4", label: "4. Production", content: chapters.ch4 },
    { id: "ch5", label: "5. Vente", content: chapters.ch5 },
    { id: "ch6", label: "6. Acquisition", content: chapters.ch6 },
    { id: "ch7", label: "7. Scripts", content: chapters.ch7 },
    { id: "ch8", label: "8. Lancement", content: chapters.ch8 },
    { id: "offers", label: "Offres", content: chapters.offers },
    { id: "bonus", label: "Bonus", content: chapters.bonuses },
    { id: "faq", label: "FAQ", content: chapters.faq },
  ];
  return `
<div style="display:flex;min-height:100vh">
  <aside style="width:260px;background:${pal.surface};border-right:1px solid ${pal.primary}20;padding:2rem 1rem;position:sticky;top:0;height:100vh;overflow-y:auto;flex-shrink:0">
    <div style="margin-bottom:2rem;text-align:center">
      <span class="badge">${brandName}</span>
      <h2 style="font-size:1rem;margin-top:0.75rem;color:${pal.primary}">${title}</h2>
      <p style="font-size:0.8rem;color:${pal.textMuted}">par ${author}</p>
    </div>
    <nav>
      ${sections.map((s, i) => `<button onclick="showSection('${s.id}')" id="nav-${s.id}" style="width:100%;text-align:left;padding:0.65rem 1rem;background:${i === 0 ? pal.primary + "20" : "none"};border:none;border-radius:8px;color:${i === 0 ? pal.primary : pal.textMuted};cursor:pointer;font-family:${typ.body};font-size:0.9rem;margin-bottom:4px;transition:all 0.2s">${s.label}</button>`).join("")}
    </nav>
  </aside>
  <main style="flex:1;padding:2rem;max-width:800px">
    ${sections.map((s, i) => `<div id="section-${s.id}" style="display:${i === 0 ? "block" : "none"}">${s.content}</div>`).join("")}
  </main>
</div>
<footer style="text-align:center;padding:2rem;color:${pal.textMuted};border-top:1px solid ${pal.primary}20;font-size:0.85rem">
  <p>© 2024 ${brandName} — Tous droits réservés</p>
</footer>
<script>
function showSection(id) {
  document.querySelectorAll('[id^="section-"]').forEach(el => el.style.display = 'none');
  document.getElementById('section-' + id).style.display = 'block';
  document.querySelectorAll('[id^="nav-"]').forEach(btn => {
    btn.style.background = 'none';
    btn.style.color = '${pal.textMuted}';
  });
  const activeNav = document.getElementById('nav-' + id);
  if (activeNav) {
    activeNav.style.background = '${pal.primary}20';
    activeNav.style.color = '${pal.primary}';
  }
}
</script>`;
}

function buildGridLayout(
  pal: PaletteConfig, typ: TypographyConfig,
  title: string, subtitle: string, author: string,
  brandName: string, githubLink: string, qrUrl: string,
  prices: EbookParams["prices"], promoEndDate: string,
  chapters: ReturnType<typeof buildChapters>
): string {
  return buildTabsLayout(pal, typ, title, subtitle, author, brandName, githubLink, qrUrl, prices, promoEndDate, chapters);
}

function buildTerminalLayout(
  pal: PaletteConfig, typ: TypographyConfig,
  title: string, subtitle: string, author: string,
  brandName: string, githubLink: string, qrUrl: string,
  prices: EbookParams["prices"], promoEndDate: string,
  chapters: ReturnType<typeof buildChapters>
): string {
  const termPal = { ...pal, bg: "#0D1117", surface: "#161B22", primary: "#00FF41", accent: "#00CC33", text: "#E6EDF3", textMuted: "#8B949E" };
  return buildTabsLayout(termPal, typ, title, subtitle, author, brandName, githubLink, qrUrl, prices, promoEndDate, chapters);
}
