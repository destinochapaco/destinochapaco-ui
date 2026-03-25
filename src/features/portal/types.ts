export interface PortalPaymentResponse {
    paymentDate: string;
    amount: number;
    paymentMethodName: string;
    bankReference: string;
}

export interface PortalClientResponse {
    fullName: string;
    identityCard: string;
    clientTypeName: string;
    agreedPrice: number;
    totalPaid: number;
    pendingBalance: number;
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
    totalPrice: number;
    pricePerPerson: number;
}

export interface PortalReservationResponse {
    reservationCode: string;
    reservationDate: string;
    statusName: string;
    packageInfo: PortalPackageResponse;
    products: PortalProductResponse[];
    clients: PortalClientResponse[];
}