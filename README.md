# ⚡ GOD TIER EBOOK GENERATOR

> Transformez vos idées en ebooks HTML premium multi-langues en 60 secondes, alimentés par l'IA — sans code, sans template générique.

---

## 🚀 Qu'est-ce que c'est ?

**God Tier Ebook Generator** est un outil de génération d'ebooks HTML interactifs de niveau professionnel. Il produit des ebooks complets avec chapitres, offres tarifaires, QR codes, témoignages et FAQ — le tout dans un design unique généré aléatoirement, traduit automatiquement dans jusqu'à 10 langues grâce à l'IA Replit (OpenAI).

---

## ✨ Fonctionnalités

### 🎨 Design God Tier
- **12 palettes de couleurs** uniques (Or et Nuit, Forêt et Or, Cyan Profond, Magma, Jade, Améthyste...)
- **4 typographies premium** (Playfair Display, Montserrat, Poppins, DM Serif Display)
- **4 architectures de layout** (Tabs, Sidebar, Grid, Terminal)
- Chaque ebook généré = combinaison aléatoire unique = identité visuelle propre

### 🌍 Traduction IA Multi-Langues
- **Jusqu'à 10 langues** : 🇫🇷 🇬🇧 🇪🇸 🇩🇪 🇮🇹 🇵🇹 🇸🇦 🇨🇳 🇯🇵 🇷🇺
- **IA Replit (OpenAI gpt-5-mini)** comme moteur principal — rapide, précis, culturellement adapté
- Fallback automatique sur QWEN API si des clés sont fournies
- Adaptation culturelle : devise locale, format de date, style RTL pour l'arabe

### 🖼️ Couverture IA
- Génération automatique d'une couverture premium via **gpt-image-1**
- Style glassmorphism dark avec accents or et violet
- Unique à chaque ebook

### 📦 Bundle ZIP
- Téléchargement d'une archive ZIP contenant toutes les versions linguistiques
- Nommage automatique intelligent
- Prêt pour déploiement sur Netlify / Vercel / GitHub Pages en 1 clic

### 🗄️ Historique Persistant
- Toutes les générations **sauvegardées définitivement** en PostgreSQL
- Dashboard historique avec re-téléchargement instantané
- Aperçu live de chaque ebook passé

### 👁️ Aperçu Live
- Iframe interactif pour prévisualiser l'ebook avant téléchargement
- Basculez entre les langues en temps réel

---

## 🛠️ Stack Technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React 18 + Vite + Wouter |
| Styles | Tailwind CSS + Glassmorphism custom |
| Animations | Framer Motion + Canvas Confetti |
| Backend | Express 5 (Node.js 24) |
| Base de données | PostgreSQL (Replit DB) + Drizzle ORM |
| IA Traduction | OpenAI gpt-5-mini via Replit AI Integrations |
| IA Images | OpenAI gpt-image-1 via Replit AI Integrations |
| Stockage objets | Google Cloud Storage (Replit App Storage) |
| API | OpenAPI 3.1 + Orval codegen |
| Monorepo | pnpm workspaces + TypeScript composite |

---

## 🏗️ Architecture

```
god-tier-ebook-generator/
├── artifacts/
│   ├── ebook-generator/          # Frontend React + Vite
│   │   └── src/
│   │       ├── pages/
│   │       │   ├── home.tsx      # Formulaire de génération
│   │       │   ├── generate.tsx  # Résultats + aperçu + téléchargement
│   │       │   └── history.tsx   # Dashboard historique
│   │       └── components/
│   └── api-server/               # Backend Express
│       └── src/
│           ├── routes/
│           │   └── ebook.ts      # Endpoints génération / historique / preview
│           └── lib/
│               ├── ebook-content.ts    # Générateur HTML (8 chapitres)
│               └── ebook-translator.ts # Moteur de traduction IA
├── lib/
│   ├── api-spec/                 # OpenAPI 3.1 spec
│   ├── api-client-react/         # Hooks React Query (générés)
│   ├── api-zod/                  # Schémas Zod (générés)
│   ├── db/                       # Drizzle ORM + schema PostgreSQL
│   └── integrations-openai-ai-server/  # Client OpenAI Replit
└── README.md
```

---

## 🔌 API Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/ebook/generate` | Génère un bundle ebook complet |
| `GET` | `/api/ebook/preview/:id` | Info bundle (langues, thème, marque) |
| `GET` | `/api/ebook/html/:id?lang=FR` | HTML brut pour aperçu live |
| `GET` | `/api/ebook/download/:id` | Téléchargement ZIP |
| `GET` | `/api/ebook/history` | Historique des générations |
| `GET` | `/api/healthz` | Statut du serveur |

---

## 🚦 Démarrage Rapide

```bash
# 1. Installer les dépendances
pnpm install

# 2. Variables d'environnement (configurées automatiquement par Replit)
# DATABASE_URL, AI_INTEGRATIONS_OPENAI_BASE_URL, AI_INTEGRATIONS_OPENAI_API_KEY

# 3. Pousser le schéma DB
pnpm --filter @workspace/db run push

# 4. Lancer en développement
# L'API server et le frontend démarrent automatiquement via les workflows Replit
```

---

## 📖 Contenu des Ebooks Générés

Chaque ebook contient **8 chapitres complets** :

1. **Introduction** — Manifeste du micro-business
2. **Mindset** — La psychologie du créateur
3. **Validation** — Tester avant de construire
4. **IA Workflow** — Automatisation intelligente
5. **Lancement** — De 0 à premières ventes en 7 jours
6. **Scaling** — Systèmes de croissance
7. **Communauté** — Levier d'audience
8. **Offres** — Structure tarifaire (Starter / Pro / Lifetime avec countdown)

Chaque chapitre inclut : témoignages clients, FAQ section, tableau des fonctionnalités, QR codes GitHub.

---

## 💡 Pourquoi "God Tier" ?

Parce que la plupart des générateurs d'ebooks produisent du PDF statique moyen. Celui-ci génère :
- Du **HTML interactif** avec animations CSS
- Un **design unique** à chaque génération (pas de template)
- Une **adaptation culturelle réelle** (pas juste de la traduction brute)
- Une **couverture IA** professionnelle
- Un **bundle prêt à vendre** en 60 secondes

---

## 🌟 Roadmap

- [ ] Export PDF depuis HTML
- [ ] Thèmes personnalisés par l'utilisateur
- [ ] Intégration Stripe directe dans l'ebook généré
- [ ] Hébergement automatique sur sous-domaine personnalisé
- [ ] Statistiques de lecture et analytics

---

## 📄 Licence

MIT — Libre d'utiliser, modifier et distribuer.

---

*Créé avec l'IA Replit · Alimenté par OpenAI · Design God Tier*
