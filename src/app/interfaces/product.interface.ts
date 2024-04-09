
export interface Products {
    id: number;
    name: string;
    price: string;
    type_id: string;
}

export interface ProductClean {
    id: number;
    name: string;
    price: string;
    product_type: string;
    tax_rate: number;
    tax_value: number;
    type_id: string;
    quantity: number;
    total_value: number;
}

export interface TypeData {
    id: number;
    name: string;
    tax_rate: number;
}