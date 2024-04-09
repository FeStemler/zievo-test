import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ZievoApiService } from '../services/zievo-api.service';
import { Sale } from '../interfaces/sales.interface';

@Component({
  selector: 'app-sales-screen',
  templateUrl: './sales-screen.component.html',
  styleUrls: ['./sales-screen.component.scss']
})
export class SalesScreenComponent {

  sales: Sale[] = [];
  
  constructor(private http: HttpClient,  public zievoApi: ZievoApiService) { }

  ngOnInit(): void {
    this.fetchSalesData();
  }
  
  fetchSalesData(): void {
    this.zievoApi.getSalesData().subscribe(
      sales => {
        this.sales = sales;
        console.log(this.sales); // Aqui você pode verificar os dados recebidos
      },
      error => {
        console.error('Erro ao buscar os dados de vendas:', error);
      }
    );
  }
}
