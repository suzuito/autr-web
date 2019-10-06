import { Injectable } from '@angular/core';
import { ChartEach, OrderBook } from './model';
import { EventEmitter } from 'events';
import { StoreChart } from './store';

export enum StoreAllServiceEvent {
  Set = 'set',
}

@Injectable({
  providedIn: 'root'
})
export class StoreAllService {

  public event: EventEmitter;
  public chart01sec: StoreChart;
  public chart60sec: StoreChart;

  constructor(
  ) {
    this.event = new EventEmitter();
    this.chart01sec = new StoreChart();
    this.chart60sec = new StoreChart();
  }

  public set(
    c1secs01: Array<ChartEach>,
    c1secs60: Array<ChartEach>,
  ): void {
    this.chart01sec.set(...c1secs01);
    this.chart60sec.set(...c1secs60);
    this.event.emit(StoreAllServiceEvent.Set);
  }
}
