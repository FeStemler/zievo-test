import { Injectable } from '@angular/core';
import { TypeData } from 'src/app/interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class StateServiceService {

  // Variáveis para definição do estado da página
  productAddState: boolean = true;
  categoryAddState: boolean = false;
  selectedScreen: string = 'products';

  popMessage: string = '';
  messageState: boolean = false;

  constructor() { }

  // Funções que definem o estado da página

  // Altera o estado para adicionar produto e desativa o estado de adicionar categoria
  changeProductAddState() {
    this.productAddState = true;
    this.categoryAddState = false;
  }

  // Altera o estado para adicionar categoria e desativa o estado de adicionar produto
  changeCategoryAddState() {
    this.categoryAddState = true;
    this.productAddState = false;
  }

  // Seleciona a tela a ser exibida
  selectScreen(screen: string) {
    this.selectedScreen = screen;
  }

  // Adiciona uma mensagem de erro e configura o tempo de exibição
  addMessage(error: string) {
    this.popMessage = error;

    this.messageState = true;
    // Limpa a mensagem após 3 segundos (3000 milissegundos)
    setTimeout(() => {
      this.messageState = false;
    }, 4000); 

    // Limpa a mensagem após 5 segundos (5000 milissegundos)
    setTimeout(() => {
      this.popMessage = '';
    }, 5000); 
  }

  // Valida se existe alguma categoria cadastrada antes de prosseguir
  validateCategory(productTypeArray: Array<TypeData>) {
    if (productTypeArray.length == 0) {
      this.addMessage('Crie uma categoria para avançar');
    }
  }
}
