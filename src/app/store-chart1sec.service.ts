import { Injectable } from '@angular/core';
import { StoreOrderBook, StoreChart } from './store';
import { EventEmitter } from 'events';
import { ChartEach } from './model';


export enum StoreChartServiceEvent {
  Set = 'set',
}

@Injectable({
  providedIn: 'root'
})
export class StoreChartService extends StoreChart {

  public event: EventEmitter;

  constructor() {
    super();
    this.event = new EventEmitter();
  }

  public set(...chartEachs: Array<ChartEach>): void {
    super.set(...chartEachs);
    this.event.emit(StoreChartServiceEvent.Set, ...chartEachs);
  }
}
