// Interface para os itens de venda
export interface SaleItem {
    product_id: number; // ID do produto vendido
    quantity: number; // Quantidade do produto vendido
    subtotal: string; // Subtotal da venda do produto
    tax_amount: string; // Valor do imposto sobre o produto vendido
}

// Interface para os dados de vendas
export interface Sale {
    id: number; // Identificador único da venda
    sale_date: string; // Data da venda
    total_amount: string; // Valor total da venda
    total_tax: string; // Valor total dos impostos sobre a venda
    itens: SaleItem[]; // Itens vendidos na venda
}
