import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { delay } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ZievoApiService } from './services/zievo-api.service';
import { ProductClean, Products, TypeData } from './interfaces/product.interface';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'zievo-front';

  constructor(private http: HttpClient, private formBuilder: FormBuilder, public zievoApi: ZievoApiService) { }

  //Variaveis para definição de estado da página
  productAddState: boolean = true;
  categoryAddState: boolean = false;
  selectedScreen: string = 'sales';
  
  //Arrays para inserção dos valores
  // Produtos
  products: Array<Products> = [];
  //Categorias 
  productTypes: Array<TypeData> = [];
  //Produtos tratados para o front
  productsClean: Array<ProductClean> = [];
  //Listagem de produtos adicionados ao carrinho
  productsToBuy: Array<ProductClean> = [];

  // Valores finais para exibição
  //Valor total 
  totalValue: number = 0;
  //Valor total dos impostos
  totalTaxValue: number = 0;

  // Formularios
  // Formulario adição de produto
  productForm!: FormGroup;
  // Formulario adição de categoria do produto
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

    this.zievoApi.carregarProdutos().subscribe(
      products => {
        this.products = products;
        console.log(this.products)
      },
      error => {
        console.error('Erro ao carregar os produtos:', error);
      }
    );
    this.zievoApi.carregarTiposDeProdutos().pipe(
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

      this.zievoApi.cadastrarProduto(name, type_id, price).subscribe(
        response => {

          // Aqui você pode verificar a resposta da requisição e tomar as ações necessárias
          console.log('Resposta da requisição:', response);
          this.zievoApi.carregarProdutos().subscribe(
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

    this.zievoApi.cadastrarTipoProduto(name, tax_rate).subscribe(
      response => {
        this.zievoApi.carregarTiposDeProdutos().pipe(
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
    this.zievoApi.sendSales(this.productsToBuy).subscribe(
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

  
}
