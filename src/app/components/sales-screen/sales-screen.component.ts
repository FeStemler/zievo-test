import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { ZievoApiService } from '../../services/zievo-api/zievo-api.service';
import { Sale } from '../../interfaces/sales.interface';
import { DatePipe } from '@angular/common';
import { ProductClean, TypeData } from '../../interfaces/product.interface';
import { StateServiceService } from 'src/app/services/state-control/state-service.service';

@Component({
  selector: 'app-sales-screen',
  templateUrl: './sales-screen.component.html',
  styleUrls: ['./sales-screen.component.scss']
})
export class SalesScreenComponent {

  // Inputs recebidos do componente pai
  @Input() products!: Array<ProductClean>;
  @Input() productTypes!: Array<TypeData>;

  // Array de vendas
  sales: Sale[] = [];

  // Variáveis para os totais
  totalTax: number = 0;
  totalNet: number = 0;
  totalValue: number = 0;

  // Índice da linha expandida
  indexExpanded: number = -1

  constructor(
    private http: HttpClient,
    public zievoApi: ZievoApiService,
    private datePipe: DatePipe, 
    private stateControl: StateServiceService
  ) { }

  ngOnInit(): void {
    // Inicialização dos dados das vendas
    this.fetchSalesData();
  }

  // Formata a data no formato "dd/MM/yyyy"
  formattedDate(date: string) {
    var arrayDate = date.split(' ');
    var formattedDate = this.datePipe.transform(arrayDate[0], 'dd/MM/yyyy')
    if (formattedDate) {
      arrayDate[0] = formattedDate;
    }
    return arrayDate;
  }

  // Calcula o total líquido das vendas
  getTotalNet(sales: Sale[]): number {
    let totalNet: number = 0;

    for (let sale of sales) {
      totalNet += +sale.total_amount;
    }

    return totalNet;
  }

  // Calcula o total de impostos das vendas
  getTotalTax(sales: Sale[]): number {
    let totalTax: number = 0;
    for (let sale of sales) {
      totalTax += +sale.total_tax;
    }

    return totalTax;
  }

  // Obtém o nome do produto com base no ID
  getProductName(id: number): string {
    const product = this.products.find(item => item.id === id);
    return product ? product.name : '';
  }

  // Obtém o preço do produto com base no ID
  getProductPrice(id: number): number | string {
    const product = this.products.find(item => item.id === id);
    return product ? product.price : '';
  }

  // Obtém o nome da categoria com base no ID
  getCategoryName(id: number): string {
    const category = this.productTypes.find(item => item.id === id);
    return category ? category.name : '';
  }

  // Obtém o imposto da categoria com base no ID
  getCategoryTax(id: number): number | string {
    const category = this.productTypes.find(item => item.id === id);
    return category ? category.tax_rate : '';
  }

  // Busca os dados das vendas na API
  fetchSalesData(): void {
    this.zievoApi.getSalesData().subscribe(
      sales => {
        this.sales = sales;
        this.totalTax = this.getTotalTax(sales);
        this.totalNet = this.getTotalNet(sales);
        this.totalValue = this.totalTax + this.totalNet;
      },
      error => {
        this.stateControl.addMessage('Erro ao buscar os dados de vendas');
        console.error('Erro ao buscar os dados de vendas:', error);
      }
    );
  }
}
