import { Component, OnInit } from '@angular/core';
import { LiquidService } from '../liquid.service';
import { StoreAllRealtimeService, groupLadder } from '../store-all-realtime.service';
import { Chart, redisplayOrderBooks, redisplayPriceLine, redisplayGroupedLadders } from '../d3/chart';

import { normalizeLadderEach, maxPriceLadderEach, minPriceLadderEach } from '../model';
import { AppService } from '../app.service';
import { RealtimeSettingService } from './realtime-setting.service';


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
    public setting: RealtimeSettingService,
  ) {
    this.chart = new Chart(
      '#main',
      2000,
      5000,
    );
  }

  ngOnInit() {
    this.setting.group = true;
    this.setting.point = false;
    this.liquid.connect();
    setInterval(
      async () => {
        this.all.cleanup();
        const dnow = new Date();
        const now = Math.floor(dnow.getTime() / 1000);
        this.all.set(
          {
            createdAt: now,
            sell: normalizeLadderEach(this.liquid.sell, true),
            buy: normalizeLadderEach(this.liquid.buy, false),
          },
          {
            createdAt: now,
            price: this.liquid.price,
          },
        );
        this.chart.scaleTime
          .domain([
            new Date((now - 180) * 1000),
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
          .domain([0, 3])
          ;
        this.chart.redisplay();
        if (this.setting.point) {
          redisplayOrderBooks(
            this.chart.g('order-book'),
            this.chart.scaleTime,
            this.chart.scalePrice,
            this.chart.scaleQuantity,
            this.all.storeOrderBook,
            (_) => 3,
          );
        }
        if (this.setting.group) {
          const sGroupedLadders = this.chart.g('grouped-ladders');
          sGroupedLadders.selectAll('*').remove();
          for (const createdAt of this.all.storeOrderBook.keys()) {
            const orderBook = this.all.storeOrderBook.get(createdAt);
            const groupedBuy = groupLadder(
              createdAt,
              orderBook.buy,
              maxPriceLadderEach(orderBook.buy).price,
              -100,
            );
            const groupedSell = groupLadder(
              createdAt,
              orderBook.sell,
              minPriceLadderEach(orderBook.sell).price,
              100,
            );
            redisplayGroupedLadders(
              sGroupedLadders,
              this.chart.scaleTime,
              this.chart.scalePrice,
              this.chart.scaleQuantity,
              createdAt,
              groupedBuy,
              'buy',
            );
            redisplayGroupedLadders(
              sGroupedLadders,
              this.chart.scaleTime,
              this.chart.scalePrice,
              this.chart.scaleQuantity,
              createdAt,
              groupedSell,
              'sell',
            );
          }
        }
        redisplayPriceLine(
          this.chart.g('price-line'),
          this.chart.scaleTime,
          this.chart.scalePrice,
          this.all.storeProduct,
          (createdAt: number) => this.all.storeProduct.get(createdAt).price,
        );
      },
      1000,
    );
  }

}
