import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Layout } from "@/components/layout";
import { usePreviewBundle } from "@workspace/api-client-react";
import {
  CheckCircle2,
  Download,
  Package,
  Paintbrush,
  Loader2,
  ArrowLeft,
  ExternalLink,
  Zap,
  AlertCircle,
  Eye,
  Clock,
  Image as ImageIcon,
} from "lucide-react";

export default function GeneratePage() {
  const [, navigate] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const bundleId = searchParams.get("bundle");
  const [isDownloading, setIsDownloading] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [previewLang, setPreviewLang] = useState("FR");
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!bundleId) navigate("/");
  }, [bundleId, navigate]);

  useEffect(() => {
    if (bundleId) {
      const stored = sessionStorage.getItem(`cover_${bundleId}`);
      if (stored) setCoverImage(stored);
    }
  }, [bundleId]);

  const { data: bundleData, isLoading, isError } = usePreviewBundle(bundleId || "", {
    query: {
      enabled: !!bundleId,
      refetchInterval: (query) => {
        if (!query.state.data) return 2000;
        if (!query.state.data.coverImageBase64) return 5000;
        return false;
      },
      retry: 10,
    },
  });

  useEffect(() => {
    if (bundleData?.coverImageBase64) {
      setCoverImage(bundleData.coverImageBase64);
    }
  }, [bundleData?.coverImageBase64]);

  useEffect(() => {
    if (bundleData) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function () {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ["#8b5cf6", "#eab308", "#d946ef"],
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ["#8b5cf6", "#eab308", "#d946ef"],
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [bundleData]);

  const handleDownload = () => {
    if (!bundleId) return;
    setIsDownloading(true);
    const url = `/api/ebook/download/${bundleId}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = `god-tier-ebook-${bundleId}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => setIsDownloading(false), 2000);
  };

  if (!bundleId) return null;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au générateur
          </button>
          <button
            onClick={() => navigate("/history")}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-medium"
          >
            <Clock className="w-4 h-4" />
            Historique
          </button>
        </div>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-panel rounded-3xl p-16 text-center space-y-8 mt-12"
          >
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
              <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
              <div className="absolute inset-2 rounded-full border-b-2 border-secondary animate-spin-slow" />
              <Package className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-display font-bold text-white">Génération en cours...</h2>
              <p className="text-white/60">L'IA traduit et assemble votre ebook multi-langues.</p>
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-white/40">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Traduction IA Replit · Génération couverture · Compilation ZIP</span>
              </div>
            </div>
          </motion.div>
        )}

        {isError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel rounded-3xl p-12 text-center border-red-500/30"
          >
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-3xl font-display font-bold text-white mb-4">Bundle introuvable</h2>
            <p className="text-white/60 mb-8">Ce bundle n'existe pas ou une erreur s'est produite.</p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors font-medium"
            >
              Générer un nouvel ebook
            </button>
          </motion.div>
        )}

        {bundleData && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Success Header */}
            <div className="text-center space-y-4 mb-10">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500/10 rounded-full mb-4 relative">
                <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full" />
                <CheckCircle2 className="w-12 h-12 text-green-400 relative z-10" />
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
                Chef d'œuvre <span className="text-gradient">Créé</span>
              </h1>
              <p className="text-lg text-white/60">Votre ebook multi-langues est prêt — sauvegardé définitivement.</p>
            </div>

            {/* Cover Image + Bundle Info Row */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Cover Image */}
              <div className="glass-panel rounded-3xl overflow-hidden flex flex-col items-center justify-center p-6 min-h-[280px]">
                {coverImage ? (
                  <>
                    <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <ImageIcon className="w-3 h-3" /> Couverture IA Générée
                    </p>
                    <img
                      src={`data:image/png;base64,${coverImage}`}
                      alt="Couverture ebook"
                      className="rounded-xl w-full max-w-[220px] shadow-2xl border border-white/10"
                    />
                  </>
                ) : (
                  <div className="text-center space-y-3">
                    <div className="relative w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <div className="absolute inset-0 rounded-full border-t-2 border-primary/40 animate-spin" />
                      <ImageIcon className="w-7 h-7 text-primary/50" />
                    </div>
                    <p className="text-white/50 text-sm font-medium">Couverture IA en cours...</p>
                    <p className="text-white/25 text-xs">Génération gpt-image-1 en arrière-plan</p>
                  </div>
                )}
              </div>

              {/* Bundle Info */}
              <div className="glass-panel rounded-3xl overflow-hidden">
                <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-6 border-b border-white/5">
                  <div className="flex items-center gap-3 mb-2">
                    <Package className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-bold text-white">Bundle #{bundleData.bundleId.slice(0, 8)}</h3>
                  </div>
                  <p className="text-white/60 flex items-center gap-2 text-sm">
                    <Paintbrush className="w-4 h-4" />
                    Thème:{" "}
                    <span className="text-white font-medium capitalize">
                      {bundleData.designTheme || "Cosmic Dark"}
                    </span>
                  </p>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-black/20 border border-white/5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center font-bold text-sm">
                      {bundleData.brandName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-wider">Marque</p>
                      <p className="text-white font-bold">{bundleData.brandName}</p>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">
                    Versions ({bundleData.languages.length})
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {bundleData.languages.map((lang, idx) => (
                      <motion.div
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * idx }}
                        key={lang.code}
                        className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/5"
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <div className="min-w-0">
                          <p className="text-white text-sm font-semibold leading-tight truncate">{lang.name}</p>
                        </div>
                        <CheckCircle2 className="w-3 h-3 text-green-500 ml-auto shrink-0 opacity-70" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Live Preview Section */}
            <div className="glass-panel rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-bold text-white">Aperçu Live</h3>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {bundleData.languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setPreviewLang(lang.code);
                        setShowPreview(true);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                        previewLang === lang.code && showPreview
                          ? "bg-primary/30 border-primary/60 text-white"
                          : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {lang.flag} {lang.code}
                    </button>
                  ))}
                </div>
              </div>

              {showPreview ? (
                <div className="relative">
                  <iframe
                    key={`${bundleId}-${previewLang}`}
                    src={`/api/ebook/html/${bundleId}?lang=${previewLang}`}
                    className="w-full border-0"
                    style={{ height: "600px" }}
                    title="Aperçu ebook"
                    sandbox="allow-same-origin allow-scripts"
                  />
                </div>
              ) : (
                <div className="p-12 text-center">
                  <button
                    onClick={() => setShowPreview(true)}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-primary/20 hover:bg-primary/30 border border-primary/30 text-white rounded-2xl transition-all font-medium"
                  >
                    <Eye className="w-5 h-5" />
                    Afficher l'aperçu de l'ebook
                  </button>
                  <p className="text-white/30 text-sm mt-3">L'ebook s'affichera dans un cadre interactif</p>
                </div>
              )}
            </div>

            {/* Download Button */}
            <div className="glass-panel rounded-3xl p-6">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full relative overflow-hidden group rounded-2xl p-[2px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-400 opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-black/40 backdrop-blur-sm rounded-xl px-8 py-5 flex items-center justify-center gap-3">
                  {isDownloading ? (
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  ) : (
                    <Download className="w-6 h-6 text-white" />
                  )}
                  <span className="text-xl font-bold text-white tracking-wide">
                    {isDownloading ? "Préparation du téléchargement..." : "Télécharger l'archive ZIP"}
                  </span>
                </div>
              </button>
            </div>

            {/* Next Steps */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-2xl">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                  <ExternalLink className="w-5 h-5 text-blue-400" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">1. Déployez en 1 clic</h4>
                <p className="text-white/60 text-sm">
                  Extrayez le ZIP et glissez-déposez sur Netlify, Vercel ou GitHub Pages pour mettre votre ebook en ligne instantanément.
                </p>
              </div>

              <div className="glass-panel p-6 rounded-2xl">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5 text-amber-400" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">2. Vendez l'accès</h4>
                <p className="text-white/60 text-sm">
                  Connectez un bouton de paiement Stripe à votre nouvelle landing page et encaissez vos premières ventes immédiatement.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
