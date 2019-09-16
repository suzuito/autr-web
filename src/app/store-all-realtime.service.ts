import { Injectable } from '@angular/core';
import { StoreOrderBook, StoreProduct } from './store';
import { LadderEach, Product, OrderBook } from './model';
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
    const now = (Date.now() / 1000) - 540;
    this.storeOrderBook.deleteUntil(now);
    this.storeProduct.deleteUntil(now);
  }

}
