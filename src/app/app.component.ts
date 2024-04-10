import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { delay } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ZievoApiService } from './services/zievo-api/zievo-api.service';
import { ProductClean, Products, TypeData } from './interfaces/product.interface';
import { StateServiceService } from './services/state-control/state-service.service';
import { DataControlService } from './services/data-control/data-control.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'zievo-front';

  //Arrays para inserção dos valores
  // Produtos
  products: Array<Products> = [];
  //Categorias 
  productTypes: Array<TypeData> = [];
  //Produtos tratados para o front
  productsClean: Array<ProductClean> = [];


  constructor(
    private formBuilder: FormBuilder,
    public zievoApi: ZievoApiService,
    public stateControl: StateServiceService,
    public dataControl: DataControlService
  ) { }


  ngOnInit(): void {
    this.getDataToRun()
  }

  // Função define os dados para aplicação iniciar
  getDataToRun() {
    this.zievoApi.carregarProdutos().subscribe(
      products => {
        this.products = products;
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

        // Agora você pode mapear os produtos e adicionar as informações de tipo de produto e tax_rate
        const result = this.products.map(produto => {
          const productType = this.dataControl.findProductType(produto.type_id, this.productTypes);

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
      },
      error => {
        console.error('Erro ao carregar os produtos:', error);
      }
    );
  }

  // Ao salvar dados atualiza dados por toda a aplicação
  onSaveProduct(event: any) {
    this.getDataToRun()
  }
}
