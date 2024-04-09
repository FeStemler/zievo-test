import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductClean, Products, TypeData } from '../interfaces/product.interface';
import { Sale } from '../interfaces/sales.interface';

@Injectable({
  providedIn: 'root'
})
export class ZievoApiService {

  constructor(private http: HttpClient,) { }

  //Funções Get
  carregarProdutos() {
    return this.http.get<any[]>('http://localhost/zievo-test/api/apiProdutos.php');
  }

  carregarTiposDeProdutos() {
    return this.http.get<any[]>('http://localhost/zievo-test/api/apiTipoProdutos.php');
  }

   // Função para obter os dados de vendas do arquivo apiVendas.php
   getSalesData(): Observable<Sale[]> {
    return this.http.get<Sale[]>('http://localhost/zievo-test/api/apiVendas.php');
  }

  //Funções Post
  cadastrarProduto(name: string, type_id: number, price: number): Observable<any> {
    // Define o corpo da requisição
    const body = {
      action: 'cadastrar_produto', // Define a ação como 'cadastrar_produto'
      name: name, // Nome do produto
      type_id: type_id, // ID do tipo de produto
      price: price // Preço do produto
    };

    // Define os cabeçalhos da requisição
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    // Faz a requisição POST para a API
    return this.http.post<any>('http://localhost/zievo-test/api/apiProdutos.php', body, { headers: headers });
  }

  cadastrarTipoProduto(name: string, tax_rate: number): Observable<any> {
    // Define o corpo da requisição
    const body = {
      name: name,
      tax_rate: tax_rate
    };

    // Define os cabeçalhos da requisição
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    // Faz a requisição POST para a API
    return this.http.post<any>('http://localhost/zievo-test/api/apiTipoProdutos.php', body, { headers: headers });
  }

  sendSales(items: ProductClean[]): Observable<any> {
    // Mapeie os itens de venda para incluir apenas os dados necessários
    const itemsToSend = items.map(item => ({
      product_id: item.id,
      quantity: item.quantity, 
      subtotal: +item.price * item.quantity, 
      tax_amount: +item.tax_value * item.quantity
    }));

    // Defina o corpo da requisição
    const body = { items: itemsToSend };

    console.log(body)
    // Defina os cabeçalhos da requisição
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    // Faça a requisição POST para a API
    return this.http.post<any>('http://localhost/zievo-test/api/apiVendas.php', body, { headers: headers });
  }

 
}
