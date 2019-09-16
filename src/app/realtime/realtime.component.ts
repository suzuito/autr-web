import { Component, OnInit } from '@angular/core';
import { LiquidService } from '../liquid.service';
import { StoreAllRealtimeService } from '../store-all-realtime.service';
import { Chart, redisplayOrderBooks, redisplayPriceLine } from '../d3/chart';
import { timezone } from 'strftime';

import * as d3Array from 'd3-array';
import { normalizeLadderEach } from '../model';
import { AppService } from '../app.service';
import { ApiService } from '../api.service';

const strftime = timezone('+0900');
const fmtYYYYMMDDHHMM = '%Y%m%d%H%M';

@Component({
  selector: 'app-realtime',
  templateUrl: './realtime.component.html',
  styleUrls: ['./realtime.component.scss']
})
export class RealtimeComponent implements OnInit {

  private chart: Chart;

  constructor(
    private liquid: LiquidService,
    private all: StoreAllRealtimeService,
    private app: AppService,
  ) {
    this.chart = new Chart(
      '#main',
      1000,
      1000,
    );
  }

  ngOnInit() {
    this.liquid.connect();
    setInterval(
      async () => {
        this.all.cleanup();
        const dnow = new Date();
        const now = Math.floor(dnow.getTime() / 1000);
        if (dnow.getSeconds() % 59 === 0) {
          const orderBooks = await this.app.fetchOrderBooks(
            strftime(fmtYYYYMMDDHHMM, dnow),
          );
          for (const o of orderBooks) {
            this.all.set(
              o,
              null,
            );
          }
        }
        this.all.set(
          {
            createdAt: now,
            sell: normalizeLadderEach(this.liquid.sell),
            buy: normalizeLadderEach(this.liquid.buy),
          },
          {
            createdAt: now,
            price: this.liquid.price,
          },
        );
        this.chart.scaleTime
          .domain([
            new Date((now - 600) * 1000),
            new Date(now * 1000),
          ])
          ;
        this.chart.scalePrice
          .domain([
            this.all.storeOrderBook.minBuyPrice().price,
            this.all.storeOrderBook.maxSellPrice().price,
          ])
          ;
        this.chart.scaleQuantity
          .domain([
            0,
            3,
          ])
          ;
        this.chart.redisplay();
        redisplayOrderBooks(
          this.chart.g('order-book'),
          this.chart.scaleTime,
          this.chart.scalePrice,
          this.chart.scaleQuantity,
          this.all.storeOrderBook,
          (_) => 3,
        );
        redisplayPriceLine(
          this.chart.g('price-line'),
          this.chart.scaleTime,
          this.chart.scalePrice,
          this.all.storeProduct,
        );
      },
      1000,
    );
  }

}
