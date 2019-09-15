import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

import { StoreOrderBookService, StoreOrderBookServiceEvent } from '../store-order-book.service';
import { OrderBook } from '../model';
import { Chart } from '../d3/chart';
import { StoreChart1secService } from '../store-chart1sec.service';
import { StoreAllService, StoreAllServiceEvent } from '../store-all.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  private chart: Chart;

  constructor(
    private orderBook: StoreOrderBookService,
    private chart1sec: StoreChart1secService,
    private all: StoreAllService,
  ) {
    this.chart = new Chart('#main', orderBook, chart1sec);
    this.all.event.addListener(
      StoreAllServiceEvent.Set,
      () => {
        this.chart.redisplay();
      }
    );
  }

  ngOnInit() {
  }

}
