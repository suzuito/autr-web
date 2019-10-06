import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

import { StoreOrderBookService, StoreOrderBookServiceEvent } from '../store-order-book.service';
import { OrderBook, LadderEach, newChartEachSections, ChartEachSection, averagePriceDiff, resultExecutedEntries } from '../model';
import {
  Chart, redisplayChart, redisplayOrderBooks,
  redisplayPriceLine, redisplaySection, redisplayExecutedEntry,
  redisplayPair
} from '../d3/chart';
import { StoreAllService, StoreAllServiceEvent } from '../store-all.service';

import * as d3Array from 'd3-array';
import { StoreChart } from '../store';
import { Simulator, Simulator002 } from '../simulator';
import { SimulatorService } from '../simulator.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  private chart: Chart;

  constructor(
    private orderBook: StoreOrderBookService,
    private all: StoreAllService,
    private simService: SimulatorService,
  ) {
    this.chart = new Chart(
      '#main',
      10000,
      1500,
    );
    this.all.event.addListener(
      StoreAllServiceEvent.Set,
      () => {
        this.chart.scaleTime
          .domain([
            new Date(this.all.chart01sec.minCreatedAt().createdAt * 1000),
            new Date(this.all.chart01sec.maxCreatedAt().createdAt * 1000),
          ])
          ;
        this.chart.scalePrice
          .domain([
            this.all.chart01sec.minPrice().price,
            this.all.chart01sec.maxPrice().price,
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
          this.chart.g('chart01sec'),
          this.chart.scaleTime,
          this.chart.scalePrice,
          this.all.chart01sec,
        );

        // redisplayPriceLine(
        //   this.chart.g('price-line-01'),
        //   this.chart.scaleTime,
        //   this.chart.scalePrice,
        //   this.all.chart01sec,
        //   (createdAt: number) => this.all.chart01sec.get(createdAt).price,
        // );
        // redisplayPriceLine(
        //   this.chart.g('average-moving-line-sec01-10'),
        //   this.chart.scaleTime,
        //   this.chart.scalePrice,
        //   this.all.chart01sec,
        //   generateFunction(this.all.chart01sec, '10'),
        // );
        redisplayPriceLine(
          this.chart.g('average-moving-line-sec01-60'),
          this.chart.scaleTime,
          this.chart.scalePrice,
          this.all.chart01sec,
          generateFunction(this.all.chart01sec, '60'),
        );

        // redisplayPriceLine(
        //   this.chart.g('price-line-60'),
        //   this.chart.scaleTime,
        //   this.chart.scalePrice,
        //   this.all.chart60sec,
        //   (createdAt: number) => this.all.chart60sec.get(createdAt).price,
        // );
        redisplayPriceLine(
          this.chart.g('average-moving-line-sec60-10'),
          this.chart.scaleTime,
          this.chart.scalePrice,
          this.all.chart60sec,
          generateFunction(this.all.chart60sec, '10'),
        );

        const secs: Array<ChartEachSection> = newChartEachSections(
          this.all.chart01sec.filter(() => true),
          300,
        );
        redisplaySection(
          this.chart.g('sections-60'),
          this.chart.scaleTime,
          this.chart.scalePrice,
          secs,
        );
        console.log(averagePriceDiff(secs));
        this.simService.setSimulator(
          // new Simulator001(this.all.chart01sec, 100000),
          new Simulator002(this.all.chart01sec, 100000),
        );
        simService.clear();
        this.simService.start(
          this.all.chart01sec.minCreatedAt().createdAt,
          this.all.chart01sec.maxCreatedAt().createdAt,
        );
        redisplayPair(
          this.chart.g('entries'),
          this.chart.scaleTime,
          this.chart.scalePrice,
          this.simService.getEEPairs(),
        );
        resultExecutedEntries(this.simService.getExecutedEntries());
        console.log(this.simService.getEEPairs());
      }
    );
  }

  ngOnInit() {
  }

}

function generateFunction(store: StoreChart, a: string): (createdAt: number) => number {
  return (createdAt: number): number => {
    const d = store.get(createdAt).movingAverageLines[a];
    if (!d) {
      return 0;
    }
    return d;
  };
}
