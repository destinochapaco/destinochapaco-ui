import { X, MapPin, Map as MapIcon, CheckCircle2 } from "lucide-react";
import type { PublicPackage } from "../types";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    pkg: PublicPackage | null;
}

export const PublicPackageDetailsModal = ({ isOpen, onClose, pkg }: Props) => {
    if (!isOpen || !pkg) return null;

    const whatsappMessage = encodeURIComponent(`¡Hola! Estoy interesado en el paquete "${pkg.name}". ¿Me podrían dar más información?`);
    // const whatsappLink = `https://wa.me/591XXXXXXXX?text=${whatsappMessage}`;

    // Función para obtener el color del badge según el código de la categoría
    const getCategoryStyle = (code: string | number) => {
        const strCode = String(code);
        switch (strCode) {
            case '601': return 'bg-blue-500 text-white'; // Inscripción
            case '602': return 'bg-rose-500 text-white'; // Hospedaje
            case '603': return 'bg-emerald-500 text-white'; // Transporte
            default: return 'bg-slate-500 text-white'; // Extra
        }
    };

    return (
        <div className={`modal modal-bottom sm:modal-middle ${isOpen ? "modal-open" : ""}`}>
            {/* MODAL BOX: Ahora es flex-col y tiene un alto máximo estricto para que nunca se desborde */}
            <div 
                className="modal-box p-0 sm:max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden rounded-t-3xl sm:rounded-3xl relative flex flex-col"
                style={{
                    backgroundImage: "url('/card-background.png')", 
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                {/* VELO OSCURO Y DESENFOQUE */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-md pointer-events-none z-0"></div>
                
                {/* Botón flotante para cerrar */}
                <button 
                    onClick={onClose}
                    className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-20 bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm border-none"
                >
                    <X size={18} />
                </button>

                {/* CABECERA (Fija, no se encoge: shrink-0) */}
                <div className="h-48 sm:h-56 w-full bg-base-200 relative z-10 shrink-0">
                    {pkg.imageUrl && (
                        <img 
                            src={pkg.imageUrl} 
                            alt={pkg.name} 
                            className="w-full h-full object-cover"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    
                    <div className="absolute bottom-4 left-6 right-6">
                        <div className="flex gap-2 mb-2">
                            {pkg.isLowStock && (
                                <span className="badge bg-warning text-warning-content font-bold text-xs border-none shadow-sm">¡Últimos cupos!</span>
                            )}
                        </div>
                        <h2 className="text-xl sm:text-3xl font-black text-white leading-tight drop-shadow-md">
                            {pkg.name}
                        </h2>
                    </div>
                </div>

                {/* CUERPO DEL MODAL (flex-1 para rellenar espacio, min-h-0 y overflow-y-auto para scrollear) */}
                <div className="p-4 sm:p-6 flex-1 min-h-0 overflow-y-auto space-y-6 sm:space-y-8 relative z-10">
                    
                    {/* Descripción General */}
                    <section>
                        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2 drop-shadow-sm">
                            <CheckCircle2 className="text-primary" size={20} />
                            Acerca de este paquete
                        </h3>
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
                                <div key={idx} className="bg-transparent backdrop-blur-sm hover:bg-white/5 transition-all duration-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-5 border border-white/30">
                                    
                                    {/* IMAGEN DEL DETALLE */}
                                    {detail.imageUrl ? (
                                        <div className="w-24 sm:w-32 aspect-[4/5] rounded-xl overflow-hidden shrink-0 border border-white/20 mx-auto sm:mx-0">
                                            <img src={detail.imageUrl} alt={detail.productName} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                        </div>
                                    ) : (
                                        <div className="w-24 sm:w-32 aspect-[4/5] rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20 mx-auto sm:mx-0">
                                            <CheckCircle2 size={32} className="text-white/50" />
                                        </div>
                                    )}
                                    
                                    <div className="flex-grow py-1 text-center sm:text-left">
                                        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-2">
                                            <div className="flex flex-col items-center sm:items-start gap-1">
                                                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md shadow-sm border-none ${getCategoryStyle(detail.categoryTypeCode)}`}>
                                                    {detail.categoryTypeName}
                                                </span>
                                                <h4 className="font-bold text-base sm:text-lg text-white leading-tight mt-0.5 drop-shadow-md">
                                                    {detail.productName}
                                                </h4>
                                            </div>
                                            
                                            {detail.quantity > 1 && (
                                                <span className="bg-[#ffc604] text-black font-black text-xs px-2.5 py-1 rounded-lg shadow-sm whitespace-nowrap shrink-0">
                                                    x{detail.quantity}
                                                </span>
                                            )}
                                        </div>
                                        
                                        <p className="text-xs sm:text-sm text-gray-300 mt-2 line-clamp-3 drop-shadow-sm">
                                            {detail.productDescription}
                                        </p>

                                        {detail.nameLocation && (
                                            <div className="mt-4 flex flex-col sm:flex-row items-center sm:items-start gap-2 text-xs text-gray-300 bg-white/5 border border-white/20 p-3 rounded-xl text-left">
                                                <MapPin size={16} className="text-error shrink-0 mt-0.5 drop-shadow-sm hidden sm:block" />
                                                <div className="w-full text-center sm:text-left">
                                                    <span className="font-bold text-white text-[13px] drop-shadow-sm flex justify-center sm:justify-start items-center gap-1">
                                                        <MapPin size={14} className="text-error sm:hidden" /> {detail.nameLocation}
                                                    </span>
                                                    <span className="opacity-90 block mt-0.5 drop-shadow-sm">{detail.addressLocation}</span>
                                                    {detail.mapUrlLocation && (
                                                        <a 
                                                            href={detail.mapUrlLocation} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="text-info hover:text-info/80 mt-1.5 font-bold transition-colors inline-flex items-center gap-1 drop-shadow-sm justify-center sm:justify-start w-full sm:w-auto"
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

                {/* FOOTER STICKY (Fijo, no se encoge: shrink-0) */}
                {/* FOOTER STICKY (Fijo, sin botón, precios centrados) */}
                <div className="bg-[#170822] border-t border-purple-900/50 p-4 sm:p-6 flex justify-center items-center relative z-10 shrink-0 rounded-b-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
                    
                    {/* Zona de Precios Centrada */}
                    <div className="flex items-center justify-center w-full max-w-lg gap-4 sm:gap-12">
                        
                        {/* PRECIO POR PERSONA */}
                        <div className="flex-1 flex flex-col items-center text-center">
                            <p className="text-[10px] sm:text-xs font-bold text-purple-200/60 uppercase tracking-wider mb-0.5 sm:mb-1">
                                Por persona
                            </p>
                            <div className="flex items-baseline justify-center gap-1 text-[#ffc604]">
                                <span className="text-xs sm:text-sm font-bold">Bs.</span>
                                {/* En móvil es text-3xl, en escritorio text-4xl */}
                                <span className="text-3xl sm:text-4xl font-black leading-none drop-shadow-sm">{pkg.pricePerPerson}</span>
                            </div>
                        </div>

                        {/* SEPARADOR */}
                        <div className="w-px h-10 sm:h-12 bg-purple-800/60 shrink-0"></div>

                        {/* PRECIO TOTAL */}
                        <div className="flex-1 flex flex-col items-center text-center">
                            <p className="text-[10px] sm:text-xs font-bold text-purple-200/60 uppercase tracking-wider mb-0.5 sm:mb-1">
                                Total ({pkg.peopleCount} persona{pkg.peopleCount > 1 ? 's' : ''})
                            </p>
                            <div className="flex items-baseline justify-center gap-1 text-[#ffc604]">
                                <span className="text-xs sm:text-sm font-bold">Bs.</span>
                                {/* En móvil es text-3xl, en escritorio text-4xl */}
                                <span className="text-3xl sm:text-4xl font-black leading-none drop-shadow-sm">{pkg.totalPrice}</span>
                            </div>
                        </div>
                    </div>
                    {/* Botón de Acción */}
                    {/* <a 
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn bg-[#ffc604] hover:bg-[#eab003] text-black border-none w-full sm:w-auto rounded-xl shadow-lg shadow-[#ffc604]/20 font-black shrink-0 h-12 px-6 mt-2 sm:mt-0"
                    >
                        <MessageCircle size={20} />
                        Me Interesa
                    </a> */}
                </div>
            </div>
            
            <form method="dialog" className="modal-backdrop bg-black/60 backdrop-blur-sm" onClick={onClose}>
                <button>close</button>
            </form>
        </div>
    );
};