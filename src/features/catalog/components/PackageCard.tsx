import { Users, MapPin, Sparkles, ArrowBigRightDash } from "lucide-react";
import type { PublicPackage } from "../types";

interface Props {
    pkg: PublicPackage;
    onViewDetails: (pkg: PublicPackage) => void;
}

export const PackageCard = ({ pkg, onViewDetails }: Props) => {
    const includedCategories = Array.from(
        new Map(pkg.details.map(d => [d.categoryTypeCode, d.categoryTypeName])).entries()
    ).map(([code, name]) => ({ code, name }));

    // Mapa de estilos para los badges según el código de la categoría
    const getCategoryStyle = (code: string | number) => {
        const strCode = String(code);
        switch (strCode) {
            case '601': return 'bg-blue-500 text-white'; // Inscripción
            case '602': return 'bg-rose-500 text-white'; // Hospedaje
            case '603': return 'bg-emerald-500 text-white'; // Transporte
            default: return 'bg-slate-500 text-white'; // Cualquier otra categoría extra
        }
    };

    // Función para limpiar el título eliminando lo que está antes del "|"
    const formatTitle = (title: string) => {
        if (!title) return "";
        // Si el título contiene el símbolo "|", lo partimos en dos y nos quedamos con la segunda parte [1]
        if (title.includes("|")) {
            return title.split("|")[1].trim(); 
        }
        // Si no tiene el símbolo, devolvemos el título original tal cual
        return title.trim();
    };

    return (
        <div 
            // Quitamos flex-grow y h-full, y forzamos shrink-0 para que no se aplaste
            className="relative overflow-hidden flex flex-col rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group shrink-0 border border-base-200"
            style={{
                width: '340px',
                height: '520px',
                // Aquí llamamos a tu imagen. Debe estar en la carpeta /public de tu proyecto.
                backgroundImage: "url('/card-background.png')", 
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {/* Contenedor principal con z-index para estar por encima del fondo */}
            <div className="relative z-10 flex flex-col h-full">
                
                {/* Badge de Escasez */}
                {pkg.isLowStock && (
                    <div className="absolute top-0 right-0 bg-red-600 text-white text-[11px] font-black px-4 py-2 rounded-tr-3xl rounded-bl-2xl shadow-xl z-10 flex items-center gap-1.5 uppercase tracking-wider animate-pulse-slow">
                        {/* Icono un poco más grande y blanco */}
                        <Sparkles size={14} className="shrink-0 text-white/90" /> 
                        ¡Últimos cupos!
                    </div>
                )}

                {/* Imagen de cabecera del paquete (Mantenemos altura fija) */}
                <div className="h-48 w-full bg-base-200/40 relative overflow-hidden shrink-0">
                    {pkg.imageUrl ? (
                        <img src={pkg.imageUrl} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center opacity-30">
                            <MapPin size={64} className="text-primary" />
                        </div>
                    )}
                </div>

                {/* Cuerpo de la tarjeta. 
                    NOTA: Le añadimos bg-base-100/90 (semi-transparente) y backdrop-blur 
                    para asegurar que el texto se lea perfectamente sin importar tu imagen de fondo */}
                {/* <div className="p-5 flex flex-col flex-grow bg-black/60 backdrop-blur-sm"> */}
                <div className="p-5 flex flex-col flex-grow bg-base-100/90 backdrop-blur-sm">
                    
                    {/* Título también truncado a 1 línea por si es inmenso */}
                    <div className="mb-2">
                        <h3 className="text-xl font-black text-white truncate">{formatTitle(pkg.name)}</h3>
                    </div>
                    
                    {/* Vistazo de qué incluye (Altura fija para que no empuje el contenido) */}
                    <div className="flex flex-wrap gap-1.5 mb-3 mt-1 h-6 overflow-hidden">
                        {includedCategories.map((cat, idx) => (
                            <span 
                                key={idx} 
                                className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md shadow-sm border-none ${getCategoryStyle(cat.code)}`}
                            >
                                {cat.name}
                            </span>
                        ))}
                    </div>

                    {/* ✅ SOLUCIÓN: Descripción estricta de 1 sola línea con "..." */}
                    <p className="text-sm text-gray-200 truncate mb-4">
                        {pkg.description || "Un paquete increíble pensado para ti. Haz clic en detalles para ver más."}
                    </p>

                    {/* Zona de Precios */}
                    <div className="mt-auto bg-primary/5 rounded-2xl p-4 border border-primary/10 backdrop-blur-md">
                        <div className="flex justify-between items-end">
                            <div>
                                <span className="text-xs uppercase font-bold text-gray-300 block mb-1">Precio por persona</span>
                                <div className="flex items-end gap-1">
                                    <span className="text-sm font-bold text-[#eab003] mb-1">Bs.</span>
                                    <span className="text-4xl font-black text-[#eab003] leading-none">{pkg.pricePerPerson}</span>
                                </div>
                            </div>
                            
                            <div className="text-right flex flex-col items-end">
                                {/* BADGE LLAMATIVO */}
                                <div className="flex items-center gap-1 text-[10px] font-bold text-white bg-secondary px-2 py-0.5 rounded-lg shadow-sm border-none">
                                    <Users size={12} strokeWidth={2.5} /> 
                                    {pkg.peopleCount} persona{pkg.peopleCount > 1 ? 's' : ''}   
                                </div>
                                
                                {/* TEXTO DEL TOTAL (pequeño y tachado) */}
                                {pkg.peopleCount > 1 && (
                                    <div className="text-[11px] font-bold text-gray-300 mt-1.5 decoration-primary/50">
                                        Total: Bs. {pkg.totalPrice}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Botón de Acción */}
                    <button 
                        onClick={() => onViewDetails(pkg)}
                        className="mt-4 w-full btn bg-[#ffc604] hover:bg-[#eab003] text-black border-none rounded-xl font-black shadow-md shadow-[#ffc604]/40 transition-colors"
                    >
                        <ArrowBigRightDash size={18} /> VER DETALLES
                    </button>
                </div>
            </div>
        </div>
    );
};