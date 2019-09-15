
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import * as d3Axis from 'd3-axis';
import * as d3Time from 'd3-time';
import { StoreOrderBookService } from '../store-order-book.service';
import { OrderBook, LadderEach, ChartEach } from '../model';
import { StoreChart1secService } from '../store-chart1sec.service';

export class Chart {

  private widthSvg: number;
  private heightSvg: number;
  private paddingLeft: number;
  private paddingRight: number;
  private paddingBottom: number;
  private paddingTop: number;

  constructor(
    private selector: string,
    private orderBooks: StoreOrderBookService,
    private chart1sec: StoreChart1secService,
  ) {
    this.selector = selector;
    this.widthSvg = 1000;
    this.heightSvg = 1000;
    this.paddingLeft = 100;
    this.paddingBottom = 100;
    this.paddingRight = 100;
    this.paddingTop = 100;
  }

  public redisplay(): void {
    if (this.orderBooks.length() <= 0) {
      return;
    }
    if (this.chart1sec.length() <= 0) {
      return;
    }
    const widthGraph = this.widthSvg - this.paddingLeft - this.paddingRight;
    const heightGraph = this.heightSvg - this.paddingTop - this.paddingBottom;
    const sMain = d3.select(this.selector);
    sMain
      .style('width', this.widthSvg)
      .style('height', this.heightSvg)
      .style('border', '1px solid black')
      ;
    // Scale
    const scaleTime = d3Scale.scaleTime()
      .domain([
        new Date(
          d3Array.min([
            this.orderBooks.minCreatedAt().createdAt,
            this.chart1sec.minCreatedAt().createdAt,
          ]) * 1000,
        ),
        new Date(
          d3Array.max([
            this.orderBooks.maxCreatedAt().createdAt,
            this.chart1sec.maxCreatedAt().createdAt,
          ]) * 1000,
        ),
      ])
      .range([
        0,
        widthGraph,
      ])
      ;
    const scalePrice = d3Scale.scaleLinear()
      .domain([
        this.orderBooks.minBuyPrice().price,
        this.orderBooks.maxSellPrice().price,
      ])
      .range([
        heightGraph,
        0,
      ])
      ;
    const scaleQuantity = d3Scale.scaleLinear()
      .domain([
        0,
        3,
      ])
      .range([
        0,
        1,
      ])
      ;
    // axis
    const axisY = d3Axis.axisLeft(scalePrice);
    const sAxisY = sMain.append('g')
      .attr(
        'transform',
        `translate(${this.paddingLeft}, ${this.paddingTop})`
      )
      .call(axisY)
      ;
    const axisX = d3Axis.axisBottom(scaleTime);
    axisX.ticks(d3Time.timeMinute.every(1));
    const sAxisX = sMain.append('g')
      .attr(
        'transform',
        `translate(${this.paddingLeft}, ${this.heightSvg - this.paddingBottom})`
      )
      .call(axisX)
      ;
    // Ladder
    const sLadder = sMain.append('g')
      .attr(
        'transform',
        `translate(${this.paddingLeft}, ${this.paddingTop})`
      )
      ;
    const createdAts = this.orderBooks.keys();
    for (const createdAt of createdAts) {
      this.drawLadder(
        sLadder,
        createdAt,
        'sell',
        scaleTime,
        scalePrice,
        scaleQuantity,
        this.orderBooks.get(createdAt).sell,
      );
      this.drawLadder(
        sLadder,
        createdAt,
        'buy',
        scaleTime,
        scalePrice,
        scaleQuantity,
        this.orderBooks.get(createdAt).buy,
      );
    }
    // Chart
    const sChart = sMain.append('g')
      .attr(
        'transform',
        `translate(${this.paddingLeft}, ${this.paddingTop})`
      )
      ;
    this.drawChart(
      sChart,
      scaleTime,
      scalePrice,
    );
  }

  private drawLadder(
    sParent: any,
    createdAt: number,
    sellOrBuy: string,
    xScale: d3Scale.ScaleTime<number, number>,
    yScale: d3Scale.ScaleLinear<number, number>,
    zScale: d3Scale.ScaleLinear<number, number>,
    ladder: Array<LadderEach>,
  ): void {
    const sLadder = sParent.selectAll(`.ladder-${createdAt}-${sellOrBuy}`).data(ladder);
    const sLadderEnter = sLadder.enter().append('circle');
    const sLadderExit = sLadder.exit();
    sLadderExit.remove();
    this.drawLadderEach(createdAt, sellOrBuy, xScale, yScale, zScale, sLadder);
    this.drawLadderEach(createdAt, sellOrBuy, xScale, yScale, zScale, sLadderEnter);
  }

  private drawLadderEach(
    createdAt: number,
    sellOrBuy: string,
    xScale: d3Scale.ScaleTime<number, number>,
    yScale: d3Scale.ScaleLinear<number, number>,
    zScale: d3Scale.ScaleLinear<number, number>,
    s: any,
  ): void {
    s
      .attr('class', `.ladder-${createdAt}-${sellOrBuy}`)
      .attr('cx', (d: LadderEach) => {
        return xScale(new Date(createdAt * 1000));
      })
      .attr('cy', (d: LadderEach) => {
        return yScale(d.price);
      })
      .attr('r', '1')
      .attr('stroke-width', '0')
      .attr('stroke', 'none')
      .attr('fill', (d: LadderEach) => {
        if (sellOrBuy === 'buy') {
          return d3ScaleChromatic.interpolateReds(zScale(d.quantity));
        }
        return d3ScaleChromatic.interpolateBlues(zScale(d.quantity));
      })
      ;
  }

  private drawChart(
    sParent: any,
    xScale: d3Scale.ScaleTime<number, number>,
    yScale: d3Scale.ScaleLinear<number, number>,
  ): void {
    const createdAts: Array<number> = this.chart1sec.keys();
    const sChart = sParent.selectAll(`.chart`).data(createdAts);
    const sChartEnter = sChart.enter().append('polyline');
    const sChartExit = sChart.exit();
    sChartExit.remove();
    this.drawChartEach(xScale, yScale, sChart);
    this.drawChartEach(xScale, yScale, sChartEnter);
  }

  private drawChartEach(
    xScale: d3Scale.ScaleTime<number, number>,
    yScale: d3Scale.ScaleLinear<number, number>,
    s: any,
  ): void {
    s
      .attr('class', `.chart`)
      .attr('points', (createdAt: number) => {
        const d: ChartEach = this.chart1sec.get(createdAt);
        const yMax: number = yScale(d.priceMax);
        const yMin: number = yScale(d.priceMin);
        const x: number = xScale(new Date(d.createdAt * 1000));
        const points: Array<string> = new Array<string>();
        const w = 3;
        return `${x} ${yMin} ${x + w} ${yMin} ${x + w} ${yMax} ${x} ${yMax} ${x} ${yMin}`;
      })
      .attr('stroke', 'black')
      .attr('fill', 'none')
      ;
  }
}
