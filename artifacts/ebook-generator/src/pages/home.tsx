import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { Book, Globe, KeyRound, Sparkles, AlertCircle, ChevronDown, Check, Loader2 } from "lucide-react";
import { useGenerateEbook } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";

const LANGUAGES = [
  { code: 'FR', name: 'Français', flag: '🇫🇷' },
  { code: 'EN', name: 'English', flag: '🇬🇧' },
  { code: 'ES', name: 'Español', flag: '🇪🇸' },
  { code: 'DE', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'IT', name: 'Italiano', flag: '🇮🇹' },
  { code: 'PT', name: 'Português', flag: '🇵🇹' },
  { code: 'AR', name: 'العربية', flag: '🇸🇦' },
  { code: 'ZH', name: '中文', flag: '🇨🇳' },
  { code: 'JA', name: '日本語', flag: '🇯🇵' },
  { code: 'RU', name: 'Русский', flag: '🇷🇺' }
];

const formSchema = z.object({
  ebookTitle: z.string().min(3, "Le titre doit faire au moins 3 caractères"),
  ebookSubtitle: z.string().optional(),
  authorName: z.string().min(2, "Le nom de l'auteur est requis"),
  githubRepoLink: z.string().url("Veuillez entrer une URL valide").optional().or(z.literal("")),
  brandName: z.string().optional(),
  priceStarter: z.coerce.number().min(0).optional().default(49),
  pricePro: z.coerce.number().min(0).optional().default(99),
  priceLifetime: z.coerce.number().min(0).optional().default(199),
  promoEndDate: z.string().optional(),
  selectedLangs: z.array(z.string()).min(1, "Sélectionnez au moins une langue"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Home() {
  const [, navigate] = useLocation();
  const generateMutation = useGenerateEbook();
  const [apiKeys, setApiKeys] = useState<string[]>(['', '', '']);
  const [isApiKeysOpen, setIsApiKeysOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ebookTitle: "",
      ebookSubtitle: "",
      authorName: "",
      githubRepoLink: "",
      brandName: "",
      priceStarter: 49,
      pricePro: 99,
      priceLifetime: 199,
      selectedLangs: ['FR'],
    }
  });

  const selectedLangs = watch("selectedLangs");

  const onSubmit = async (data: FormValues) => {
    try {
      const validApiKeys = apiKeys.filter(k => k.trim() !== '');
      
      const payload = {
        ...data,
        apiKeys: validApiKeys.length > 0 ? validApiKeys : undefined,
      };

      const result = await generateMutation.mutateAsync({ data: payload });
      
      if (result.success && result.bundleId) {
        if (result.coverImageBase64) {
          sessionStorage.setItem(`cover_${result.bundleId}`, result.coverImageBase64);
        }
        navigate(`/generate?bundle=${result.bundleId}`);
      }
    } catch (err) {
      console.error("Generation failed:", err);
    }
  };

  const updateApiKey = (index: number, value: string) => {
    const newKeys = [...apiKeys];
    newKeys[index] = value;
    if (index === apiKeys.length - 1 && value && apiKeys.length < 10) {
      newKeys.push(''); // Auto-add new empty field
    }
    setApiKeys(newKeys);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-12 pb-24">
        
        {/* Header Title */}
        <div className="text-center space-y-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-primary/30 text-primary-foreground text-sm font-medium"
          >
            <Sparkles className="w-4 h-4 text-secondary" />
            <span>Propulsé par l'IA Générative QWEN</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold font-display tracking-tight leading-tight">
            Générateur d'Ebook <br />
            <span className="text-gradient">God Tier</span>
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto font-light">
            Concevez, traduisez en 10 langues et déployez un ebook interactif au design unique et professionnel en quelques secondes.
          </p>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* General Info Section */}
          <section className="glass-panel rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Book className="w-32 h-32 text-primary" />
            </div>
            
            <h2 className="text-2xl font-display font-semibold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm">1</span>
              Informations du livre
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 relative z-10">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Titre de l'ebook <span className="text-red-500">*</span></label>
                <input 
                  {...register("ebookTitle")} 
                  className="w-full px-4 py-3 rounded-xl glass-input"
                  placeholder="Ex: Le Guide Ultime de React"
                />
                {errors.ebookTitle && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.ebookTitle.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Sous-titre</label>
                <input 
                  {...register("ebookSubtitle")} 
                  className="w-full px-4 py-3 rounded-xl glass-input"
                  placeholder="Ex: Maîtrisez le web moderne en 30 jours"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Nom de l'auteur <span className="text-red-500">*</span></label>
                <input 
                  {...register("authorName")} 
                  className="w-full px-4 py-3 rounded-xl glass-input"
                  placeholder="Ex: Jean Dupont"
                />
                {errors.authorName && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.authorName.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Lien GitHub (Optionnel)</label>
                <input 
                  {...register("githubRepoLink")} 
                  type="url"
                  className="w-full px-4 py-3 rounded-xl glass-input"
                  placeholder="https://github.com/..."
                />
                {errors.githubRepoLink && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.githubRepoLink.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Nom de marque (Laisser vide pour auto)</label>
                <input 
                  {...register("brandName")} 
                  className="w-full px-4 py-3 rounded-xl glass-input"
                  placeholder="Ex: DevGod Studio"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Date de fin de promo</label>
                <input 
                  {...register("promoEndDate")} 
                  type="date"
                  className="w-full px-4 py-3 rounded-xl glass-input"
                />
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section className="glass-panel rounded-3xl p-8">
            <h2 className="text-2xl font-display font-semibold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary text-sm">2</span>
              Stratégie de prix (€)
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Offre Starter</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 font-bold">€</span>
                  <input 
                    {...register("priceStarter")} 
                    type="number"
                    className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-lg font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80 text-primary">Offre Pro (Recommandée)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50 font-bold">€</span>
                  <input 
                    {...register("pricePro")} 
                    type="number"
                    className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-lg font-bold border-primary/30 ring-1 ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Offre Lifetime</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 font-bold">€</span>
                  <input 
                    {...register("priceLifetime")} 
                    type="number"
                    className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-lg font-bold"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Languages Section */}
          <section className="glass-panel rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Globe className="w-32 h-32 text-blue-500" />
            </div>

            <h2 className="text-2xl font-display font-semibold text-white mb-2 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm">3</span>
              Portée Internationale
            </h2>
            <p className="text-white/50 text-sm mb-6 ml-11">Sélectionnez les langues de traduction. Le Français est inclus par défaut.</p>
            
            <Controller
              control={control}
              name="selectedLangs"
              render={({ field }) => (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 relative z-10">
                  {LANGUAGES.map(lang => {
                    const isSelected = field.value.includes(lang.code);
                    const isFR = lang.code === 'FR';
                    
                    return (
                      <label 
                        key={lang.code} 
                        className={`
                          flex flex-col items-center justify-center gap-2 p-4 rounded-2xl cursor-pointer transition-all duration-300
                          ${isSelected 
                            ? 'bg-primary/20 border-2 border-primary/50 shadow-[0_0_15px_rgba(139,92,246,0.2)]' 
                            : 'bg-black/20 border-2 border-white/5 hover:border-white/20'
                          }
                          ${isFR ? 'opacity-70 cursor-not-allowed' : ''}
                        `}
                      >
                        <input 
                          type="checkbox" 
                          className="hidden"
                          checked={isSelected}
                          disabled={isFR}
                          onChange={(e) => {
                            if (isFR) return;
                            const newSelection = e.target.checked 
                              ? [...field.value, lang.code]
                              : field.value.filter(l => l !== lang.code);
                            field.onChange(newSelection);
                          }}
                        />
                        <span className="text-3xl drop-shadow-md">{lang.flag}</span>
                        <span className="text-sm font-medium text-white/90">{lang.name}</span>
                        {isSelected && !isFR && (
                          <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                        {isFR && (
                          <div className="absolute top-2 right-2 text-xs text-white/40 font-bold">Base</div>
                        )}
                      </label>
                    );
                  })}
                </div>
              )}
            />
            {errors.selectedLangs && <p className="text-red-400 text-xs mt-4 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.selectedLangs.message}</p>}
          </section>

          {/* API Keys (Advanced) */}
          <section className="glass-panel rounded-3xl p-8">
            <button 
              type="button"
              onClick={() => setIsApiKeysOpen(!isApiKeysOpen)}
              className="w-full flex items-center justify-between group"
            >
              <h2 className="text-xl font-display font-semibold text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-sm group-hover:bg-white/20 transition-colors">
                  <KeyRound className="w-4 h-4" />
                </span>
                Clés API QWEN (Avancé)
              </h2>
              <ChevronDown className={`w-6 h-6 text-white/50 transition-transform duration-300 ${isApiKeysOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {isApiKeysOpen && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-6 border-t border-white/10 mt-6 space-y-4">
                    <p className="text-white/50 text-sm mb-4">Fournissez vos propres clés API QWEN pour garantir une vitesse de traduction maximale via notre système de rotation intelligent. Laissez vide pour utiliser notre pool gratuit (plus lent).</p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      {apiKeys.map((key, idx) => (
                        <div key={idx} className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-xs font-mono">
                            {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                          </div>
                          <input 
                            type="password"
                            value={key}
                            onChange={(e) => updateApiKey(idx, e.target.value)}
                            placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
                            className="w-full pl-10 pr-4 py-3 rounded-xl glass-input font-mono text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Submit Action */}
          <div className="pt-8">
            <button
              type="submit"
              disabled={generateMutation.isPending}
              className="w-full relative overflow-hidden group rounded-2xl p-[2px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-amber-500 animate-gradient-xy opacity-80 group-hover:opacity-100" />
              <div className="relative bg-black/50 backdrop-blur-sm rounded-xl px-8 py-5 flex items-center justify-center gap-3">
                {generateMutation.isPending ? (
                  <>
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                    <span className="text-xl font-bold text-white tracking-wide">Forgeage God Tier en cours...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 text-amber-400" />
                    <span className="text-xl font-bold text-white tracking-wide">Générer le Bundle Ultime</span>
                  </>
                )}
              </div>
            </button>
            
            {generateMutation.isPending && (
              <div className="mt-6 text-center space-y-3">
                <p className="text-primary font-medium animate-pulse">Initialisation de l'IA Qwen...</p>
                <div className="w-full max-w-md mx-auto h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-violet-500 to-amber-500"
                    initial={{ width: "0%" }}
                    animate={{ width: "85%" }}
                    transition={{ duration: 15, ease: "easeOut" }}
                  />
                </div>
                <p className="text-xs text-white/40">Cette opération peut prendre quelques minutes selon le nombre de langues choisies.</p>
              </div>
            )}
            
            {generateMutation.isError && (
              <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center flex items-center justify-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span>Erreur de génération. Veuillez vérifier vos informations et réessayer.</span>
              </div>
            )}
          </div>
        </form>
      </div>
    </Layout>
  );
}
