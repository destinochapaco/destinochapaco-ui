import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Loader2, MessageCircle, SearchX } from "lucide-react";

import { getPublicCatalog } from "../services/catalogService";
import { PublicCatalogFilters } from "../components/PublicCatalogFilters";
import { PackageCard } from "../components/PackageCard";
import type { PublicPackage } from "../types";

import { PublicPackageDetailsModal } from "../components/PublicPackageDetailsModal";

const EMPRESA_ID = import.meta.env.VITE_EMPRESA_ID;

export const PublicCatalogPage = () => {
    // 1. Fetch de datos con React Query usando la variable de entorno
    const { data: packages = [], isLoading, isError } = useQuery({
        queryKey: ["public-catalog", EMPRESA_ID],
        queryFn: () => getPublicCatalog(EMPRESA_ID),
    });

    // 2. Estados
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [peopleCountFilter, setPeopleCountFilter] = useState<number>(0);
    const [transportFilter, setTransportFilter] = useState<'all' | 'cama' | 'semicama'>('all'); // Nuevo estado
    const [selectedPackage, setSelectedPackage] = useState<PublicPackage | null>(null);

    // NUEVO: Enlace para el botón flotante general
    const generalWhatsappMessage = encodeURIComponent("¡Hola! Me gustaría recibir más información sobre los paquetes disponibles.");
    const generalWhatsappLink = `https://wa.me/59162820177?text=${generalWhatsappMessage}`; // ¡Cambia las X por tu número!

    // 3. Lógica de Filtrado COMPUESTO
    const filteredPackages = useMemo(() => {
        let result = packages;

        // FILTRO 1: Por Cantidad de Personas
        if (peopleCountFilter > 0) {
            result = result.filter(pkg => pkg.peopleCount === peopleCountFilter);
        }

        // FILTRO 2: Por Combinación Exacta de Categorías
        if (activeFilters.length > 0) {
            result = result.filter(pkg => {
                const pkgCategoryCodes = Array.from(new Set(pkg.details.map(d => String(d.categoryTypeCode))));
                if (pkgCategoryCodes.length !== activeFilters.length) return false;
                return activeFilters.every(filterCode => pkgCategoryCodes.includes(filterCode));
            });
        }

        // FILTRO 3: Por Tipo de Transporte (Bus Cama / Semicama)
        // Verificamos primero si el filtro debería aplicarse según las reglas de visibilidad
        const isTransportVisible = activeFilters.length === 0 || activeFilters.includes("603");
        if (isTransportVisible && transportFilter !== 'all') {
            result = result.filter(pkg => {
                // Buscamos dentro de los detalles del paquete si hay ALGÚN transporte que coincida
                return pkg.details.some(d => {
                    // Si no es un transporte (603), lo ignoramos
                    if (String(d.categoryTypeCode) !== "603") return false;
                    
                    const productName = d.productName.toLowerCase();
                    
                    if (transportFilter === 'semicama') {
                        // Buscamos variaciones de escritura de semicama
                        return productName.includes('semicama') || productName.includes('semi-cama') || productName.includes('semi cama');
                    } else if (transportFilter === 'cama') {
                        // TRUCO: Tiene que decir "cama" pero NO debe decir "semi", así no se cruzan.
                        return productName.includes('cama') && !productName.includes('semi');
                    }
                    return false;
                });
            });
        }

        return result;
    }, [packages, activeFilters, peopleCountFilter, transportFilter]);

    // Función rápida para limpiar TODOS los filtros a la vez (Botón del Empty State)
    const handleClearAllFilters = () => {
        setActiveFilters([]);
        setPeopleCountFilter(0);
        setTransportFilter('all'); // Limpiamos el de transporte también
    };

    // Función para encender/apagar un filtro de categoría
    const handleToggleFilter = (code: string) => {
        setActiveFilters(prev => 
            prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
        );
    };

    // Render de Estados de Carga / Error
    if (isLoading) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-base-50">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="font-bold text-base-content/60 animate-pulse">Cargando experiencias increíbles...</p>
        </div>
    );

    if (isError) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-base-50">
            <AlertCircle className="w-16 h-16 text-error" />
            <h2 className="text-xl font-bold">¡Uy! Algo salió mal.</h2>
            <p className="text-base-content/60">No pudimos cargar el catálogo. Por favor, intenta recargar la página.</p>
        </div>
    );
    
    return (
        <div className="min-h-screen bg-slate-100 pb-20">
            {/* HEADER */}
            <header className="relative w-full min-h-[280px] sm:min-h-[360px] flex flex-col px-4 sm:px-8 py-6 sm:py-8 overflow-hidden shadow-xl rounded-b-[2rem] sm:rounded-b-[3.5rem] mb-8">
                
                {/* 1. IMAGEN DE FONDO */}
                <div 
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: "url('/background-header.webp')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                ></div>
                
                {/* 2. OVERLAY OSCURO Y DESENFOQUE */}
                <div className="absolute inset-0 bg-black/65 backdrop-blur-[3px] z-10"></div>

                {/* 3. LOGOS (Parte Superior) */}
                <div className="relative z-20 w-full max-w-7xl mx-auto flex items-start justify-between">
                    
                    {/* Logo Izquierda: Destino Chapaco */}
                    <div className="flex-shrink-0">
                        <img 
                            src="/destino-chapaco-logo.png" 
                            alt="Destino Chapaco" 
                            className="h-12 sm:h-20 w-auto object-contain drop-shadow-lg hover:scale-105 transition-transform duration-300"
                        />
                    </div>

                    {/* Logo Derecha: Congreso (.jpg con marco elegante) */}
                    <div className="flex-shrink-0 rounded-xl overflow-hidden shadow-lg border border-white/20 hover:scale-105 transition-transform duration-300">
                        <img 
                            src="/congreso-logo.jpg" 
                            alt="Congreso Universitario" 
                            className="h-10 sm:h-16 w-auto object-contain rounded-lg" 
                        />
                    </div>

                </div>

                {/* 4. TEXTOS (Centro/Abajo) */}
                <div className="relative z-20 w-full flex-1 flex flex-col items-center justify-center text-center mt-4 sm:mt-0">
                    
                    {/* TÍTULO PRINCIPAL */}
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-md mb-3 sm:mb-4">
                        CONGRESO ACADÉMICO 2026
                    </h1>
                    
                    {/* SUBTÍTULO / MISIÓN */}
                    <p className="text-sm sm:text-lg md:text-xl text-gray-200 font-medium max-w-2xl drop-shadow-sm px-2 leading-relaxed">
                        Organizamos tu viaje perfecto. Descubre Tarija, conecta con profesionales y vive una experiencia inolvidable sin preocupaciones.
                    </p>
                    
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
                {/* Contenedor de Filtros */}
                <div className="bg-transparent mb-8">
                    <PublicCatalogFilters 
                        packages={packages} 
                        activeFilters={activeFilters}
                        onFilterToggle={handleToggleFilter}
                        peopleCount={peopleCountFilter}
                        onPeopleCountChange={setPeopleCountFilter}
                        transportType={transportFilter}
                        onTransportTypeChange={setTransportFilter}
                    />
                </div>
                
                {/* Grid de Paquetes o Mensaje de Vacío */}
                {filteredPackages.length === 0 ? (
                    
                    /* DISEÑO DE ESTADO VACÍO (Empty State) */
                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-3xl shadow-sm border border-slate-200 w-full max-w-2xl mx-auto mt-8">
                        <div className="bg-slate-50 p-5 rounded-full mb-5 border border-slate-100">
                            <SearchX size={48} className="text-slate-400" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-2">
                            Aún no hay paquetes habilitados
                        </h3>
                        <p className="text-slate-500 mb-6 max-w-md text-sm md:text-base">
                            No encontramos opciones con esta combinación exacta de servicios. Intenta desactivar algún filtro para ver más opciones disponibles.
                        </p>
                        <button 
                            onClick={handleClearAllFilters}
                            className="btn bg-[#ffc604] hover:bg-[#eab003] text-black border-none rounded-xl font-black shadow-md shadow-[#ffc604]/30 px-8 sm:px-10 h-12 mt-2"
                        >
                            Mostrar todos los paquetes
                        </button>
                    </div>

                ) : (
                    /* CONTENEDOR FLEX DE LAS TARJETAS */
                    <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                        {filteredPackages.map((pkg) => (
                            <PackageCard 
                                key={pkg.slug} 
                                pkg={pkg} 
                                onViewDetails={(pkg) => {
                                    setSelectedPackage(pkg); 
                                }} 
                            />
                        ))}
                    </div>

                )}
            </main>

            {/* MODAL DE DETALLES */}
            <PublicPackageDetailsModal 
                isOpen={!!selectedPackage} 
                onClose={() => setSelectedPackage(null)} 
                pkg={selectedPackage} 
            />

{/* BOTÓN FLOTANTE DE WHATSAPP (Aparece solo si el modal está cerrado) */}
            {!selectedPackage && (
                <a
                    href={generalWhatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-[#25D366] rounded-full shadow-xl shadow-[#25D366]/40 hover:bg-[#20b858] hover:scale-110 transition-all duration-300 group"
                    aria-label="Contactar por WhatsApp"
                >
                    {/* Imagen del icono de WhatsApp (Tu archivo PNG) */}
                    <img 
                        src="/whatsapp-ico.png" 
                        alt="WhatsApp" 
                        className="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-sm relative z-10" 
                    />
                    
                    {/* Efecto de "Ping" animado detrás del botón para llamar la atención sutilmente */}
                    <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 group-hover:hidden z-0"></span>
                </a>
            )}

        </div>
    );
};