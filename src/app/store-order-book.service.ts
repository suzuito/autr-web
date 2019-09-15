import { Injectable } from '@angular/core';
import { StoreOrderBook } from './store';
import { OrderBook } from './model';
import { EventEmitter } from 'events';

export enum StoreOrderBookServiceEvent {
  Set = 'set',
}

@Injectable({
  providedIn: 'root'
})
export class StoreOrderBookService extends StoreOrderBook {

  public event: EventEmitter;

  constructor() {
    super();
    this.event = new EventEmitter();
  }

  public set(...orderBooks: Array<OrderBook>): void {
    super.set(...orderBooks);
    this.event.emit(StoreOrderBookServiceEvent.Set, ...orderBooks);
  }

}
