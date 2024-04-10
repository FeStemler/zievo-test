// Interface que representa os produtos
export interface Products {
    id: number; // Identificador único do produto
    name: string; // Nome do produto
    price: string; // Preço do produto
    type_id: string; // ID do tipo de produto ao qual pertence
}

// Interface que representa os produtos de forma limpa e com informações adicionais
export interface ProductClean {
    id: number; // Identificador único do produto
    name: string; // Nome do produto
    price: string; // Preço do produto
    product_type: string; // Tipo do produto
    tax_rate: number; // Taxa de imposto do tipo de produto
    tax_value: number; // Valor do imposto sobre o produto
    type_id: string; // ID do tipo de produto
    quantity: number; // Quantidade do produto
    total_value: number; // Valor total do produto (incluindo imposto)
}

// Interface que representa os tipos de dados dos produtos
export interface TypeData {
    id: number; // Identificador único do tipo de produto
    name: string; // Nome do tipo de produto
    tax_rate: number; // Taxa de imposto do tipo de produto
}
