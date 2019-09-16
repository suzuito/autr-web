import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

import { StoreOrderBookService, StoreOrderBookServiceEvent } from '../store-order-book.service';
import { OrderBook, LadderEach } from '../model';
import { Chart, redisplayChart, redisplayOrderBooks } from '../d3/chart';
import { StoreChart1secService } from '../store-chart1sec.service';
import { StoreAllService, StoreAllServiceEvent } from '../store-all.service';

import * as d3Array from 'd3-array';

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
    this.chart = new Chart(
      '#main',
      5000,
      5000,
    );
    this.all.event.addListener(
      StoreAllServiceEvent.Set,
      () => {
        this.chart.scaleTime
          .domain([
            new Date(
              d3Array.min([
                this.orderBook.minCreatedAt().createdAt,
                this.chart1sec.minCreatedAt().createdAt,
              ]) * 1000,
            ),
            new Date(
              d3Array.max([
                this.orderBook.maxCreatedAt().createdAt,
                this.chart1sec.maxCreatedAt().createdAt,
              ]) * 1000,
            ),
          ])
          ;
        this.chart.scalePrice
          .domain([
            this.orderBook.minBuyPrice().price,
            this.orderBook.maxSellPrice().price,
          ])
          ;
        this.chart.scaleQuantity
          .domain([
            0,
            3,
          ])
          ;
        this.chart.redisplay();
        redisplayChart(
          this.chart.g('chart1sec'),
          this.chart.scaleTime,
          this.chart.scalePrice,
          this.chart1sec,
        );
        redisplayOrderBooks(
          this.chart.g('order-book'),
          this.chart.scaleTime,
          this.chart.scalePrice,
          this.chart.scaleQuantity,
          this.orderBook,
          (d: LadderEach) => {
            if (d.quantity > 3) {
              return 3;
            }
            return 0;
          },
        );
      }
    );
  }

  ngOnInit() {
  }

}
