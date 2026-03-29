import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout";
import { useGetEbookHistory } from "@workspace/api-client-react";
import {
  ArrowLeft,
  Clock,
  Download,
  Package,
  Globe,
  Loader2,
  BookOpen,
  Eye,
  Sparkles,
} from "lucide-react";

const LANG_FLAGS: Record<string, string> = {
  FR: "🇫🇷", EN: "🇬🇧", ES: "🇪🇸", DE: "🇩🇪", IT: "🇮🇹",
  PT: "🇵🇹", AR: "🇸🇦", ZH: "🇨🇳", JA: "🇯🇵", RU: "🇷🇺",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HistoryPage() {
  const [, navigate] = useLocation();
  const { data, isLoading, isError, refetch } = useGetEbookHistory();

  const handleDownload = (bundleId: string, brandName: string) => {
    const url = `/api/ebook/download/${bundleId}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = `ebook-${brandName.replace(/\s+/g, "-").toLowerCase()}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-white">Historique des Ebooks</h1>
              <p className="text-white/40 text-sm">Toutes vos générations sauvegardées</p>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="glass-panel rounded-3xl p-16 text-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
            <p className="text-white/60">Chargement de l'historique...</p>
          </div>
        )}

        {isError && (
          <div className="glass-panel rounded-3xl p-12 text-center">
            <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/60 mb-4">Impossible de charger l'historique.</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white text-sm transition-colors"
            >
              Réessayer
            </button>
          </div>
        )}

        {data && data.items.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-3xl p-16 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-primary/60" />
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-3">Aucun ebook généré</h2>
            <p className="text-white/50 mb-8">
              Commencez à créer votre premier ebook God Tier !
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold transition-all hover:scale-105"
            >
              Générer mon premier ebook
            </button>
          </motion.div>
        )}

        {data && data.items.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/40 text-sm">
                {data.total} ebook{data.total > 1 ? "s" : ""} généré{data.total > 1 ? "s" : ""}
              </p>
            </div>

            {data.items.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="glass-panel rounded-2xl overflow-hidden hover:border-white/20 transition-all border border-white/5"
              >
                <div className="p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
                  {/* Icon & Brand */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center shrink-0 font-bold text-lg text-white border border-white/10">
                      {item.brandName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-white font-bold text-lg leading-tight truncate">{item.ebookTitle}</h3>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="text-white/40 text-sm flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          {item.brandName}
                        </span>
                        <span className="text-white/30 text-xs">•</span>
                        <span className="text-white/40 text-sm">{item.designTheme}</span>
                        <span className="text-white/30 text-xs">•</span>
                        <span className="text-white/40 text-sm flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          {item.languageCount} langue{item.languageCount > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Languages Flags */}
                  <div className="flex items-center gap-1 shrink-0">
                    {(item.selectedLangs as string[]).slice(0, 6).map((lang) => (
                      <span key={lang} className="text-xl" title={lang}>
                        {LANG_FLAGS[lang] ?? "🌐"}
                      </span>
                    ))}
                    {(item.selectedLangs as string[]).length > 6 && (
                      <span className="text-white/40 text-xs ml-1">+{(item.selectedLangs as string[]).length - 6}</span>
                    )}
                  </div>

                  {/* Date + Actions */}
                  <div className="flex flex-col md:items-end gap-3 shrink-0">
                    <p className="text-white/30 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(item.createdAt)}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/generate?bundle=${item.id}`)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white rounded-lg text-sm transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Aperçu
                      </button>
                      <button
                        onClick={() => handleDownload(item.id, item.brandName)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 rounded-lg text-sm transition-all font-medium"
                      >
                        <Download className="w-3.5 h-3.5" />
                        ZIP
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
