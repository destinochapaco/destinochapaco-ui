import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicCatalogPage } from '../features/catalog/pages/PublicCatalogPage';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal dinámica que captura el ID o nombre de la empresa */}
        <Route path="/:empresaId/catalog" element={<PublicCatalogPage />} />

        {/* Si alguien entra a la raíz sin empresa, podemos mostrar un 404 o redirigir */}
        <Route path="/" element={
            <div className="flex items-center justify-center h-screen">
                <h1 className="text-2xl font-bold text-gray-500">
                    Por favor, ingresa a través del enlace de tu agencia de viajes.
                </h1>
            </div>
        } />
        
        {/* Cualquier otra ruta no definida (404) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};