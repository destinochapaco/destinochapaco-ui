import { MessageCircle } from "lucide-react";

interface SocialBannerProps {
    isInline?: boolean; // Para saber si está en medio de la lista o como footer
}

export const SocialBanner = ({ isInline = false }: SocialBannerProps) => {
    return (
        <div className={`
            w-full bg-gradient-to-br from-[#170822] via-[#200B30] to-[#170822] shadow-xl overflow-hidden relative transition-all duration-300
            ${isInline 
                ? 'my-2 rounded-3xl border border-purple-900/50 p-5 sm:p-6' 
                : 'rounded-t-[2rem] sm:rounded-t-[3rem] rounded-b-none border-t border-purple-500/30 px-5 sm:px-8 py-8 sm:py-10'
            }
        `}>
            {/* Pequeño brillo superior para efecto premium */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>

            {/* Contenedor interno: Si es footer, encerramos el contenido para que alinee perfecto con la grilla de arriba */}
            <div className={`w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6 ${!isInline ? 'max-w-6xl' : ''}`}>
                <div className="flex-1 text-center sm:text-left w-full relative z-10">
                    <h3 className="text-white font-black text-lg sm:text-2xl drop-shadow-md leading-tight tracking-tight">
                        ¿Quieres enterarte de todo? 🚀
                    </h3>
                    <p className="text-purple-200/70 text-xs sm:text-sm mt-1.5 leading-snug font-medium max-w-lg mx-auto sm:mx-0">
                        Únete a la comunidad chapaca. Entérate de nuevas promos, eventos y mira cómo la pasamos.
                    </p>
                </div>

                <div className="flex items-center justify-center gap-3 w-full sm:w-auto shrink-0 relative z-10">
                    <a 
                        href="https://www.tiktok.com/@congreso_tarija" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-black hover:bg-zinc-900 text-white border border-zinc-800 rounded-xl px-5 py-3.5 font-bold text-sm transition-all shadow-md group"
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                        </svg>
                        TikTok
                    </a>
                    
                    <a 
                        href="https://chat.whatsapp.com/I9coU9g53R0L5ln2jpNQlv?mode=gi_t" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20b858] text-white border-none rounded-xl px-5 py-3.5 font-black text-sm transition-all shadow-lg shadow-[#25D366]/20 group"
                    >
                        <MessageCircle size={18} className="group-hover:scale-110 transition-transform" />
                        Grupo VIP
                    </a>
                </div>
            </div>
        </div>
    );
};