import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
    private apiService: ApiService,
  ) {
    this.apiService.getExecutions('201909110809')
      .then((exs: Map<number, Execution>) => {
        console.log(exs);
      });
    this.apiService.getChart1sec('2019091107')
      .then((exs: Map<string, ChartEach>) => {
        console.log(exs);
      });
    this.apiService.getOrderBooks('201909110805')
      .then((exs: Map<string, OrderBook>) => {
        console.log(exs);
      });
  }
}
