// src/features/catalog/components/PublicCatalogFilters.tsx
import { useMemo } from "react";
import { Bed, Bus, Ticket, Layers, Briefcase } from "lucide-react";
import type { PublicPackage } from "../types";

interface Props {
    packages: PublicPackage[];
    activeFilter: string;
    onFilterChange: (filterId: string) => void;
}

// Mapa de colores e iconos según el código de categoría
const CATEGORY_MAP: Record<number, { label: string; icon: any; color: string }> = {
    601: { label: "Congreso", icon: Ticket, color: "text-blue-500" }, 
    602: { label: "Hospedaje", icon: Bed, color: "text-pink-500" }, 
    603: { label: "Bus", icon: Bus, color: "text-green-500" },
};

export const PublicCatalogFilters = ({ packages, activeFilter, onFilterChange }: Props) => {
    const filters = useMemo(() => {
        const uniqueCombinations = new Map<string, { categories: any[]; count: number }>();
        
        uniqueCombinations.set("ALL", { 
            categories: [{ label: "Todos los Paquetes", icon: Layers, color: "text-primary" }], 
            count: packages.length 
        });

        packages.forEach(pkg => {
            const codes = Array.from(new Set(pkg.details.map(d => d.categoryTypeCode))).sort();
            const comboId = codes.join("-");
            
            if (!uniqueCombinations.has(comboId)) {
                const categoriesList = codes.map(c => ({
                    label: CATEGORY_MAP[c]?.label || "Extra",
                    icon: CATEGORY_MAP[c]?.icon || Briefcase,
                    color: CATEGORY_MAP[c]?.color || "text-slate-400"
                }));
                uniqueCombinations.set(comboId, { categories: categoriesList, count: 0 });
            }
            uniqueCombinations.get(comboId)!.count++;
        });

        return Array.from(uniqueCombinations.entries()).map(([id, data]) => ({ id, ...data }));
    }, [packages]);

    return (
        <div className="flex flex-nowrap overflow-x-auto gap-3 pb-4 scrollbar-hide snap-x px-4 md:px-0">
            {filters.map((filter) => {
                const isActive = activeFilter === filter.id;
                return (
                    <button
                        key={filter.id}
                        onClick={() => onFilterChange(filter.id)}
                        className={`
                            flex items-center gap-2 px-5 py-3 rounded-2xl border-2 transition-all duration-300 whitespace-nowrap snap-start shrink-0
                            ${isActive 
                                ? "bg-primary border-primary text-primary-content shadow-lg scale-105" 
                                : "bg-base-100 border-base-200 text-base-content hover:border-primary/50"
                            }
                        `}
                    >
                        <div className="flex items-center gap-2">
                            {filter.categories.map((cat, index) => {
                                const Icon = cat.icon;
                                return (
                                    <div key={index} className="flex items-center gap-1">
                                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : cat.color}`} strokeWidth={2.5} />
                                        {/* Solo mostramos el texto si es el único icono, o si es la vista de "Todos" para ahorrar espacio */}
                                        {(filter.categories.length === 1 || filter.id === "ALL") && (
                                            <span className="font-bold text-sm">{cat.label}</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <span className={`text-xs font-bold ml-1 px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-base-200'}`}>
                            {filter.count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};