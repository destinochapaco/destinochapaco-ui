import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Opcional: un timeout para que no se quede colgado si el servidor falla
  timeout: 10000, 
});

// Interceptor opcional solo para manejar errores globalmente (ej. mostrar un toast si el servidor cae)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Error en la petición a la API:", error);
    // Aquí a futuro podrías disparar un toast de error genérico
    return Promise.reject(error);
  }
);