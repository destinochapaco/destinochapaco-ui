// src/features/catalog/components/PublicCatalogFilters.tsx
import { useMemo } from "react";
import { Bed, Bus, Ticket, Briefcase } from "lucide-react";
import type { PublicPackage } from "../types";

interface Props {
    packages: PublicPackage[];
    activeFilters: string[];
    onFilterToggle: (categoryId: string) => void;
}

// Mapa de estilos con colores específicos para estado Activo e Inactivo
const CATEGORY_MAP: Record<number, { label: string; icon: any; activeClass: string; inactiveClass: string }> = {
    601: { 
        label: "Inscripción", 
        icon: Ticket, 
        activeClass: "bg-blue-500 border-blue-500 text-white shadow-blue-500/30 md:scale-105",
        inactiveClass: "bg-blue-50 border-blue-200 text-blue-400 hover:bg-blue-100 hover:border-blue-300"
    }, 
    602: { 
        label: "Hospedaje", 
        icon: Bed, 
        activeClass: "bg-rose-500 border-rose-500 text-white shadow-rose-500/30 md:scale-105",
        inactiveClass: "bg-rose-50 border-rose-200 text-rose-400 hover:bg-rose-100 hover:border-rose-300"
    }, 
    603: { 
        label: "Transporte", 
        icon: Bus, 
        activeClass: "bg-emerald-500 border-emerald-500 text-white shadow-emerald-500/30 md:scale-105",
        inactiveClass: "bg-emerald-50 border-emerald-200 text-emerald-400 hover:bg-emerald-100 hover:border-emerald-300"
    },
};

const DEFAULT_CATEGORY_STYLE = { 
    label: "Extra", 
    icon: Briefcase, 
    activeClass: "bg-slate-500 border-slate-500 text-white shadow-slate-500/30 md:scale-105",
    inactiveClass: "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100 hover:border-slate-300"
};

export const PublicCatalogFilters = ({ packages, activeFilters, onFilterToggle }: Props) => {
    
    const availableCategories = useMemo(() => {
        const uniqueCodes = new Set<string>();

        packages.forEach(pkg => {
            pkg.details.forEach(d => uniqueCodes.add(String(d.categoryTypeCode)));
        });

        return Array.from(uniqueCodes).map(code => ({
            code,
            info: CATEGORY_MAP[Number(code)] || DEFAULT_CATEGORY_STYLE
        })).sort((a, b) => Number(a.code) - Number(b.code));
        
    }, [packages]);

    return (
        /* CONTENEDOR RESPONSIVO: 
           - Móvil: flex-nowrap (una fila), overflow-x-auto (scroll), justify-start.
           - PC (md): flex-wrap (bajan si no caben), overflow-visible (sin scroll), justify-center (centrados).
        */
        <div className="flex flex-nowrap md:flex-wrap overflow-x-auto md:overflow-visible justify-start md:justify-center gap-3 pb-4 px-4 md:px-0 scrollbar-hide snap-x">
            {availableCategories.map((cat) => {
                const isActive = activeFilters.includes(cat.code);
                const Icon = cat.info.icon;
                
                return (
                    <button
                        key={cat.code}
                        onClick={() => onFilterToggle(cat.code)}
                        className={`
                            flex items-center gap-2 border-2 transition-all duration-300 shadow-sm
                            shrink-0 snap-start
                            px-4 py-2.5 rounded-xl md:px-8 md:py-4 md:rounded-2xl
                            ${isActive ? cat.info.activeClass : cat.info.inactiveClass}
                        `}
                    >
                        {/* ICONO: w-5 en móvil, w-6 en PC */}
                        <Icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
                        
                        {/* TEXTO: text-sm en móvil, text-base en PC */}
                        <span className="font-bold text-sm md:text-base tracking-wide">
                            {cat.info.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};