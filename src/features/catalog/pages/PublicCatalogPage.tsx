import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Map, AlertCircle, Loader2, SearchX } from "lucide-react";

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
    // Ahora es un array vacío por defecto (significa "mostrar todo")
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [selectedPackage, setSelectedPackage] = useState<PublicPackage | null>(null);

    // 3. Lógica de Filtrado EXACTO
    const filteredPackages = useMemo(() => {
        // Si no hay filtros seleccionados, mostramos todo el catálogo
        if (activeFilters.length === 0) return packages;
        
        return packages.filter(pkg => {
            // Extraemos los códigos de categoría únicos de este paquete
            const pkgCategoryCodes = Array.from(new Set(pkg.details.map(d => String(d.categoryTypeCode))));
            
            // REGLA 1: Deben tener exactamente la misma cantidad de categorías.
            // Si buscas "Solo Inscripción" (1), y el paquete tiene "Inscripción + Bus" (2), lo descarta.
            if (pkgCategoryCodes.length !== activeFilters.length) return false;

            // REGLA 2: Todas las categorías seleccionadas deben estar en el paquete.
            return activeFilters.every(filterCode => pkgCategoryCodes.includes(filterCode));
        });
    }, [packages, activeFilters]);

    // Función para encender/apagar un filtro
    const handleToggleFilter = (code: string) => {
        setActiveFilters(prev => 
            prev.includes(code) 
                ? prev.filter(c => c !== code) // Si ya estaba, lo quitamos
                : [...prev, code] // Si no estaba, lo agregamos
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
            {/* Header decorativo */}
            <header className="bg-primary text-primary-content pt-12 pb-24 px-4 text-center rounded-b-[3rem] shadow-sm relative overflow-hidden">
                <div className="absolute top-[-50px] right-[-50px] opacity-10">
                    <Map size={200} />
                </div>
                <div className="relative z-10 max-w-2xl mx-auto">
                    <h1 className="text-3xl md:text-5xl font-black mb-4">Descubre tu próximo destino</h1>
                    <p className="opacity-90 md:text-lg">Explora nuestras opciones y elige el paquete perfecto para ti.</p>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
                {/* Contenedor de Filtros */}
                <div className="bg-transparent mb-8">
                    <PublicCatalogFilters 
                        packages={packages} 
                        activeFilters={activeFilters}
                        onFilterToggle={handleToggleFilter}
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
                            onClick={() => setActiveFilters([])} 
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
        </div>
    );
};