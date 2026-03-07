// src/features/catalog/components/PublicPackageDetailsModal.tsx
import { X, MapPin, Map as MapIcon, Users, CheckCircle2, MessageCircle } from "lucide-react";
import type { PublicPackage } from "../types";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    pkg: PublicPackage | null;
}

export const PublicPackageDetailsModal = ({ isOpen, onClose, pkg }: Props) => {
    if (!isOpen || !pkg) return null;

    // Generar un enlace de WhatsApp pre-armado (Opcional, pero muy útil para ventas)
    const whatsappMessage = encodeURIComponent(`¡Hola! Estoy interesado en el paquete "${pkg.name}". ¿Me podrían dar más información?`);
    const whatsappLink = `https://wa.me/591XXXXXXXX?text=${whatsappMessage}`; // Cambia las X por el número de la empresa

    return (
        <div className={`modal modal-bottom sm:modal-middle ${isOpen ? "modal-open" : ""}`}>
            <div className="modal-box p-0 sm:max-w-2xl overflow-hidden bg-base-100 rounded-t-3xl sm:rounded-3xl relative">
                
                {/* Botón flotante para cerrar */}
                <button 
                    onClick={onClose}
                    className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-20 bg-black/20 text-white hover:bg-black/40"
                >
                    <X size={18} />
                </button>

                {/* Cabecera con Imagen */}
                <div className="h-56 w-full bg-gradient-to-r from-primary to-secondary relative">
                    {pkg.imageUrl && (
                        <img 
                            src={pkg.imageUrl} 
                            alt={pkg.name} 
                            className="w-full h-full object-cover opacity-90"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-6 right-6 text-base-content">
                        <div className="flex gap-2 mb-2">
                            {pkg.isLowStock && (
                                <span className="badge badge-warning font-bold text-xs border-none">¡Últimos cupos!</span>
                            )}
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md leading-tight">
                            {pkg.name}
                        </h2>
                    </div>
                </div>

                {/* Cuerpo del Modal */}
                <div className="p-6 overflow-y-auto max-h-[50vh] sm:max-h-[60vh] space-y-8">
                    
                    {/* Descripción General */}
                    <section>
                        <h3 className="text-lg font-bold text-base-content mb-2 flex items-center gap-2">
                            <CheckCircle2 className="text-primary" size={20} />
                            Acerca de este paquete
                        </h3>
                        <p className="text-base-content/70 text-sm leading-relaxed">
                            {pkg.description || "Un paquete diseñado para brindarte la mejor experiencia."}
                        </p>
                    </section>

                    {/* Qué incluye (Los detalles) */}
                    <section>
                        <h3 className="text-lg font-bold text-base-content mb-4 flex items-center gap-2">
                            <MapIcon className="text-primary" size={20} />
                            ¿Qué incluye?
                        </h3>
                        <div className="space-y-4">
                            {pkg.details.map((detail, idx) => (
                                <div key={idx} className="bg-base-200/50 rounded-2xl p-4 border border-base-200 flex flex-col sm:flex-row gap-4">
                                    {/* Imagen del detalle (Ej: Foto del hotel) */}
                                    {detail.imageUrl ? (
                                        <div className="w-full sm:w-24 h-24 rounded-xl overflow-hidden shrink-0">
                                            <img src={detail.imageUrl} alt={detail.productName} className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                            <CheckCircle2 size={24} className="text-primary/50" />
                                        </div>
                                    )}
                                    
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="text-[10px] uppercase font-bold text-primary tracking-wider">
                                                    {detail.categoryTypeName}
                                                </span>
                                                <h4 className="font-bold text-base text-base-content leading-tight mt-0.5">
                                                    {detail.productName}
                                                </h4>
                                            </div>
                                            {detail.quantity > 1 && (
                                                <span className="badge badge-ghost badge-sm font-bold">
                                                    x{detail.quantity}
                                                </span>
                                            )}
                                        </div>
                                        
                                        <p className="text-xs text-base-content/60 mt-2 line-clamp-2">
                                            {detail.productDescription}
                                        </p>

                                        {/* Ubicación del servicio si existe */}
                                        {detail.nameLocation && (
                                            <div className="mt-3 flex items-start gap-1 text-xs text-base-content/70 bg-base-100 p-2 rounded-lg">
                                                <MapPin size={14} className="text-error shrink-0 mt-0.5" />
                                                <div>
                                                    <span className="font-bold block">{detail.nameLocation}</span>
                                                    <span className="opacity-70">{detail.addressLocation}</span>
                                                    {detail.mapUrlLocation && (
                                                        <a 
                                                            href={detail.mapUrlLocation} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="text-info hover:underline block mt-1 font-medium"
                                                        >
                                                            Ver en Google Maps &rarr;
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

                {/* Footer Sticky (Llamado a la acción) */}
                <div className="bg-base-100 border-t border-base-200 p-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="bg-primary/10 p-2 rounded-xl text-primary">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-base-content/50 uppercase">Precio por persona</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-sm font-bold text-primary">Bs.</span>
                                <span className="text-3xl font-black text-primary leading-none">{pkg.pricePerPerson}</span>
                            </div>
                            {pkg.peopleCount > 1 && (
                                <p className="text-[10px] text-base-content/50 font-bold">
                                    Total grupal ({pkg.peopleCount} pax): Bs. {pkg.totalPrice}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Botón de Acción (WhatsApp por ahora) */}
                    <a 
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary w-full sm:w-auto rounded-xl shadow-lg shadow-primary/30"
                    >
                        <MessageCircle size={18} />
                        Me Interesa
                    </a>
                </div>
            </div>
            
            {/* Backdrop para cerrar al hacer clic afuera */}
            <form method="dialog" className="modal-backdrop" onClick={onClose}>
                <button>close</button>
            </form>
        </div>
    );
};