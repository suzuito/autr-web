import { Injectable } from '@angular/core';
import { StoreOrderBook, StoreProduct } from './store';
import { LadderEach, Product, OrderBook, maxPriceLadderEach, minPriceLadderEach } from './model';
import { EventEmitter } from 'events';
import { StoreAllServiceEvent } from './store-all.service';


export enum StoreAllRealtimeServiceEvent {
  Set = 'set',
}

@Injectable({
  providedIn: 'root'
})
export class StoreAllRealtimeService {

  public storeOrderBook: StoreOrderBook;
  public storeProduct: StoreProduct;
  public event: EventEmitter;

  constructor() {
    this.storeOrderBook = new StoreOrderBook();
    this.storeProduct = new StoreProduct();
    this.event = new EventEmitter();
  }

  public set(
    orderBook: OrderBook,
    product: Product,
  ): void {
    if (orderBook !== null) {
      this.storeOrderBook.set(orderBook);
    }
    if (product !== null) {
      this.storeProduct.set(product);
    }
    this.event.emit(StoreAllServiceEvent.Set);
  }

  public cleanup(): void {
    const now = (Date.now() / 1000) - 180;
    this.storeOrderBook.deleteUntil(now);
    this.storeProduct.deleteUntil(now);
  }

  public areaOrderBook(
    buyArea: Array<Array<Area>>,
    sellArea: Array<Array<Area>>,
  ): void {
    const step = 100;
    for (let i = 0; i < 20; i++) {
      const b = [];
      const s = [];
      for (const createdAt of this.storeOrderBook.keys()) {
        const orderBook = this.storeOrderBook.get(createdAt);
        const bStart = maxPriceLadderEach(orderBook.buy).price;
        const sStart = minPriceLadderEach(orderBook.sell).price;
        const y0Buy = bStart + (-step * i);
        const y1Buy = bStart + (-step * (i + 1));
        const y0Sell = sStart + (step * i);
        const y1Sell = sStart + (step * (i + 1));
        const buys = orderBook.buy.filter((v: LadderEach) => {
          return v.price > y1Buy && v.price < y0Buy;
        });
        const sells = orderBook.buy.filter((v: LadderEach) => {
          return v.price > y0Sell && v.price < y1Sell;
        });
        let buyQuantity = 0;
        let sellQuantity = 0;
        if (buys.length > 0) {
          buyQuantity = buys.map(v => v.quantity).reduce((p, c) => p + c);
        }
        if (sells.length > 0) {
          sellQuantity = sells.map(v => v.quantity).reduce((p, c) => p + c);
        }
        b.push({
          y0: y0Buy,
          y1: y1Buy,
          createdAt,
          data: {
            quantity: buyQuantity,
          },
        });
        s.push({
          y0: y0Sell,
          y1: y1Sell,
          createdAt,
          data: {
            quantity: sellQuantity,
          },
        });
      }
      buyArea.push(b);
      sellArea.push(s);
    }
  }

}

export interface Area {
  y0: number;
  y1: number;
  data: any;
  createdAt: number;
}

export interface GroupedLadder {
  createdAt: number;
  minPrice: number;
  maxPrice: number;
  quantity: number;
}

export function groupLadder(
  createdAt: number,
  lads: Array<LadderEach>,
  startPrice: number,
  step: number,
): Array<GroupedLadder> {
  const ret: Map<number, GroupedLadder> = new Map<number, GroupedLadder>();
  for (const lad of lads) {
    const diffPrice = Math.abs(lad.price - startPrice);
    const i = Math.floor(Math.abs(diffPrice / step));
    if (!ret.has(i)) {
      if (step > 0) {
        ret.set(i, {
          minPrice: startPrice + step * i,
          maxPrice: startPrice + step * (i + 1),
          quantity: 0,
          createdAt,
        });
      } else {
        ret.set(i, {
          maxPrice: startPrice + step * i,
          minPrice: startPrice + step * (i + 1),
          quantity: 0,
          createdAt,
        });
      }
      const d = ret.get(i);
      d.quantity += lad.quantity;
    }
  }
  const r: Array<GroupedLadder> = [];
  for (const a of ret.keys()) {
    r.push(ret.get(a));
  }
  return r;
}
