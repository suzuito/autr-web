import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { StoreOrderBookService } from './store-order-book.service';
import {
  ChartEach,
  Execution,
  OrderBook,
  normalizeLadderEach,
} from './model';
import { StoreChart1secService } from './store-chart1sec.service';
import { StoreAllService } from './store-all.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
    private api: ApiService,
    public all: StoreAllService,
  ) {
    this.fetchAll(
      [
        '2019091510',
        '2019091511',
      ],
      [
        '201909151100',
        '201909151101',
      ],
    );
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
        ob.buy = normalizeLadderEach(ob.buy);
        ob.sell = normalizeLadderEach(ob.sell);
        tmp.push(ob);
      }
    }
    return Promise.resolve(tmp);
  }

  public async fetchChart1sec(...datehours: Array<string>): Promise<Array<ChartEach>> {
    const tmp: Array<ChartEach> = [];
    for (const datehour of datehours) {
      let charts: any = [];
      try {
        charts = await this.api.getChart1sec(datehour);
      } catch (err) {
        console.error(err);
      }
      for (const createdAt of Object.keys(charts)) {
        tmp.push(charts[createdAt]);
      }
    }
    return Promise.resolve(tmp);
  }

  public async fetchAll(
    datehoursChart1sec: Array<string>,
    datehourminutesOrderBook: Array<string>,
  ): Promise<void> {
    const charts: Array<ChartEach> = await this.fetchChart1sec(...datehoursChart1sec);
    const obs: Array<OrderBook> = await this.fetchOrderBooks(...datehourminutesOrderBook);
    return this.all.set(
      charts,
      obs,
    );
  }
}
