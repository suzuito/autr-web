import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {
  ChartEach,
  Execution,
  OrderBook,
  normalizeLadderEach,
} from './model';
import { StoreAllService } from './store-all.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  public averageQuantity: number;

  constructor(
    private api: ApiService,
    public all: StoreAllService,
  ) {
    this.averageQuantity = 0;
  }

  public async fetchOrderBooks(...datehourminutes: Array<string>): Promise<Array<OrderBook>> {
    const tmp: Array<OrderBook> = [];
    for (const datehourminute of datehourminutes) {
      let obs: any = [];
      try {
        obs = await this.api.getOrderBooks(datehourminute);
      } catch (err) {
        console.error(err);
      }
      for (const createdAt of Object.keys(obs)) {
        const ob = obs[createdAt];
        ob.buy = normalizeLadderEach(ob.buy, false);
        ob.sell = normalizeLadderEach(ob.sell, true);
        tmp.push(ob);
      }
    }
    return Promise.resolve(tmp);
  }

  public async fetchChart(duration: string, ...datehours: Array<string>): Promise<Array<ChartEach>> {
    const tmp: Array<ChartEach> = [];
    let sumQuantity = 0;
    let i = 0;
    for (const datehour of datehours) {
      let charts: any = [];
      try {
        charts = await this.api.getChart(datehour, duration);
      } catch (err) {
        console.error(err);
      }
      for (const createdAt of Object.keys(charts)) {
        if (charts[createdAt].price <= 0) {
          continue;
        }
        tmp.push(charts[createdAt]);
        sumQuantity += charts[createdAt].buyQuantity;
        i++;
      }
    }
    this.averageQuantity = sumQuantity / i;
    return Promise.resolve(tmp);
  }

  public async fetchAll(
    datehoursChart: Array<string>,
    datehourminutesOrderBook: Array<string>,
  ): Promise<void> {
    const charts01: Array<ChartEach> = await this.fetchChart('01', ...datehoursChart);
    const charts60: Array<ChartEach> = await this.fetchChart('60', ...datehoursChart);
    return this.all.set(
      charts01,
      charts60,
    );
  }
}
