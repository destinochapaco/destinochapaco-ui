import { X, MapPin, Map as MapIcon, CheckCircle2, MessageCircle, ArrowRight, ChevronLeft, QrCode } from "lucide-react";
import { useState, useEffect } from "react";
import type { PublicPackage } from "../types";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    pkg: PublicPackage | null;
}

export const PublicPackageDetailsModal = ({ isOpen, onClose, pkg }: Props) => {
    // Estado para alternar entre "Detalles" y "Reserva (QR)"
    const [showReservation, setShowReservation] = useState(false);

    // Reiniciar la vista al cerrar o abrir el modal para que siempre empiece en Detalles
    useEffect(() => {
        if (isOpen) {
            setShowReservation(false);
        }
    }, [isOpen]);

    if (!isOpen || !pkg) return null;

    // Mensaje dinámico para WhatsApp según la vista
    const whatsappMessage = encodeURIComponent(
        `¡Hola! Estoy viendo el paquete "${pkg.name}". Aquí está mi comprobante de pago / tengo unas dudas para finalizar mi reserva.`
    );
    
    const whatsappLink = `https://wa.me/59162820177?text=${whatsappMessage}`; // ¡Recuerda poner tu número aquí!

    const getCategoryStyle = (code: string | number) => {
        const strCode = String(code);
        switch (strCode) {
            case '601': return 'bg-blue-500 text-white';
            case '602': return 'bg-rose-500 text-white';
            case '603': return 'bg-emerald-500 text-white';
            default: return 'bg-slate-500 text-white';
        }
    };

    // Función para limpiar el título eliminando lo que está antes del "|"
    const formatTitle = (title: string) => {
        if (!title) return "";
        if (title.includes("|")) return title.split("|")[1].trim(); 
        return title.trim();
    };

    return (
        <div className={`modal modal-bottom sm:modal-middle ${isOpen ? "modal-open" : ""}`}>
            <div 
                className="modal-box p-0 sm:max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden rounded-t-3xl sm:rounded-3xl relative flex flex-col transition-all duration-300"
                style={{
                    backgroundImage: "url('/card-background.png')", 
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="absolute inset-0 bg-black/60 backdrop-blur-md pointer-events-none z-0"></div>
                
                <button 
                    onClick={onClose}
                    className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-20 bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm border-none"
                >
                    <X size={18} />
                </button>

                {/* CABECERA */}
                <div className="h-40 sm:h-56 w-full bg-base-200 relative z-10 shrink-0 transition-all duration-300">
                    {pkg.imageUrl && (
                        <img src={pkg.imageUrl} alt={pkg.name} className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                    
                    <div className="absolute bottom-4 left-4 sm:left-6 right-6">
                        <div className="flex gap-2 mb-1 sm:mb-2">
                            {pkg.isLowStock && (
                                <span className="badge bg-red-600 text-white font-black text-[10px] uppercase tracking-wider border-none shadow-sm">
                                    ¡Últimos cupos!
                                </span>
                            )}
                        </div>
                        <h2 className="text-xl sm:text-3xl font-black text-white leading-tight drop-shadow-md">
                            {formatTitle(pkg.name)}
                        </h2>
                    </div>
                </div>

                {/* --- RENDER CONDICIONAL DEL CUERPO --- */}
                {!showReservation ? (
                    
                    /* VISTA 1: DETALLES DEL PAQUETE */
                    <div className="p-4 sm:p-6 flex-1 min-h-0 overflow-y-auto space-y-6 sm:space-y-8 relative z-10">
                        <section>
                            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2 drop-shadow-sm">
                                <CheckCircle2 className="text-primary" size={20} /> Acerca de este paquete
                            </h3>
                            <p className="text-gray-200 text-sm leading-relaxed drop-shadow-sm">
                                {pkg.description || "Un paquete diseñado para brindarte la mejor experiencia."}
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 drop-shadow-sm">
                                <MapIcon className="text-primary" size={20} /> ¿Qué incluye?
                            </h3>
                            <div className="space-y-4 sm:space-y-5">
                                {pkg.details.map((detail, idx) => (
                                    <div key={idx} className="bg-transparent backdrop-blur-sm hover:bg-white/5 transition-all duration-300 rounded-2xl p-3 sm:p-5 flex flex-row items-start gap-3 sm:gap-5 border border-white/30">
                                        {detail.imageUrl ? (
                                            <div className="w-20 sm:w-28 aspect-[4/5] rounded-xl overflow-hidden shrink-0 border border-white/20">
                                                <img src={detail.imageUrl} alt={detail.productName} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                            </div>
                                        ) : (
                                            <div className="w-20 sm:w-28 aspect-[4/5] rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                                                <CheckCircle2 size={24} className="text-white/50" />
                                            </div>
                                        )}
                                        
                                        <div className="flex-grow py-0.5 text-left flex flex-col min-w-0">
                                            <div className="flex justify-between items-start gap-2">
                                                <div className="flex flex-col items-start gap-1 min-w-0">
                                                    <span className={`text-[9px] sm:text-[10px] uppercase font-bold px-2 py-1 rounded-md shadow-sm border-none ${getCategoryStyle(detail.categoryTypeCode)}`}>
                                                        {detail.categoryTypeName}
                                                    </span>
                                                    <h4 className="font-bold text-sm sm:text-lg text-white leading-tight mt-0.5 drop-shadow-md line-clamp-2">
                                                        {formatTitle(detail.productName)}
                                                    </h4>
                                                </div>
                                                {detail.quantity > 1 && (
                                                    <span className="bg-[#ffc604] text-black font-black text-[10px] sm:text-xs px-2 py-1 rounded-lg shadow-sm whitespace-nowrap shrink-0">
                                                        x{detail.quantity}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs sm:text-sm text-gray-300 mt-1.5 line-clamp-2 sm:line-clamp-3 drop-shadow-sm">
                                                {detail.productDescription}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                ) : (
                    
                    /* VISTA 2: RESERVA Y QR */
                    <div className="p-4 sm:p-8 flex-1 min-h-0 overflow-y-auto relative z-10 flex flex-col items-center justify-center animate-fade-in">
                        
                        <div className="w-full max-w-sm mx-auto flex flex-col items-center text-center bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-2xl">
                            
                            <button 
                                onClick={() => setShowReservation(false)}
                                className="self-start flex items-center gap-1 text-sm font-bold text-gray-300 hover:text-white transition-colors mb-4"
                            >
                                <ChevronLeft size={16} /> Volver a detalles
                            </button>

                            <div className="bg-[#ffc604] text-black p-3 rounded-full mb-3 shadow-lg shadow-[#ffc604]/20">
                                <QrCode size={32} />
                            </div>
                            
                            <h3 className="text-xl sm:text-2xl font-black text-white mb-2 drop-shadow-md">
                                Escanea y Reserva
                            </h3>
                            <p className="text-sm text-gray-300 mb-6 px-4">
                                Utiliza el código QR para realizar el pago de tu paquete. Asegúrate de guardar el comprobante.
                            </p>

                            <div className="bg-white p-3 rounded-2xl shadow-inner w-48 h-48 sm:w-56 sm:h-56">
                                {pkg.imageQrUrl ? (
                                    <img src={pkg.imageQrUrl} alt="QR de Reserva" className="w-full h-full object-contain" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-bold text-center p-4">
                                        QR no disponible
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- RENDER CONDICIONAL DEL FOOTER --- */}
                <div className="bg-[#170822] border-t border-purple-900/50 p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center relative z-10 shrink-0 rounded-b-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
                    
                    {!showReservation ? (
                        
                        /* FOOTER 1: PRECIOS + BOTÓN RESERVAR (Vista Detalles) */
                        <div className="flex items-center justify-between w-full gap-2 sm:gap-6">
                            
                            {/* Bloque Izquierdo: Precios reducidos en móvil para dejar espacio al botón */}
                            <div className="flex items-center gap-3 sm:gap-6 shrink-0">
                                <div className="flex flex-col text-left">
                                    <p className="text-[9px] sm:text-xs font-bold text-purple-200/60 uppercase tracking-wider mb-0.5">
                                        <span className="sm:hidden">Individual</span>
                                        <span className="hidden sm:inline">Por persona</span>
                                    </p>
                                    <div className="flex items-baseline gap-1 text-[#ffc604]">
                                        <span className="text-[10px] sm:text-sm font-bold">Bs.</span>
                                        <span className="text-xl sm:text-4xl font-black leading-none drop-shadow-sm">{pkg.pricePerPerson}</span>
                                    </div>
                                </div>
                                
                                {pkg.peopleCount > 1 && (
                                    <>
                                        <div className="w-px h-6 sm:h-10 bg-purple-800/60"></div>
                                        <div className="flex flex-col text-left">
                                            <p className="text-[9px] sm:text-xs font-bold text-purple-200/60 uppercase tracking-wider mb-0.5">
                                                <span className="sm:hidden">Total ({pkg.peopleCount} pax)</span>
                                                <span className="hidden sm:inline">Total ({pkg.peopleCount} personas)</span>
                                            </p>
                                            <div className="flex items-baseline gap-1 text-[#ffc604]">
                                                <span className="text-[10px] sm:text-sm font-bold">Bs.</span>
                                                <span className="text-xl sm:text-4xl font-black leading-none drop-shadow-sm">{pkg.totalPrice}</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Bloque Derecho: Botón CTA que dispara el cambio de vista */}
                            <button 
                                onClick={() => setShowReservation(true)}
                                className="btn bg-[#ffc604] hover:bg-[#eab003] text-black border-none rounded-xl font-black shadow-lg shadow-[#ffc604]/20 shrink-0 h-10 sm:h-12 px-4 sm:px-6 ml-auto"
                            >
                                <span className="sm:hidden">Reservar</span>
                                <span className="hidden sm:inline">Reservar Ahora</span>
                                <ArrowRight size={18} className="ml-1 -mr-1" />
                            </button>
                        </div>

                    ) : (

                        /* FOOTER 2: TEXTO WHATSAPP + BOTÓN ENVIAR COMPROBANTE (Vista Reserva) */
                        <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
                            <div className="text-center sm:text-left text-sm text-purple-200/80 leading-tight">
                                <span className="block font-bold text-white mb-0.5">¿Ya hiciste tu pago?</span>
                                Envía tu comprobante o contáctanos para resolver tus dudas.
                            </div>
                            
                            <a 
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn bg-green-500 hover:bg-green-600 text-white border-none w-full sm:w-auto rounded-xl shadow-lg shadow-green-500/20 font-black shrink-0 h-12 px-6"
                            >
                                <MessageCircle size={20} />
                                Enviar a WhatsApp
                            </a>
                        </div>
                    )}

                </div>
            </div>
            
            <form method="dialog" className="modal-backdrop bg-black/60 backdrop-blur-sm" onClick={onClose}>
                <button>close</button>
            </form>
        </div>
    );
};