import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Map, AlertCircle, Loader2 } from "lucide-react";

import { getPublicCatalog } from "../services/catalogService";
import { PublicCatalogFilters } from "../components/PublicCatalogFilters";
import { PackageCard } from "../components/PackageCard";
import type { PublicPackage } from "../types";

const EMPRESA_ID = import.meta.env.VITE_EMPRESA_ID;

export const PublicCatalogPage = () => {
    // 1. Fetch de datos con React Query usando la variable de entorno
    const { data: packages = [], isLoading, isError } = useQuery({
        queryKey: ["public-catalog", EMPRESA_ID],
        queryFn: () => getPublicCatalog(EMPRESA_ID),
    });

    // 2. Estados
    const [categoryFilter, setCategoryFilter] = useState("ALL");
    const [selectedPackage, setSelectedPackage] = useState<PublicPackage | null>(null);

    // 3. Lógica de Filtrado
    const filteredPackages = useMemo(() => {
        if (categoryFilter === "ALL") return packages;
        return packages.filter(pkg => {
            const codes = Array.from(new Set(pkg.details.map(d => d.categoryTypeCode))).sort().join("-");
            return codes === categoryFilter;
        });
    }, [packages, categoryFilter]);

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
        <div className="min-h-screen bg-base-50 pb-20">
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
                <div className="bg-base-100 rounded-3xl p-4 md:p-6 shadow-md mb-8">
                    <PublicCatalogFilters 
                        packages={packages} 
                        activeFilter={categoryFilter}
                        onFilterChange={setCategoryFilter}
                    />
                </div>

                {/* Grid de Paquetes */}
                {filteredPackages.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl font-bold text-base-content/40">No hay paquetes disponibles en esta categoría.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPackages.map((pkg) => (
                            <PackageCard 
                                key={pkg.slug} // Usamos slug o id
                                pkg={pkg} 
                                onViewDetails={(pkg) => {
                                    // Aquí luego abriremos el modal de detalles
                                    console.log("Abrir detalles de:", pkg.name);
                                    setSelectedPackage(pkg); 
                                }} 
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Aquí a futuro irá el <PackagePublicDetailsModal isOpen={!!selectedPackage} pkg={selectedPackage} /> */}
        </div>
    );
};