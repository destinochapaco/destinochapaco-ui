import { api } from '../../../lib/axios';
import type { PortalReservationResponse } from "../types"; // <-- Asegúrate de importar el nuevo tipo

// ... tu código existente (getPublicCatalog) ...

// NUEVA FUNCIÓN: Obtener la reserva por CI
export const getClientReservation = async (empresaId: string, ci: string): Promise<PortalReservationResponse> => {
    // Nota: Dependiendo de tu backend, esto podría devolver un objeto o un array de reservas. 
    // Asumiremos que devuelve el objeto de la reserva activa, según tu estructura de Java.
    const response = await api.get<PortalReservationResponse>(`/public/${empresaId}/portal/client/${ci}/reservations`);
    return response.data;
};