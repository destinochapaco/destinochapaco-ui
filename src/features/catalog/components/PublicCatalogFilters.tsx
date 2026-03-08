// src/features/catalog/components/PublicCatalogFilters.tsx
import { useMemo } from "react";
import { Bed, Bus, Ticket, Briefcase, Minus, Plus } from "lucide-react";
import type { PublicPackage } from "../types";

interface Props {
    packages: PublicPackage[];
    activeFilters: string[];
    onFilterToggle: (categoryId: string) => void;
    peopleCount: number;
    onPeopleCountChange: (count: number) => void;
    // Nuevas props para el filtro de Tipo de Bus
    transportType: 'all' | 'cama' | 'semicama';
    onTransportTypeChange: (type: 'all' | 'cama' | 'semicama') => void;
}

const CATEGORY_MAP: Record<number, { label: string; icon: any; activeClass: string; inactiveClass: string }> = {
    601: { 
        label: "Inscripción", 
        icon: Ticket, 
        activeClass: "bg-blue-500 border-blue-500 text-white shadow-blue-500/30 md:scale-105",
        inactiveClass: "bg-blue-50 border-blue-500 text-blue-500 hover:bg-blue-100 hover:border-blue-300"
    }, 
    602: { 
        label: "Hospedaje", 
        icon: Bed, 
        activeClass: "bg-rose-500 border-rose-500 text-white shadow-rose-500/30 md:scale-105",
        inactiveClass: "bg-rose-50 border-rose-500 text-rose-500 hover:bg-rose-100 hover:border-rose-300"
    }, 
    603: { 
        label: "Transporte", 
        icon: Bus, 
        activeClass: "bg-emerald-500 border-emerald-500 text-white shadow-emerald-500/30 md:scale-105",
        inactiveClass: "bg-emerald-50 border-emerald-500 text-emerald-500 hover:bg-emerald-100 hover:border-emerald-300"
    },
};

const DEFAULT_CATEGORY_STYLE = { 
    label: "Extra", 
    icon: Briefcase, 
    activeClass: "bg-slate-500 border-slate-500 text-white shadow-slate-500/30 md:scale-105",
    inactiveClass: "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100 hover:border-slate-300"
};

export const PublicCatalogFilters = ({ packages, activeFilters, onFilterToggle, peopleCount, onPeopleCountChange, transportType, onTransportTypeChange }: Props) => {
    
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

    // LÓGICA DE VISIBILIDAD: Se muestra si no hay filtros, o si está seleccionado "Transporte" (603)
    const showTransportFilter = activeFilters.length === 0 || activeFilters.includes("603");

    return (
        <div className="flex flex-col gap-4 md:gap-5 w-full">
            
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

            {/* 2. FILTRO DE PERSONAS */}
            <div className="w-full max-w-sm md:max-w-[620px] mx-auto flex items-center justify-between bg-purple-50 px-4 py-2.5 md:px-8 md:py-4 rounded-xl md:rounded-2xl border-2 border-[#170822] shadow-sm mt-0">
                <div className="flex flex-col md:flex-row md:items-baseline md:gap-2 text-left">
                    <span className="text-sm md:text-base font-black text-[#170822] tracking-wide">
                        Cantidad de personas
                    </span>
                    <span className="hidden md:inline-block text-sm font-semibold text-[#170822]/60">
                        {peopleCount === 0 ? "(Todos)" : `(Para ${peopleCount} pax)`}
                    </span>
                </div>
                <div className="flex items-center gap-3 md:gap-4">
                    <button onClick={() => onPeopleCountChange(Math.max(0, peopleCount - 1))} disabled={peopleCount === 0} className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full border-2 border-[#170822]/20 text-[#170822] hover:border-[#170822] hover:bg-[#170822] hover:text-white disabled:opacity-30 disabled:hover:border-[#170822]/20 disabled:hover:bg-transparent transition-all duration-300 shrink-0">
                        <Minus className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={3} />
                    </button>
                    <span className="w-4 md:w-5 text-center font-black text-lg md:text-[22px] text-[#170822] tabular-nums">
                        {peopleCount}
                    </span>
                    <button onClick={() => onPeopleCountChange(Math.min(10, peopleCount + 1))} disabled={peopleCount === 10} className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full border-2 border-[#170822]/20 text-[#170822] hover:border-[#170822] hover:bg-[#170822] hover:text-white disabled:opacity-30 disabled:hover:border-[#170822]/20 disabled:hover:bg-transparent transition-all duration-300 shrink-0">
                        <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={3} />
                    </button>
                </div>
            </div>

            {/* 3. FILTRO TIPO DE BUS (Aparece y desaparece mágicamente) */}
            {showTransportFilter && (
                <div className="w-full max-w-sm md:max-w-[620px] mx-auto flex items-center gap-3 px-4 md:px-0">
                    
                    {/* Botón Bus Semi-Cama */}
                    <button
                        // Si ya está activo, al darle clic se desmarca (vuelve a 'all')
                        onClick={() => onTransportTypeChange(transportType === 'semicama' ? 'all' : 'semicama')}
                        className={`
                            flex-1 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl border-2 font-bold text-sm md:text-base transition-all duration-300
                            ${transportType === 'semicama' 
                                ? 'bg-[#170822] border-[#170822] text-white shadow-md shadow-[#170822]/20' 
                                : 'bg-transparent border-[#170822] text-[#170822] hover:bg-[#170822]/5'
                            }
                        `}
                    >
                        Bus Semi-Cama
                    </button>

                    {/* Botón Bus Cama */}
                    <button
                        onClick={() => onTransportTypeChange(transportType === 'cama' ? 'all' : 'cama')}
                        className={`
                            flex-1 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl border-2 font-bold text-sm md:text-base transition-all duration-300
                            ${transportType === 'cama' 
                                ? 'bg-[#170822] border-[#170822] text-white shadow-md shadow-[#170822]/20' 
                                : 'bg-transparent border-[#170822] text-[#170822] hover:bg-[#170822]/5'
                            }
                        `}
                    >
                        Bus Cama
                    </button>

                </div>
            )}

        </div>
    );
};