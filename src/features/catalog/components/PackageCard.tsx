// src/features/catalog/components/PackageCard.tsx
import { Info, Users, MapPin, Sparkles } from "lucide-react";
import type { PublicPackage } from "../types";

interface Props {
    pkg: PublicPackage;
    onViewDetails: (pkg: PublicPackage) => void;
}

export const PackageCard = ({ pkg, onViewDetails }: Props) => {
    // Extraemos las categorías únicas para el "Vistazo previo"
    const includedCategories = Array.from(new Set(pkg.details.map(d => d.categoryTypeName)));

    return (
        <div className="bg-base-100 rounded-3xl shadow-sm hover:shadow-xl transition-shadow border border-base-200 overflow-hidden flex flex-col h-full relative group">
            
            {/* Badge de Escasez */}
            {pkg.isLowStock && (
                <div className="absolute top-4 right-0 bg-warning text-warning-content text-xs font-bold px-3 py-1 rounded-l-full shadow-md z-10 flex items-center gap-1">
                    <Sparkles size={12} /> ¡Últimos cupos!
                </div>
            )}

            {/* Imagen del paquete (si existe) o un gradiente bonito de fallback */}
            <div className="h-48 w-full bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
                {pkg.imageUrl ? (
                    <img src={pkg.imageUrl} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-30">
                        <MapPin size={64} className="text-primary" />
                    </div>
                )}
            </div>

            <div className="p-5 flex flex-col flex-grow">
                {/* Cabecera */}
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-black text-base-content leading-tight">{pkg.name}</h3>
                </div>
                
                {/* Vistazo de qué incluye (Tags) */}
                <div className="flex flex-wrap gap-1.5 mb-4 mt-2">
                    {includedCategories.map((cat, idx) => (
                        <span key={idx} className="bg-base-200 text-base-content/70 text-[10px] uppercase font-bold px-2 py-1 rounded-md">
                            + {cat}
                        </span>
                    ))}
                </div>

                <p className="text-sm text-base-content/70 line-clamp-2 mb-4">
                    {pkg.description || "Un paquete increíble pensado para ti. Haz clic en detalles para ver más."}
                </p>

                {/* Zona de Precios (El CTA visual) */}
                <div className="mt-auto bg-primary/5 rounded-2xl p-4 border border-primary/10">
                    <div className="flex justify-between items-end">
                        <div>
                            <span className="text-xs uppercase font-bold text-base-content/50 block mb-1">Precio por persona</span>
                            <div className="flex items-end gap-1">
                                <span className="text-sm font-bold text-primary mb-1">Bs.</span>
                                <span className="text-4xl font-black text-primary leading-none">{pkg.pricePerPerson}</span>
                            </div>
                        </div>
                        
                        <div className="text-right">
                            <div className="flex items-center justify-end gap-1 text-xs text-base-content/60 font-medium bg-base-100 px-2 py-1 rounded-lg">
                                <Users size={12} /> {pkg.peopleCount} personas
                            </div>
                            {pkg.peopleCount > 1 && (
                                <div className="text-[11px] font-bold opacity-50 mt-1 line-through decoration-primary">
                                    Total: Bs. {pkg.totalPrice}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Botón de Acción */}
                <button 
                    onClick={() => onViewDetails(pkg)}
                    className="mt-4 w-full btn btn-primary rounded-xl font-bold shadow-md shadow-primary/30"
                >
                    <Info size={18} /> Ver detalles del paquete
                </button>
            </div>
        </div>
    );
};