import { X, MapPin, Map as MapIcon, Users, CheckCircle2, MessageCircle } from "lucide-react";
import type { PublicPackage } from "../types";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    pkg: PublicPackage | null;
}

export const PublicPackageDetailsModal = ({ isOpen, onClose, pkg }: Props) => {
    if (!isOpen || !pkg) return null;

    const whatsappMessage = encodeURIComponent(`¡Hola! Estoy interesado en el paquete "${pkg.name}". ¿Me podrían dar más información?`);
    const whatsappLink = `https://wa.me/591XXXXXXXX?text=${whatsappMessage}`;

    return (
        <div className={`modal modal-bottom sm:modal-middle ${isOpen ? "modal-open" : ""}`}>
            {/* MODAL BOX: Aquí aplicamos tu imagen de fondo */}
            <div 
                className="modal-box p-0 sm:max-w-2xl overflow-hidden rounded-t-3xl sm:rounded-3xl relative"
                style={{
                    backgroundImage: "url('/card-background.png')", 
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                {/* VELO OSCURO Y DESENFOQUE: Oscurece la imagen de fondo para que no compita con el texto */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-md pointer-events-none z-0"></div>
                
                {/* Botón flotante para cerrar */}
                <button 
                    onClick={onClose}
                    className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-20 bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm border-none"
                >
                    <X size={18} />
                </button>

                {/* Cabecera con Imagen Principal */}
                <div className="h-56 w-full bg-base-200 relative z-10">
                    {pkg.imageUrl && (
                        <img 
                            src={pkg.imageUrl} 
                            alt={pkg.name} 
                            className="w-full h-full object-cover"
                        />
                    )}
                    {/* Gradiente que se funde con el velo oscuro del modal */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    
                    <div className="absolute bottom-4 left-6 right-6">
                        <div className="flex gap-2 mb-2">
                            {pkg.isLowStock && (
                                <span className="badge bg-warning text-warning-content font-bold text-xs border-none shadow-sm">¡Últimos cupos!</span>
                            )}
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight drop-shadow-md">
                            {pkg.name}
                        </h2>
                    </div>
                </div>

                {/* Cuerpo del Modal: Transparente para dejar ver el fondo */}
                <div className="p-4 sm:p-6 overflow-y-auto max-h-[50vh] sm:max-h-[60vh] space-y-8 relative z-10">
                    
                    {/* Descripción General */}
                    <section>
                        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2 drop-shadow-sm">
                            <CheckCircle2 className="text-primary" size={20} />
                            Acerca de este paquete
                        </h3>
                        {/* Texto en blanco opaco para que se lea sobre el fondo oscuro */}
                        <p className="text-gray-200 text-sm leading-relaxed drop-shadow-sm">
                            {pkg.description || "Un paquete diseñado para brindarte la mejor experiencia."}
                        </p>
                    </section>

                    {/* Qué incluye (Los detalles) */}
                    <section>
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 drop-shadow-sm">
                            <MapIcon className="text-primary" size={20} />
                            ¿Qué incluye?
                        </h3>
                        <div className="space-y-4 sm:space-y-5">
                            {pkg.details.map((detail, idx) => (
                                /* MINI CARDS GLASSMORPHISM: Blanco translúcido que se mezcla con el fondo oscuro */
                                <div key={idx} className="bg-white/70 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-5 border border-white/40">
                                    
                                    {/* IMAGEN DEL DETALLE: Proporción 4:5 */}
                                    {detail.imageUrl ? (
                                        <div className="w-28 sm:w-32 aspect-[4/5] rounded-xl overflow-hidden shrink-0 shadow-sm bg-white/50">
                                            <img src={detail.imageUrl} alt={detail.productName} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                        </div>
                                    ) : (
                                        <div className="w-28 sm:w-32 aspect-[4/5] rounded-xl bg-white/40 flex items-center justify-center shrink-0 border border-white/30">
                                            <CheckCircle2 size={32} className="text-slate-500" />
                                        </div>
                                    )}
                                    
                                    <div className="flex-grow py-1">
                                        <div className="flex justify-between items-start gap-2">
                                            <div>
                                                <span className="text-[10px] uppercase font-bold text-primary tracking-wider drop-shadow-sm">
                                                    {detail.categoryTypeName}
                                                </span>
                                                <h4 className="font-bold text-lg text-slate-900 leading-tight mt-0.5">
                                                    {detail.productName}
                                                </h4>
                                            </div>
                                            
                                            {/* BADGE DE CANTIDAD: Sigue en amarillo para no perder el CTA */}
                                            {detail.quantity > 1 && (
                                                <span className="bg-[#ffc604] text-black font-black text-xs px-2.5 py-1 rounded-lg shadow-sm whitespace-nowrap shrink-0">
                                                    x{detail.quantity}
                                                </span>
                                            )}
                                        </div>
                                        
                                        {/* Texto en un gris oscuro para contrastar con el blanco translúcido */}
                                        <p className="text-sm text-slate-700 mt-2 line-clamp-3">
                                            {detail.productDescription}
                                        </p>

                                        {/* Ubicación: Un poco más transparente para crear jerarquía */}
                                        {detail.nameLocation && (
                                            <div className="mt-4 flex items-start gap-2 text-xs text-slate-700 bg-white/40 border border-white/50 p-3 rounded-xl">
                                                <MapPin size={16} className="text-error shrink-0 mt-0.5 drop-shadow-sm" />
                                                <div>
                                                    <span className="font-bold block text-slate-900 text-[13px]">{detail.nameLocation}</span>
                                                    <span className="opacity-90 block mt-0.5">{detail.addressLocation}</span>
                                                    {detail.mapUrlLocation && (
                                                        <a 
                                                            href={detail.mapUrlLocation} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="text-info hover:text-info/80 block mt-1.5 font-bold transition-colors inline-flex items-center gap-1 drop-shadow-sm"
                                                        >
                                                            Ver en mapa &rarr;
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Footer Sticky: Fondo blanco semi-transparente para cerrar el diseño con luz */}
                <div className="bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10 rounded-b-3xl">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="bg-primary/10 p-2 rounded-xl text-primary">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase">Precio por persona</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-sm font-bold text-primary">Bs.</span>
                                <span className="text-3xl font-black text-primary leading-none">{pkg.pricePerPerson}</span>
                            </div>
                            {pkg.peopleCount > 1 && (
                                <p className="text-[10px] text-slate-500 font-bold mt-0.5">
                                    Total grupal ({pkg.peopleCount} pax): Bs. {pkg.totalPrice}
                                </p>
                            )}
                        </div>
                    </div>

                    <a 
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn bg-[#ffc604] hover:bg-[#eab003] text-black border-none w-full sm:w-auto rounded-xl shadow-md shadow-[#ffc604]/30 font-black"
                    >
                        <MessageCircle size={18} />
                        Me Interesa
                    </a>
                </div>
            </div>
            
            <form method="dialog" className="modal-backdrop bg-black/60 backdrop-blur-sm" onClick={onClose}>
                <button>close</button>
            </form>
        </div>
    );
};