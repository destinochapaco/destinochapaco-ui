import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
    Search, User, CreditCard, ChevronDown, CheckCircle2, 
    Calendar, MapPin, Receipt, ArrowLeft, Ticket, AlertCircle 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getClientReservation } from "../services/portalService";

const EMPRESA_ID = import.meta.env.VITE_EMPRESA_ID;

export const ReservationPortalPage = () => {
    const navigate = useNavigate();
    
    // Estados del formulario
    const [ciInput, setCiInput] = useState("");
    const [activeCi, setActiveCi] = useState<string | null>(null);

    // Fetch de la reserva
    const { data: reservationData, isLoading, isError } = useQuery({
        queryKey: ["reservation", EMPRESA_ID, activeCi],
        queryFn: () => getClientReservation(EMPRESA_ID, activeCi!),
        enabled: !!activeCi,
        retry: false, 
    });

    // Validar y limpiar el input para que SOLO acepte números
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

    // --- VISTA 1: INGRESO DE CI (Login) ---
    if (!activeCi) {
        return (
            <div className="min-h-screen bg-slate-100 flex flex-col relative">
                <header className="h-[40vh] bg-[#170822] w-full absolute top-0 left-0 z-0 overflow-hidden rounded-b-[3rem]">
                    <div className="absolute inset-0 bg-black/50 z-10"></div>
                    <img src="/background-header.webp" alt="Background" className="w-full h-full object-cover z-0" />
                </header>

                <div className="flex-1 relative z-20 flex flex-col items-center justify-center px-4 mt-[-5vh]">
                    <button onClick={() => navigate("/")} className="absolute top-6 left-4 sm:left-8 text-white flex items-center gap-2 hover:text-purple-200 transition-colors">
                        <ArrowLeft size={20} /> <span className="font-bold">Volver al catálogo</span>
                    </button>
                    
                    <div className="bg-white p-8 sm:p-12 rounded-[2rem] shadow-2xl w-full max-w-md text-center transform hover:scale-[1.02] transition-transform duration-500">
                        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <Ticket className="text-purple-600 w-10 h-10" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2">Mi Reserva</h1>
                        <p className="text-slate-500 text-sm mb-8">
                            Ingresa tu número de Carnet de Identidad para ver los detalles de tu paquete y estado de pagos.
                        </p>

                        <form onSubmit={handleSearch} className="flex flex-col gap-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="text-slate-400" size={20} />
                                </div>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    placeholder="Ej: 12345678"
                                    value={ciInput}
                                    onChange={handleCiChange}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-lg text-slate-800 placeholder:font-normal focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all"
                                    required
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={ciInput.length < 5}
                                className="w-full bg-[#ffc604] hover:bg-[#eab003] disabled:opacity-50 disabled:hover:bg-[#ffc604] text-black font-black text-lg py-4 rounded-2xl shadow-lg shadow-[#ffc604]/30 flex items-center justify-center gap-2 transition-all mt-2"
                            >
                                <Search size={20} /> Buscar mi reserva
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    // --- ESTADOS DE CARGA ---
    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mb-4"></div>
                <h2 className="text-xl font-bold text-slate-800">Buscando tu reserva...</h2>
            </div>
        );
    }

    // 🛡️ --- MAGIA DE PROGRAMACIÓN DEFENSIVA --- 🛡️

    // 1. Validar si el backend mandó una Lista o un Objeto y extraer la reserva activa
    const currentReservation = Array.isArray(reservationData) ? reservationData[0] : reservationData;

    // 2. Mostrar vista de error si definitivamente no llegó ninguna reserva
    if (isError || !currentReservation) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
                <AlertCircle className="text-red-500 w-20 h-20 mb-4" />
                <h2 className="text-2xl font-black text-slate-800 mb-2 text-center">Reserva no encontrada</h2>
                <p className="text-slate-500 mb-8 text-center max-w-md">
                    No encontramos ninguna reserva asociada al CI <strong>{activeCi}</strong>. Verifica que el número sea correcto.
                </p>
                <button onClick={resetSearch} className="bg-[#170822] text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-900 transition-colors">
                    Intentar con otro CI
                </button>
            </div>
        );
    }

    // 3. Extracción Segura usando Optional Chaining (?. y ||)
    // De esta manera, si algo llega undefined o null, le asignamos un objeto vacío por defecto y evitamos el crasheo.
    const pkgInfo = currentReservation?.packageInfo || {};
    const clients = currentReservation?.clients || [];
    const products = currentReservation?.products || [];

    // 4. Validador inteligente de imágenes (Limpia nulls, "null" en string, o vacíos)
    const getValidImage = (url: string | null | undefined, fallback: string) => {
        if (!url || typeof url !== 'string' || url.trim() === "" || url === "null" || url === "undefined") {
            return fallback;
        }
        return url;
    };

    const headerImage = getValidImage(pkgInfo?.imageUrl, "/background-header.webp");

    // --- VISTA 2: DASHBOARD DE RESERVA ---
    return (
        <div className="min-h-screen bg-slate-100 pb-20">
            {/* Header del Dashboard */}
            <header className="relative w-full h-64 sm:h-80 overflow-hidden rounded-b-[2rem] sm:rounded-b-[3rem] shadow-xl">
                <div className="absolute inset-0 bg-black/60 z-10 backdrop-blur-sm"></div>
                <img src={headerImage} alt="Paquete" className="w-full h-full object-cover z-0" />
                
                <div className="absolute inset-0 z-20 flex flex-col justify-center px-4 sm:px-8 max-w-6xl mx-auto">
                    <button onClick={resetSearch} className="self-start text-white/80 hover:text-white flex items-center gap-2 mb-6 sm:mb-8 font-semibold bg-black/30 px-4 py-2 rounded-xl backdrop-blur-md">
                        <ArrowLeft size={18} /> Salir del portal
                    </button>
                    
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <span className="bg-[#ffc604] text-black font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block shadow-md">
                                Código: {currentReservation?.reservationCode || 'Pendiente'}
                            </span>
                            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight drop-shadow-md">
                                {pkgInfo?.name || 'Detalle de Viaje'}
                            </h1>
                            <p className="text-purple-200 mt-2 flex items-center gap-2">
                                <Calendar size={16} /> 
                                Registrada el {currentReservation?.reservationDate ? new Date(currentReservation.reservationDate).toLocaleDateString() : '---'}
                            </p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-white text-center sm:text-right shrink-0">
                            <p className="text-xs uppercase tracking-wider text-white/70 font-bold mb-1">Estado actual</p>
                            <p className="text-xl sm:text-2xl font-black text-emerald-400 flex items-center justify-center sm:justify-end gap-2">
                                <CheckCircle2 size={24} /> {currentReservation?.statusName || 'En proceso'}
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* COLUMNA IZQUIERDA: ESTADO FINANCIERO Y PASAJEROS */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                        <User className="text-purple-600" /> Clientes y Pagos
                    </h2>
                    
                    {clients.map((client: any, idx: number) => {
                        const isFullyPaid = (client?.pendingBalance || 0) <= 0;
                        const agreedPrice = client?.agreedPrice || 1; // Para evitar divisiones entre cero
                        const progressPercentage = Math.min(100, ((client?.totalPaid || 0) / agreedPrice) * 100);

                        return (
                            <div key={idx} className="bg-white rounded-3xl shadow-sm border border-[#170822] overflow-hidden">
                                <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                                {client?.clientTypeName || 'Pasajero'}
                                            </span>
                                            {client?.identityCard === activeCi && (
                                                <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                                    Tú
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-black text-slate-800">{client?.fullName || 'Desconocido'}</h3>
                                        <p className="text-slate-500 text-sm">CI: {client?.identityCard || 'S/N'}</p>
                                    </div>
                                    
                                    <div className="text-left sm:text-right bg-slate-50 p-3 rounded-xl w-full sm:w-auto">
                                        <p className="text-[11px] text-slate-500 uppercase font-bold mb-0.5">Saldo Pendiente</p>
                                        <p className={`text-xl font-black ${isFullyPaid ? 'text-emerald-500' : 'text-red-500'}`}>
                                            Bs. {client?.pendingBalance || 0}
                                        </p>
                                    </div>
                                </div>

                                {/* Barra de progreso de pago */}
                                <div className="px-5 sm:px-6 py-4 bg-slate-50/50">
                                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                                        <span>Abonado: Bs. {client?.totalPaid || 0}</span>
                                        <span>Total: Bs. {client?.agreedPrice || 0}</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                                        <div 
                                            className={`h-2.5 rounded-full transition-all duration-1000 ${isFullyPaid ? 'bg-emerald-500' : 'bg-[#ffc604]'}`} 
                                            style={{ width: `${progressPercentage}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Desplegable de Historial de Pagos */}
                                {client?.payments && client.payments.length > 0 && (
                                    <details className="group border-t border-slate-100">
                                        <summary className="flex justify-between items-center font-bold cursor-pointer list-none px-5 sm:px-6 py-4 text-slate-700 hover:bg-slate-50 transition-colors">
                                            <span className="flex items-center gap-2 text-sm"><Receipt size={16} /> Ver historial de pagos</span>
                                            <span className="transition group-open:rotate-180"><ChevronDown size={18} /></span>
                                        </summary>
                                        <div className="px-5 sm:px-6 pb-5 pt-2 text-sm text-slate-600 space-y-3">
                                            {client.payments.map((payment: any, pIdx: number) => (
                                                <div key={pIdx} className="flex justify-between items-center bg-white p-3 rounded-xl border border-[#170822] shadow-sm">
                                                    <div>
                                                        <p className="font-bold text-slate-800">Pago en {payment?.paymentMethodName || 'Método'}</p>
                                                        <p className="text-xs text-slate-500">
                                                            {payment?.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'Fecha desconocida'} 
                                                            {payment?.bankReference && ` - Ref: ${payment.bankReference}`}
                                                        </p>
                                                    </div>
                                                    <div className="font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
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

                {/* COLUMNA DERECHA: PRODUCTOS / ITINERARIO */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                        <MapPin className="text-purple-600" /> Qué incluye
                    </h2>
                    
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-2">
                        {products.length === 0 && (
                            <p className="p-4 text-sm text-slate-500 text-center">No hay productos registrados en esta reserva.</p>
                        )}
                        {products.map((product: any, idx: number) => {
                            const productImg = getValidImage(product?.productImageUrl, "");
                            
                            return (
                                <div key={idx} className="p-4 flex gap-4 items-start border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors rounded-2xl">
                                    {productImg ? (
                                        <img src={productImg} alt={product?.productName} className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200" />
                                    ) : (
                                        <div className="w-16 h-16 rounded-xl bg-purple-50 flex items-center justify-center shrink-0 border border-purple-100">
                                            <CheckCircle2 className="text-purple-400" />
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <span className="text-[9px] font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded uppercase tracking-wider">
                                            {product?.categoryTypeName || 'Servicio'}
                                        </span>
                                        <h4 className="font-bold text-slate-800 text-sm mt-1 truncate">{product?.productName || 'Producto sin nombre'}</h4>
                                        
                                        {product?.locationName && (
                                            <div className="mt-1 flex items-start gap-1 text-[10px] text-slate-500">
                                                <MapPin size={12} className="text-red-400 shrink-0 mt-0.5" />
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