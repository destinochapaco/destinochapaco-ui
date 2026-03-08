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
    activeClass: "bg-slate-500 border-slate-500 text-white shadow-slate-500/30",
    inactiveClass: "bg-transparent border-[#170822] text-[#170822] hover:bg-[#170822]/5"
};

export const PublicCatalogFilters = ({ packages, activeFilters, onFilterToggle, peopleCount, onPeopleCountChange, transportType, onTransportTypeChange }: Props) => {
    
    // 1. Obtener categorías únicas
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

    // 2. Obtener los saltos válidos de cantidad de personas (Ej: [0, 1, 2, 3, 6])
    const validPeopleCounts = useMemo(() => {
        // Obtenemos las cantidades únicas de los paquetes
        const counts = new Set(packages.map(pkg => pkg.peopleCount));
        // Las convertimos en array, las ordenamos de menor a mayor, y agregamos el 0 al inicio
        return [0, ...Array.from(counts).sort((a, b) => a - b)];
    }, [packages]);

    // Lógicas para saber dónde estamos dentro del array de saltos [0, 1, 2, 3, 6]
    const currentCountIndex = validPeopleCounts.indexOf(peopleCount);
    const isMinCount = currentCountIndex <= 0;
    const isMaxCount = currentCountIndex >= validPeopleCounts.length - 1;

    // Estado visual del filtro de personas
    const isPeopleFilterActive = peopleCount > 0;
    const showTransportFilter = activeFilters.length === 0 || activeFilters.includes("603");

    return (
        <div className="flex flex-col gap-2 md:gap-4 w-full px-4 md:px-0 max-w-[100%] sm:max-w-[480px] md:max-w-[620px] mx-auto">
            
            {/* 1. FILTRO DE CATEGORÍAS */}
            <div className="flex w-full gap-2 md:gap-3">
                {availableCategories.map((cat) => {
                    const isActive = activeFilters.includes(cat.code);
                    const Icon = cat.info.icon;
                    return (
                        <button
                            key={cat.code}
                            onClick={() => onFilterToggle(cat.code)}
                            className={`
                                flex-1 flex items-center justify-center gap-1.5 md:gap-2 border-2 transition-all duration-300 shadow-sm
                                h-12 md:h-14 rounded-xl md:rounded-2xl
                                ${isActive ? cat.info.activeClass : cat.info.inactiveClass}
                            `}
                        >
                            <Icon className="hidden sm:block w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
                            <span className="font-bold text-[11px] sm:text-sm md:text-base tracking-tight md:tracking-wide truncate px-1">
                                {cat.info.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* 2. FILTRO DE PERSONAS (Dinámico y con cambio de color) */}
            <div className={`
                w-full h-12 md:h-14 flex items-center justify-between px-3 md:px-6 rounded-xl md:rounded-2xl border-2 shadow-sm transition-all duration-300
                ${isPeopleFilterActive ? 'bg-[#170822] border-[#170822]' : 'bg-purple-50 border-[#170822]'}
            `}>
                <div className="flex items-center gap-1.5 md:gap-2 text-left">
                    <span className={`text-[11px] sm:text-sm md:text-base font-black tracking-wide ${isPeopleFilterActive ? 'text-white' : 'text-[#170822]'}`}>
                        Cantidad de personas
                    </span>
                    <span className={`hidden md:inline-block text-sm font-semibold ${isPeopleFilterActive ? 'text-white/70' : 'text-[#170822]/60'}`}>
                        {peopleCount === 0 ? "(Todos)" : `(Para ${peopleCount} persona${peopleCount > 1 ? 's' : ''})`}
                    </span>
                </div>
                
                <div className="flex items-center gap-2 md:gap-4">
                    {/* Botón Menos (-) */}
                    <button 
                        onClick={() => { if (!isMinCount) onPeopleCountChange(validPeopleCounts[currentCountIndex - 1]) }} 
                        disabled={isMinCount} 
                        className={`w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full border-2 transition-all duration-300 shrink-0
                            ${isPeopleFilterActive 
                                ? 'border-white/20 text-white hover:border-white hover:bg-white hover:text-[#170822] disabled:opacity-30 disabled:hover:border-white/20 disabled:hover:bg-[#170822] disabled:hover:text-white' 
                                : 'border-[#170822]/20 text-[#170822] hover:border-[#170822] hover:bg-[#170822] hover:text-white disabled:opacity-30 disabled:hover:border-[#170822]/20 disabled:hover:bg-transparent disabled:hover:text-[#170822]'
                            }
                        `}
                    >
                        <Minus className="w-3 h-3 md:w-4 md:h-4" strokeWidth={3} />
                    </button>
                    
                    {/* Número Central */}
                    <span className={`w-4 md:w-5 text-center font-black text-sm sm:text-lg md:text-[22px] tabular-nums ${isPeopleFilterActive ? 'text-white' : 'text-[#170822]'}`}>
                        {peopleCount}
                    </span>
                    
                    {/* Botón Más (+) */}
                    <button 
                        onClick={() => { if (!isMaxCount) onPeopleCountChange(validPeopleCounts[currentCountIndex + 1]) }} 
                        disabled={isMaxCount} 
                        className={`w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full border-2 transition-all duration-300 shrink-0
                            ${isPeopleFilterActive 
                                ? 'border-white/20 text-white hover:border-white hover:bg-white hover:text-[#170822] disabled:opacity-30 disabled:hover:border-white/20 disabled:hover:bg-[#170822] disabled:hover:text-white' 
                                : 'border-[#170822]/20 text-[#170822] hover:border-[#170822] hover:bg-[#170822] hover:text-white disabled:opacity-30 disabled:hover:border-[#170822]/20 disabled:hover:bg-transparent disabled:hover:text-[#170822]'
                            }
                        `}
                    >
                        <Plus className="w-3 h-3 md:w-4 md:h-4" strokeWidth={3} />
                    </button>
                </div>
            </div>

            {/* 3. FILTRO TIPO DE BUS */}
            {showTransportFilter && (
                <div className="w-full flex items-center gap-2 md:gap-3">
                    <button
                        onClick={() => onTransportTypeChange(transportType === 'semicama' ? 'all' : 'semicama')}
                        className={`flex-1 flex items-center justify-center h-12 md:h-14 rounded-xl md:rounded-2xl border-2 font-bold text-[11px] sm:text-sm md:text-base transition-all duration-300
                            ${transportType === 'semicama' ? 'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/30' : 'bg-transparent border-orange-400 text-orange-600 hover:bg-orange-50'}`}
                    >
                        Bus Semi-Cama
                    </button>

                    <button
                        onClick={() => onTransportTypeChange(transportType === 'cama' ? 'all' : 'cama')}
                        className={`flex-1 flex items-center justify-center h-12 md:h-14 rounded-xl md:rounded-2xl border-2 font-bold text-[11px] sm:text-sm md:text-base transition-all duration-300
                            ${transportType === 'cama' ? 'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/30' : 'bg-transparent border-orange-400 text-orange-600 hover:bg-orange-50'}`}
                    >
                        Bus Cama
                    </button>
                </div>
            )}

        </div>
    );
};