import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductClean, Products, TypeData } from '../../interfaces/product.interface';
import { Sale } from '../../interfaces/sales.interface';

@Injectable({
  providedIn: 'root'
})
export class ZievoApiService {

  constructor(private http: HttpClient,) { }

  // Funções GET para carregar dados da API

  // Carrega os produtos da API
  carregarProdutos() {
    return this.http.get<any[]>('https://felipestemler.com.br/zievo-test/api/apiProdutos.php');
  }

  // Carrega os tipos de produtos da API
  carregarTiposDeProdutos() {
    return this.http.get<any[]>('https://felipestemler.com.br/zievo-test/api/apiTipoProdutos.php');
  }

  // Carrega os dados de vendas da API
  getSalesData(): Observable<Sale[]> {
    return this.http.get<Sale[]>('https://felipestemler.com.br/zievo-test/api/apiVendas.php');
  }

  // Funções POST para enviar dados para a API

  // Cadastra um novo produto na API
  cadastrarProduto(name: string, type_id: number, price: number): Observable<any> {
    const body = {
      action: 'cadastrar_produto', 
      name: name, 
      type_id: type_id, 
      price: price 
    };
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>('https://felipestemler.com.br/zievo-test/api/apiProdutos.php', body, { headers: headers });
  }

  // Cadastra um novo tipo de produto na API
  cadastrarTipoProduto(name: string, tax_rate: number): Observable<any> {
    const body = {
      name: name,
      tax_rate: tax_rate
    };
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>('https://felipestemler.com.br/zievo-test/api/apiTipoProdutos.php', body, { headers: headers });
  }

  // Envia dados de vendas para a API
  sendSales(items: ProductClean[]): Observable<any> {
    const itemsToSend = items.map(item => ({
      product_id: item.id,
      quantity: item.quantity, 
      subtotal: +item.price * item.quantity, 
      tax_amount: +item.tax_value * item.quantity
    }));
    const body = { items: itemsToSend };
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>('https://felipestemler.com.br/zievo-test/api/apiVendas.php', body, { headers: headers });
  } 
}
