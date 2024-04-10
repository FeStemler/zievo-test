import { Injectable } from '@angular/core';
import { TypeData } from 'src/app/interfaces/product.interface';
import { ZievoApiService } from '../zievo-api/zievo-api.service';

@Injectable({
  providedIn: 'root'
})
export class DataControlService {

  constructor(public zievoApi: ZievoApiService,) { }

  // Função para encontrar o tipo de produto com base no ID
  findProductType(type_id: any, product_types: Array<TypeData>) {
    // Encontra o tipo de produto correspondente com base no ID
    const productType: TypeData | any = product_types.find(tipo => tipo.id === type_id);
    // Retorna o nome e a taxa de imposto do tipo de produto encontrado
    return {
      name: productType.name,
      tax_rate: productType.tax_rate
    };
  }
}
