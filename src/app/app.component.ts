import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, delay } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Produtos {
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


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'zievo-front';

  constructor(private http: HttpClient, private formBuilder: FormBuilder) { }

  productAddState: boolean = true;
  categoryAddState: boolean = false;
  
  products: Array<Produtos> = [];

  selectedScreen: string = 'sales';

  productTypes: Array<TypeData> = [];

  productsClean: Array<ProductClean> = [];

  productsToBuy: Array<ProductClean> = [];

  totalValue: number = 0;
  totalTaxValue: number = 0;

  productForm!: FormGroup;
  typeDataForm!: FormGroup;

  ngOnInit(): void {

    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      type_id: ['', Validators.required]
    });

    this.typeDataForm = this.formBuilder.group({
      name: ['', Validators.required],
      tax_rate: ['', Validators.required]
    });

    this.carregarProdutos().subscribe(
      products => {
        this.products = products;
        console.log(this.products)
      },
      error => {
        console.error('Erro ao carregar os produtos:', error);
      }
    );
    this.carregarTiposDeProdutos().pipe(
      delay(500) // Adiciona um atraso de 500 milissegundos
    ).subscribe(
      productTypes => {
        this.productTypes = productTypes;
        console.log(this.productTypes);

        // Agora você pode mapear os produtos e adicionar as informações de tipo de produto e tax_rate
        const result = this.products.map(produto => {
          const productType = this.findProductType(produto.type_id);

          return {
            ...produto,
            product_type: productType.name,
            tax_rate: productType.tax_rate,
            quantity: 0,
            tax_value: (+produto.price * (+productType.tax_rate) / 100),
            total_value: 0,
          };
        });

        this.productsClean = result;
        console.log(this.productsClean);
      },
      error => {
        console.error('Erro ao carregar os produtos:', error);
      }
    );

  }

  // Funções que definem estado da página
  changeProductAddState() {
    this.productAddState = true;
    this.categoryAddState = false;
  }

  changeCategoryAddState() {
    this.categoryAddState = true;
    this.productAddState = false;
  }

  findProductType(type_id: any) {
    const productType: TypeData | any = this.productTypes.find(tipo => tipo.id === type_id);
    return {
      name: productType.name,
      tax_rate: productType.tax_rate
    };
  }

  counter(signal: string, id: number) {
    // Encontrar o índice do item no array com o id correspondente
    const index = this.productsClean.findIndex(item => item.id === id);

    // Verificar se o item foi encontrado
    if (index !== -1) {
      // Incrementar ou decrementar o número dependendo do sinal passado
      if (signal === '+') {
        this.productsClean[index].quantity++;
        this.productsClean[index].total_value = ((+this.productsClean[index].price) + (+this.productsClean[index].tax_value)) * (+this.productsClean[index].quantity);
      } else if (signal === '-') {
        if (this.productsClean[index].quantity > 0) {
          this.productsClean[index].quantity--;
          this.productsClean[index].total_value = ((+this.productsClean[index].price) + (+this.productsClean[index].tax_value)) * (+this.productsClean[index].quantity);
        } else {
          console.warn('Número já é zero');
        }

      } else {
        console.error('Sinal inválido');
      }
    } else {
      console.error('Item não encontrado');
    }
    this.addProductToSale(this.productsClean[index])
    /* console.log(this.productsClean) */
  }

  addProductToSale(item: ProductClean) {
    // Verificar se o item já existe no novo array
    const index = this.productsToBuy.findIndex(i => i.id === item.id);

    // Se o item não existir no novo array, adicionar o item
    if (index === -1) {
      this.productsToBuy.push(item);
    }

    // Remover itens com quantity igual a 0
    this.productsToBuy = this.productsToBuy.filter(i => i.quantity !== 0);
    // Somar os valores do total_value de todos os itens
    const totalValue = this.productsToBuy.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.total_value;
    }, 0);
    this.totalValue = totalValue;

    // Somar os valores do tax_value de todos os itens
    const totalTaxValue = this.productsToBuy.reduce((accumulator, currentItem) => {
      return accumulator + (currentItem.tax_value * currentItem.quantity);
    }, 0);
    this.totalTaxValue = totalTaxValue;


    console.log(this.productsToBuy)
  }

  selectScreen(screen: string) {
    this.selectedScreen = screen; 
    console.log(this.selectedScreen)
  }

  onProductSubmit() {
    if (this.productForm.valid) {
      const name = this.productForm.get('name')?.value;
      const type_id = this.productForm.get('type_id')?.value;
      const price = this.productForm.get('price')?.value;

      this.cadastrarProduto(name, type_id, price).subscribe(
        response => {

          // Aqui você pode verificar a resposta da requisição e tomar as ações necessárias
          console.log('Resposta da requisição:', response);
          this.carregarProdutos().subscribe(
            products => {
              this.products = products;
              console.log(this.products)
              console.log(this.productTypes);

              // Agora você pode mapear os produtos e adicionar as informações de tipo de produto e tax_rate
              const result = this.products.map(produto => {
                const productType = this.findProductType(produto.type_id);

                return {
                  ...produto,
                  product_type: productType.name,
                  tax_rate: productType.tax_rate,
                  quantity: 0,
                  tax_value: (+produto.price * (+productType.tax_rate) / 100),
                  total_value: 0,
                };
              });

              this.productsClean = result;
              console.log(this.productsClean);
            },
            error => {
              console.error('Erro ao carregar os produtos:', error);
            }
          );
        },
        error => {
          // Aqui você pode tratar o erro caso a requisição falhe
          console.error('Erro na requisição:', error);
        }
      );
    }
  }

  onTypeDataSubmit() {
    const name = this.typeDataForm.value.name;
    const tax_rate = this.typeDataForm.value.tax_rate;

    this.cadastrarTipoProduto(name, tax_rate).subscribe(
      response => {
        this.carregarTiposDeProdutos().pipe(
          delay(500) // Adiciona um atraso de 500 milissegundos
        ).subscribe(
          productTypes => {
            this.productTypes = productTypes;
            console.log(this.productTypes);
    
            // Agora você pode mapear os produtos e adicionar as informações de tipo de produto e tax_rate
            const result = this.products.map(produto => {
              const productType = this.findProductType(produto.type_id);
    
              return {
                ...produto,
                product_type: productType.name,
                tax_rate: productType.tax_rate,
                quantity: 0,
                tax_value: (+produto.price * (+productType.tax_rate) / 100),
                total_value: 0,
              };
            });
    
            this.productsClean = result;
            console.log(this.productsClean);
          },
          error => {
            console.error('Erro ao carregar os produtos:', error);
          }
        );
        console.log('Resposta da requisição:', response);
      },
      error => {
        // Aqui você pode tratar o erro caso a requisição falhe
        console.error('Erro na requisição:', error);
      }
    );
  }

   // Função para registrar a venda
   onSaleSubmit() {
    this.sendSales(this.productsToBuy).subscribe(
      response => {
        console.log(this.productsToBuy)
        // Aqui você pode lidar com a resposta da requisição
        console.log('Venda registrada com sucesso:', response);
      },
      error => {
        // Aqui você pode lidar com o erro caso a requisição falhe
        console.error('Erro ao registrar venda:', error);
      }
    );
  }

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

  carregarProdutos() {
    return this.http.get<any[]>('http://localhost/zievo-test/api/apiProdutos.php');
  }

  carregarTiposDeProdutos() {
    return this.http.get<any[]>('http://localhost/zievo-test/api/apiTipoProdutos.php');
  }
}
