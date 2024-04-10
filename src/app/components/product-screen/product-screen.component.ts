import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductClean, Products, TypeData } from 'src/app/interfaces/product.interface';
import { StateServiceService } from 'src/app/services/state-control/state-service.service';
import { ZievoApiService } from 'src/app/services/zievo-api/zievo-api.service';
import { DataControlService } from 'src/app/services/data-control/data-control.service';
import { delay } from 'rxjs';

@Component({
  selector: 'app-product-screen',
  templateUrl: './product-screen.component.html',
  styleUrls: ['./product-screen.component.scss']
})
export class ProductScreenComponent {

  // Inputs recebidos do componente pai
  @Input() products!: Array<Products>;
  @Input() productsClean!: Array<ProductClean>;
  @Input() productTypes!: Array<TypeData>;

  // Evento de saída para notificar o componente pai sobre salvamentos no banco de dados
  @Output() onSaveOnDatabase: EventEmitter<any> = new EventEmitter();

  // Array de produtos a serem comprados
  productsToBuy: Array<ProductClean> = [];
  
  // Valores totais
  totalValue: number = 0;
  totalTaxValue: number = 0;

  // Formulários
  productForm!: FormGroup; // Formulário para adição de produto
  typeDataForm!: FormGroup; // Formulário para adição de categoria do produto

  constructor(
    private formBuilder: FormBuilder,
    public zievoApi: ZievoApiService,
    public stateControl: StateServiceService,
    public dataControl: DataControlService
  ) { }

  ngOnInit(): void {
    // Inicialização dos formulários
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      type_id: ['', Validators.required]
    });

    this.typeDataForm = this.formBuilder.group({
      name: ['', Validators.required],
      tax_rate: ['', Validators.required]
    });
  }


  // Adiciona um produto à lista de produtos a serem comprados
  addProductToSale(item: ProductClean) {
    const index = this.productsToBuy.findIndex(i => i.id === item.id);

    if (index === -1) {
      this.productsToBuy.push(item);
    }

    this.productsToBuy = this.productsToBuy.filter(i => i.quantity !== 0);
    const totalValue = this.productsToBuy.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.total_value;
    }, 0);
    this.totalValue = totalValue;

    const totalTaxValue = this.productsToBuy.reduce((accumulator, currentItem) => {
      return accumulator + (currentItem.tax_value * currentItem.quantity);
    }, 0);
    this.totalTaxValue = totalTaxValue;
  }


  // Contador para aumentar ou diminuir a quantidade de um produto
  counter(signal: string, id: number) {
    const index = this.productsClean.findIndex(item => item.id === id);

    if (index !== -1) {
      if (signal === '+') {
        this.productsClean[index].quantity++;
        this.productsClean[index].total_value = ((+this.productsClean[index].price) + (+this.productsClean[index].tax_value)) * (+this.productsClean[index].quantity);
      } else if (signal === '-') {
        if (this.productsClean[index].quantity > 0) {
          this.productsClean[index].quantity--;
          this.productsClean[index].total_value = ((+this.productsClean[index].price) + (+this.productsClean[index].tax_value)) * (+this.productsClean[index].quantity);
        }

      }
    }
    this.addProductToSale(this.productsClean[index])
  }

  // Submissão do formulário de adição de produto
  onProductSubmit() {
    if (this.productForm.valid) {
      const name = this.productForm.get('name')?.value;
      const type_id = this.productForm.get('type_id')?.value;
      const price = this.productForm.get('price')?.value;

      this.zievoApi.cadastrarProduto(name, type_id, price).subscribe(
        response => {
          this.zievoApi.carregarProdutos().subscribe(
            products => {
              this.products = products;

              const result = this.products.map(produto => {
                const productType = this.dataControl.findProductType(produto.type_id, this.productTypes);

                const tax_value = (+produto.price * (+productType.tax_rate) / 100);

                return {
                  ...produto,
                  product_type: productType.name,
                  tax_rate: productType.tax_rate,
                  quantity: 0,
                  tax_value,
                  total_value: 0,
                };
              });

              this.productsClean = result;

              this.onSaveOnDatabase.emit();

              this.productForm.reset();
              this.stateControl.addMessage('Produto cadastrado com sucesso');
            },
            error => {
              this.stateControl.addMessage('Erro ao carregar os produtos');
              console.error('Erro ao carregar os produtos:', error);
            }
          );
        },
        error => {
          this.stateControl.addMessage('Erro na requisição');
          console.error('Erro na requisição:', error);
        }
      );
    }
  }

  // Submissão do formulário de adição de categoria
  onTypeDataSubmit() {
    const name = this.typeDataForm.value.name;
    const tax_rate = this.typeDataForm.value.tax_rate;

    this.zievoApi.cadastrarTipoProduto(name, tax_rate).subscribe(
      response => {
        this.zievoApi.carregarTiposDeProdutos().pipe(
          delay(500)
        ).subscribe(
          productTypes => {
            this.productTypes = productTypes;

            const result = this.products.map(produto => {
              const productType = this.dataControl.findProductType(produto.type_id, this.productTypes);

              const tax_value = (+produto.price * (+productType.tax_rate) / 100);

              return {
                ...produto,
                product_type: productType.name,
                tax_rate: productType.tax_rate,
                quantity: 0,
                tax_value,
                total_value: 0,
              };
            });

            this.productsClean = result;

            this.typeDataForm.reset();
            this.stateControl.addMessage('Categoria cadastrada com sucesso');
          },
          error => {
            this.stateControl.addMessage('Erro ao carregar os produtos');
            console.error('Erro ao carregar os produtos:', error);
          }
        );
      },
      error => {
        this.stateControl.addMessage('Erro na requisição');
        console.error('Erro na requisição:', error);
      }
    );
  }


// Submissão da venda
onSaleSubmit() {
  this.zievoApi.sendSales(this.productsToBuy).subscribe(
    response => {
      this.stateControl.addMessage('Venda registrada com sucesso');

      this.productsToBuy = [];
      for (let i = 0; i < this.productsClean.length; i++) {
        this.productsClean[i].quantity = 0;
        this.productsClean[i].total_value = 0;
      }
      this.totalTaxValue = 0;
      this.totalValue = 0;
    },
    error => {
      this.stateControl.addMessage('Erro ao registrar venda');
      console.error('Erro ao registrar venda:', error);
    }
  );
}


}
