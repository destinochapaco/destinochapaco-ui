
export interface PublicPackageDetail {
    productName: string;
    productDescription: string;
    imageUrl: string | null;
    quantity: number;
    categoryTypeName: string;
    categoryTypeCode: number; 
    nameLocation: string;
    addressLocation: string;
    mapUrlLocation: string | null;
}

export interface PublicPackage {
    name: string;
    description: string;
    slug: string;
    imageUrl: string | null;
    imageQrUrl: string | null;
    peopleCount: number;
    totalPrice: number;
    pricePerPerson: number;
    isLowStock: boolean;
    hasStock: boolean;
    details: PublicPackageDetail[];
}