// src/features/catalog/components/PublicCatalogFilters.tsx
import { useMemo } from "react";
import { Bed, Bus, Ticket, Briefcase, Minus, Plus } from "lucide-react";
import type { PublicPackage } from "../types";

interface Props {
    packages: PublicPackage[];
    activeFilters: string[];
    onFilterToggle: (categoryId: string) => void;
    // Nuevas Props para el filtro de personas
    peopleCount: number;
    onPeopleCountChange: (count: number) => void;
}

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

export const PublicCatalogFilters = ({ packages, activeFilters, onFilterToggle, peopleCount, onPeopleCountChange }: Props) => {
    
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
        <div className="flex flex-col gap-6 w-full">
            
            {/* 1. FILTRO DE CATEGORÍAS (Píldoras) */}
            <div className="flex flex-nowrap md:flex-wrap overflow-x-auto md:overflow-visible justify-start md:justify-center gap-3 px-4 md:px-0 scrollbar-hide snap-x">
                {availableCategories.map((cat) => {
                    const isActive = activeFilters.includes(cat.code);
                    const Icon = cat.info.icon;
                    return (
                        <button
                            key={cat.code}
                            onClick={() => onFilterToggle(cat.code)}
                            className={`
                                flex items-center gap-2 border-2 transition-all duration-300 shadow-sm
                                shrink-0 snap-start px-4 py-2.5 rounded-xl md:px-8 md:py-4 md:rounded-2xl
                                ${isActive ? cat.info.activeClass : cat.info.inactiveClass}
                            `}
                        >
                            <Icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
                            <span className="font-bold text-sm md:text-base tracking-wide">
                                {cat.info.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* 2. FILTRO DE PERSONAS (Estilo Claro con Borde Oscuro - Slim en Móvil) */}
            <div className="w-full max-w-sm mx-auto flex items-center justify-between bg-purple-50 px-4 py-2 md:px-5 md:py-3.5 rounded-xl md:rounded-2xl border-2 border-[#170822] shadow-sm mt-0 md:mt-2">
                
                <div className="flex flex-col text-left">
                    {/* Título: Tamaño normal en móvil, más grande en PC */}
                    <span className="text-sm md:text-base font-black text-[#170822] tracking-wide">
                        Cantidad de personas
                    </span>
                    {/* Subtítulo: Oculto en móvil (hidden) y visible en PC (md:block) */}
                    <span className="hidden md:block text-xs font-semibold text-[#170822]/60 mt-0.5">
                        {peopleCount === 0 ? "Mostrando todos los grupos" : `Para ${peopleCount} pax`}
                    </span>
                </div>

                {/* Controles: Un poco más pequeños y juntos en móvil */}
                <div className="flex items-center gap-3 md:gap-4">
                    {/* Botón Menos (-) */}
                    <button
                        onClick={() => onPeopleCountChange(Math.max(0, peopleCount - 1))}
                        disabled={peopleCount === 0}
                        className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full border-2 border-[#170822]/20 text-[#170822] hover:border-[#170822] hover:bg-[#170822] hover:text-white disabled:opacity-30 disabled:hover:border-[#170822]/20 disabled:hover:bg-transparent disabled:hover:text-[#170822] transition-all duration-300 shrink-0"
                    >
                        <Minus className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={3} />
                    </button>
                    
                    {/* Número Central */}
                    <span className="w-4 md:w-5 text-center font-black text-lg md:text-[22px] text-[#170822] tabular-nums">
                        {peopleCount}
                    </span>
                    
                    {/* Botón Más (+) */}
                    <button
                        onClick={() => onPeopleCountChange(Math.min(10, peopleCount + 1))}
                        disabled={peopleCount === 10}
                        className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full border-2 border-[#170822]/20 text-[#170822] hover:border-[#170822] hover:bg-[#170822] hover:text-white disabled:opacity-30 disabled:hover:border-[#170822]/20 disabled:hover:bg-transparent disabled:hover:text-[#170822] transition-all duration-300 shrink-0"
                    >
                        <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={3} />
                    </button>
                </div>
            </div>

        </div>
    );
};