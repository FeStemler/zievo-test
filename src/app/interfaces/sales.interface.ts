// Interface para os itens de venda
export interface SaleItem {
    product_id: number;
    quantity: number;
    subtotal: string;
    tax_amount: string;
}

// Interface para os dados de vendas
export interface Sale {
    id: number;
    sale_date: string;
    total_amount: string;
    total_tax: string;
    items: SaleItem[];
}