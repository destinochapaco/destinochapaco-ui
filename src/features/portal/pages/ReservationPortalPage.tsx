import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
    Search, User, ChevronDown, CheckCircle2, 
    Calendar, MapPin, Receipt, ArrowLeft, Ticket, AlertCircle 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
// Mova esta importação para o seu portalService quando separar a feature
import { getClientReservation } from "../services/portalService"; 

const EMPRESA_ID = import.meta.env.VITE_EMPRESA_ID;

export const ReservationPortalPage = () => {
    const navigate = useNavigate();
    
    const [ciInput, setCiInput] = useState("");
    const [activeCi, setActiveCi] = useState<string | null>(null);

    const { data: reservationData, isLoading, isError } = useQuery({
        queryKey: ["reservation", EMPRESA_ID, activeCi],
        queryFn: () => getClientReservation(EMPRESA_ID, activeCi!),
        enabled: !!activeCi,
        retry: false, 
    });

    const handleCiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const onlyNumbers = e.target.value.replace(/\D/g, "");
        setCiInput(onlyNumbers);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (ciInput.trim().length > 4) {
            setActiveCi(ciInput);
        }
    };

    const resetSearch = () => {
        setActiveCi(null);
        setCiInput("");
    };

    const formatTitle = (title: string) => {
        if (!title) return "";
        if (title.includes("|")) return title.split("|")[1].trim(); 
        return title.trim();
    };

    // --- VISTA 1: INGRESO DE CI (Login) ---
    if (!activeCi) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col relative">
                <header className="h-[35vh] sm:h-[40vh] bg-[#170822] w-full absolute top-0 left-0 z-0 overflow-hidden rounded-b-[2.5rem] sm:rounded-b-[3rem] shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20 z-10"></div>
                    <img src="/background-header.webp" alt="Background" className="w-full h-full object-cover z-0 opacity-80" />
                </header>

                <div className="flex-1 relative z-20 flex flex-col items-center justify-center px-4 mt-[-5vh]">
                    <button onClick={() => navigate("/")} className="absolute top-6 left-4 sm:left-8 text-white flex items-center gap-2 hover:text-purple-200 transition-colors drop-shadow-md">
                        <ArrowLeft size={20} /> <span className="font-bold text-sm sm:text-base">Volver al catálogo</span>
                    </button>
                    
                    <div className="bg-white p-6 sm:p-12 rounded-[2rem] shadow-2xl shadow-purple-900/10 w-full max-w-md text-center border border-slate-100">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6 shadow-inner border border-purple-100">
                            <Ticket className="text-purple-600 w-8 h-8 sm:w-10 sm:h-10" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2 tracking-tight">Mi Reserva</h1>
                        <p className="text-slate-500 text-xs sm:text-sm mb-6 sm:mb-8 leading-relaxed px-2">
                            Ingresa tu número de Carnet de Identidad para ver los detalles de tu paquete y estado de pagos.
                        </p>

                        <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:gap-4">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="text-slate-400 group-focus-within:text-purple-500 transition-colors" size={20} />
                                </div>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    placeholder="Ej: 12345678"
                                    value={ciInput}
                                    onChange={handleCiChange}
                                    className="w-full pl-11 sm:pl-12 pr-4 py-3.5 sm:py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-base sm:text-lg text-slate-800 placeholder:font-normal focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all"
                                    required
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={ciInput.length < 5}
                                className="w-full bg-[#ffc604] hover:bg-[#eab003] disabled:opacity-50 disabled:hover:bg-[#ffc604] text-black font-black text-base sm:text-lg py-3.5 sm:py-4 rounded-2xl shadow-lg shadow-[#ffc604]/30 flex items-center justify-center gap-2 transition-all"
                            >
                                <Search size={18} className="sm:w-5 sm:h-5" /> Buscar mi reserva
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-14 w-14 sm:h-16 sm:w-16 border-b-4 border-purple-600 mb-4"></div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-800">Buscando tu reserva...</h2>
            </div>
        );
    }

    const currentReservation = Array.isArray(reservationData) ? reservationData[0] : reservationData;

    if (isError || !currentReservation) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6">
                <AlertCircle className="text-red-500 w-16 h-16 sm:w-20 sm:h-20 mb-4" />
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-2 text-center tracking-tight">Reserva no encontrada</h2>
                <p className="text-slate-500 mb-8 text-center max-w-sm text-sm sm:text-base leading-relaxed">
                    No encontramos ninguna reserva asociada al CI <strong className="text-slate-700">{activeCi}</strong>. Verifica que el número sea correcto.
                </p>
                <button onClick={resetSearch} className="bg-[#170822] text-white px-6 sm:px-8 py-3 rounded-xl font-bold hover:bg-purple-900 transition-colors shadow-lg">
                    Intentar con otro CI
                </button>
            </div>
        );
    }

    const pkgInfo = currentReservation?.packageInfo || {};
    const clients = currentReservation?.clients || [];
    const products = currentReservation?.products || [];

    const getValidImage = (url: string | null | undefined, fallback: string) => {
        if (!url || typeof url !== 'string' || url.trim() === "" || url === "null" || url === "undefined") {
            return fallback;
        }
        return url;
    };

    const headerImage = getValidImage(pkgInfo?.imageUrl, "/background-header.webp");

    // --- VISTA 2: DASHBOARD DE RESERVA ---
    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header del Dashboard */}
            <header className="relative w-full min-h-[16rem] sm:min-h-[22rem] overflow-hidden rounded-b-[2rem] sm:rounded-b-[3rem] shadow-xl flex flex-col pb-8">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 z-10 backdrop-blur-[2px]"></div>
                <img src={headerImage} alt="Paquete" className="absolute inset-0 w-full h-full object-cover z-0" />
                
                <div className="relative z-20 flex flex-col h-full px-4 sm:px-8 pt-6 max-w-6xl mx-auto w-full">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mt-8">
                        <div className="flex-1">
                            <span className="bg-[#ffc604] text-black font-black text-[10px] sm:text-xs px-2.5 sm:px-3 py-1 rounded-full uppercase tracking-wider mb-2.5 sm:mb-3 inline-block shadow-md">
                                Código: {currentReservation?.reservationCode || 'Pendiente'}
                            </span>
                            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight drop-shadow-lg tracking-tight">
                                {formatTitle(pkgInfo?.name) || 'Detalle de Viaje'}
                            </h1>
                            <p className="text-purple-200 mt-1.5 sm:mt-2 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium">
                                <Calendar size={14} className="sm:w-4 sm:h-4" /> 
                                Registrada el {currentReservation?.reservationDate ? new Date(currentReservation.reservationDate).toLocaleDateString() : '---'}
                            </p>
                        </div>
                        
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 sm:p-4 rounded-2xl text-white text-left md:text-right shrink-0 shadow-lg">
                            <p className="text-[10px] sm:text-xs uppercase tracking-wider text-white/70 font-bold mb-0.5 sm:mb-1">Estado actual</p>
                            <p className="text-lg sm:text-2xl font-black text-emerald-400 flex items-center justify-start md:justify-end gap-1.5 sm:gap-2">
                                <CheckCircle2 size={20} className="sm:w-6 sm:h-6" /> {currentReservation?.statusName || 'En proceso'}
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                
                {/* COLUMNA IZQUIERDA: ESTADO FINANCIERO Y CLIENTES */}
                <div className="lg:col-span-2 space-y-5 sm:space-y-6">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2 px-1">
                        <User className="text-purple-600" size={24} /> Clientes y Pagos
                    </h2>
                    
                    {clients.map((client: any, idx: number) => {
                        const isFullyPaid = (client?.pendingBalance || 0) <= 0;
                        const agreedPrice = client?.agreedPrice || 1;
                        const progressPercentage = Math.min(100, ((client?.totalPaid || 0) / agreedPrice) * 100);

                        return (
                            <div key={idx} className="bg-white rounded-[1.5rem] shadow-md hover:shadow-lg transition-shadow duration-300 border border-[#170822] overflow-hidden">
                                {/* Encabezado do Card de Cliente */}
                                <div className="p-4 sm:p-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="w-full sm:w-auto">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className="bg-slate-100 text-slate-600 text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded md:rounded-md uppercase tracking-wider">
                                                {client?.clientTypeName || 'Pasajero'}
                                            </span>
                                            {client?.identityCard === activeCi && (
                                                <span className="bg-purple-100 text-purple-700 text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded md:rounded-md uppercase tracking-wider">
                                                    Tú
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-base sm:text-lg font-black text-slate-800 leading-tight">{client?.fullName || 'Desconocido'}</h3>
                                        <p className="text-slate-500 text-xs sm:text-sm mt-0.5 font-medium">CI: {client?.identityCard || 'S/N'}</p>
                                    </div>
                                    
                                    {/* Design Responsivo para Saldo */}
                                    <div className={`w-full sm:w-auto p-3 sm:p-3.5 rounded-xl flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border sm:border-0 ${isFullyPaid ? 'bg-emerald-50/50 border-emerald-100' : 'bg-red-50/50 border-red-100'}`}>
                                        <p className="text-[10px] sm:text-[11px] text-slate-500 uppercase font-bold sm:mb-0.5">Saldo Pendiente</p>
                                        <p className={`text-lg sm:text-xl font-black tracking-tight ${isFullyPaid ? 'text-emerald-600' : 'text-red-600'}`}>
                                            Bs. {client?.pendingBalance || 0}
                                        </p>
                                    </div>
                                </div>

                                {/* Barra de progresso */}
                                <div className="px-4 sm:px-6 py-4 bg-slate-50/50">
                                    <div className="flex justify-between text-[11px] sm:text-xs font-bold text-slate-500 mb-2">
                                        <span>Abonado: Bs. {client?.totalPaid || 0}</span>
                                        <span>Total: Bs. {client?.agreedPrice || 0}</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2 sm:h-2.5 overflow-hidden shadow-inner">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-1000 ${isFullyPaid ? 'bg-emerald-500' : 'bg-[#ffc604]'}`} 
                                            style={{ width: `${progressPercentage}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Histórico de Pagamentos */}
                                {client?.payments && client.payments.length > 0 && (
                                    <details className="group border-t border-slate-100">
                                        <summary className="flex justify-between items-center font-bold cursor-pointer list-none px-4 sm:px-6 py-3.5 sm:py-4 text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-colors text-xs sm:text-sm">
                                            <span className="flex items-center gap-2"><Receipt size={16} className="text-slate-400 group-hover:text-purple-500" /> Ver historial de pagos</span>
                                            <span className="transition-transform duration-300 group-open:rotate-180 text-slate-400"><ChevronDown size={18} /></span>
                                        </summary>
                                        <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-1 text-sm text-slate-600 space-y-2.5">
                                            {client.payments.map((payment: any, pIdx: number) => (
                                                <div key={pIdx} className="flex justify-between items-center bg-white p-3 rounded-xl border border-[#170822] shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="min-w-0 pr-3">
                                                        <p className="font-bold text-slate-800 text-xs sm:text-sm truncate">Pago en {payment?.paymentMethodName || 'Método'}</p>
                                                        <p className="text-[10px] sm:text-xs text-slate-500 truncate mt-0.5">
                                                            {payment?.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'Fecha desconocida'} 
                                                            {payment?.bankReference && ` • Ref: ${payment.bankReference}`}
                                                        </p>
                                                    </div>
                                                    <div className="font-black text-emerald-700 bg-emerald-100/50 border border-emerald-100 px-2.5 sm:px-3 py-1 rounded-lg text-xs sm:text-sm shrink-0">
                                                        Bs. {payment?.amount || 0}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </details>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* COLUMNA DERECHA: PRODUTOS E RESUMO */}
                <div className="space-y-5 sm:space-y-6">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2 px-1">
                        <MapPin className="text-purple-600" size={24} /> Qué incluye
                    </h2>
                    
                    <div className="bg-white rounded-[1.5rem] shadow-md border border-slate-100 p-2 overflow-hidden">
                        {products.length === 0 && (
                            <p className="p-6 text-sm text-slate-500 text-center font-medium">No hay productos registrados en esta reserva.</p>
                        )}
                        {products.map((product: any, idx: number) => {
                            const productImg = getValidImage(product?.productImageUrl, "");
                            
                            return (
                                <div key={idx} className="p-3 sm:p-4 flex gap-3 sm:gap-4 items-center sm:items-start border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors rounded-xl">
                                    {productImg ? (
                                        <img src={productImg} alt={formatTitle(product?.productName)} className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover shrink-0 border border-slate-200 shadow-sm" />
                                    ) : (
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-purple-50 flex items-center justify-center shrink-0 border border-purple-100 shadow-sm">
                                            <CheckCircle2 className="text-purple-300 w-6 h-6 sm:w-8 sm:h-8" />
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <span className="inline-block text-[8px] sm:text-[9px] font-black text-purple-700 bg-purple-100 px-2 py-0.5 rounded md:rounded-md uppercase tracking-wider mb-1">
                                            {product?.categoryTypeName || 'Servicio'}
                                        </span>
                                        <h4 className="font-bold text-slate-800 text-xs sm:text-sm leading-tight line-clamp-2">{formatTitle(product?.productName) || 'Producto sin nombre'}</h4>
                                        
                                        {product?.locationName && (
                                            <div className="mt-1.5 flex items-start gap-1 text-[9px] sm:text-[10px] text-slate-500 font-medium">
                                                <MapPin size={12} className="text-red-400 shrink-0" />
                                                <span className="truncate">{product.locationName}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Resumen Total */}
                    <div className="bg-[#170822] rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600 rounded-full blur-3xl opacity-20 -mr-10 -mt-10 pointer-events-none"></div>
                        <p className="text-purple-200 text-sm font-bold uppercase tracking-wider mb-1">Precio Total Paquete</p>
                        <p className="text-3xl font-black text-[#ffc604] flex items-baseline gap-1">
                            <span className="text-lg">Bs.</span> {pkgInfo?.totalPrice || 0}
                        </p>
                        <p className="text-xs text-purple-300 mt-2">Bs. {pkgInfo?.pricePerPerson || 0} por persona</p>
                    </div>
                </div>

            </main>
        </div>
    );
};