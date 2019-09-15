import { Injectable } from '@angular/core';
import { StoreChart1secService } from './store-chart1sec.service';
import { StoreOrderBookService } from './store-order-book.service';
import { ChartEach, OrderBook } from './model';
import { EventEmitter } from 'events';

export enum StoreAllServiceEvent {
  Set = 'set',
}

@Injectable({
  providedIn: 'root'
})
export class StoreAllService {

  public event: EventEmitter;

  constructor(
    private chart1sec: StoreChart1secService,
    private orderBooks: StoreOrderBookService,
  ) {
    this.event = new EventEmitter();
  }

  public set(
    c1secs: Array<ChartEach>,
    obs: Array<OrderBook>,
  ): void {
    this.chart1sec.set(...c1secs);
    this.orderBooks.set(...obs);
    this.event.emit(StoreAllServiceEvent.Set);
  }
}
