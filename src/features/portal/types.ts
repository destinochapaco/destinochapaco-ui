export interface PortalPaymentResponse {
    paymentDate: string;
    amount: number;
    paymentMethodName: string;
    bankReference: string;
}

export interface PortalClientResponse {
    // Datos personales
    fullName: string;
    phoneNumber: string | null;
    identityCard: string;
    clientTypeName: string;
    birthDate: string | null; // LocalDateTime de Java llega como un string ISO (ej: "2000-05-20T00:00:00")
    grade: string | null;
    city: string | null;

    // Datos académicos
    university: string | null;
    faculty: string | null;
    career: string | null;
    studyAreaTypeName: string | null;

    // Finanzas del cliente
    agreedPrice: number;
    totalPaid: number;
    pendingBalance: number;

    // Historial de Pagos
    payments: PortalPaymentResponse[];
}

export interface PortalProductResponse {
    productName: string;
    productDescription: string;
    productImageUrl: string | null;
    categoryTypeName: string;
    locationName: string | null;
    locationAddress: string | null;
    locationMapUrl: string | null;
}

export interface PortalPackageResponse {
    name: string;
    imageUrl: string | null;
}

export interface PortalReservationResponse {
    reservationCode: string;
    reservationDate: string;
    statusName: string;
    totalPrice: number;
    packageInfo: PortalPackageResponse;
    products: PortalProductResponse[];
    clients: PortalClientResponse[];
}