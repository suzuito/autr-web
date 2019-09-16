import { Injectable } from '@angular/core';

import * as Pusher from 'pusher-js';
import { LadderEach, Product, newLadder } from './model';

@Injectable({
  providedIn: 'root'
})
export class LiquidService {

  private p: Pusher.Pusher;
  public sell: Array<LadderEach>;
  public buy: Array<LadderEach>;
  public price: number;

  constructor() {
  }

  public connect(): void {
    this.p = new Pusher(
      'LIQUID',
      {
        wsHost: 'tap.liquid.com',
      },
    );
    this.p.subscribe('price_ladders_cash_btcjpy_sell')
      .bind('updated', (data: any, _: any) => {
        this.sell = newLadder(data);
      });
    this.p.subscribe('price_ladders_cash_btcjpy_buy')
      .bind('updated', (data: any, _: any) => {
        this.buy = newLadder(data);
      });
    this.p.subscribe('product_cash_btcjpy_5')
      .bind('updated', (data: any, _: any) => {
        this.price = parseInt(data.last_traded_price, 10);
      });
  }


}
