import { api } from '../../../lib/axios';
import type { PublicPackage } from '../types';

export const getPublicCatalog = async (empresaId: string): Promise<PublicPackage[]> => {
    const { data } = await api.get(`/public/${empresaId}/catalog`);
    return data;
};