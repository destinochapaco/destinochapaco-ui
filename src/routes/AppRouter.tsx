import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicCatalogPage } from '../features/catalog/pages/PublicCatalogPage';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* La ruta principal ahora carga directamente el catálogo */}
        <Route path="/" element={<PublicCatalogPage />} />
        
        {/* Cualquier otra ruta no definida redirige al inicio */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};