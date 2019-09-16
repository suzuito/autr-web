
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import * as d3Axis from 'd3-axis';
import * as d3Time from 'd3-time';
import * as d3Shape from 'd3-shape';
import { OrderBook, LadderEach, ChartEach, Product } from '../model';
import { StoreOrderBook, StoreChart, StoreProduct } from '../store';
import { StoreChart1secService } from '../store-chart1sec.service';

export class Chart {

  private paddingLeft: number;
  private paddingRight: number;
  private paddingBottom: number;
  private paddingTop: number;
  public scaleTime: d3Scale.ScaleTime<number, number>;
  public scalePrice: d3Scale.ScaleLinear<number, number>;
  public scaleQuantity: d3Scale.ScaleLinear<number, number>;

  constructor(
    private selector: string,
    private widthSvg: number,
    private heightSvg: number,
  ) {
    this.selector = selector;
    this.paddingLeft = 100;
    this.paddingBottom = 100;
    this.paddingRight = 100;
    this.paddingTop = 100;
    this.scaleTime = d3Scale.scaleTime();
    this.scalePrice = d3Scale.scaleLinear();
    this.scaleQuantity = d3Scale.scaleLinear();
  }

  public redisplay(): void {
    const widthGraph = this.widthSvg - this.paddingLeft - this.paddingRight;
    const heightGraph = this.heightSvg - this.paddingTop - this.paddingBottom;
    const sMain = d3.select(this.selector);
    sMain
      .style('width', this.widthSvg)
      .style('height', this.heightSvg)
      .style('border', '1px solid black')
      ;
    // Scale
    this.scaleTime
      .range([
        0,
        widthGraph,
      ])
      ;
    this.scalePrice
      .range([
        heightGraph,
        0,
      ])
      ;
    this.scaleQuantity
      .range([
        0,
        1,
      ])
      ;
    // axis
    const axisY = d3Axis.axisLeft(this.scalePrice);
    this.g('axis-y')
      .attr(
        'transform',
        `translate(${this.paddingLeft}, ${this.paddingTop})`
      )
      .call(axisY)
      ;
    const axisX = d3Axis.axisBottom(this.scaleTime);
    axisX.ticks(d3Time.timeMinute.every(1));
    this.g('axis-x')
      .attr(
        'transform',
        `translate(${this.paddingLeft}, ${this.heightSvg - this.paddingBottom})`
      )
      .call(axisX)
      ;
  }

  public g(id: string): any {
    const sMain = d3.select(this.selector);
    let s = sMain.select(`#${id}`);
    if (s.empty()) {
      s = sMain.append('g').attr('id', id);
    }
    s
      .attr(
        'transform',
        `translate(${this.paddingLeft}, ${this.paddingTop})`
      )
      ;
    return s;
  }
}

export function redisplayChart(
  sParent: any,
  xScale: d3Scale.ScaleTime<number, number>,
  yScale: d3Scale.ScaleLinear<number, number>,
  chart1sec: StoreChart,
): void {
  const createdAts: Array<number> = chart1sec.keys();
  const sChart = sParent.selectAll(`.chart`).data(createdAts);
  const sChartEnter = sChart.enter().append('polyline');
  const sChartExit = sChart.exit();
  sChartExit.remove();
  redisplayChartEach(xScale, yScale, sChart, chart1sec);
  redisplayChartEach(xScale, yScale, sChartEnter, chart1sec);
}

function redisplayChartEach(
  xScale: d3Scale.ScaleTime<number, number>,
  yScale: d3Scale.ScaleLinear<number, number>,
  s: any,
  chart1sec: StoreChart,
): void {
  s
    .attr('class', `chart`)
    .attr('points', (createdAt: number) => {
      const d: ChartEach = chart1sec.get(createdAt);
      const yMax: number = yScale(d.priceMax);
      const yMin: number = yScale(d.priceMin);
      const x: number = xScale(new Date(d.createdAt * 1000));
      const w = 3;
      return `${x} ${yMin} ${x + w} ${yMin} ${x + w} ${yMax} ${x} ${yMax} ${x} ${yMin}`;
    })
    .attr('stroke', 'black')
    .attr('fill', 'none')
    ;
}

export function redisplayOrderBooks(
  sLadder: any,
  xScale: d3Scale.ScaleTime<number, number>,
  yScale: d3Scale.ScaleLinear<number, number>,
  zScale: d3Scale.ScaleLinear<number, number>,
  orderBooks: StoreOrderBook,
  r: (d: LadderEach) => void = (_) => 1,
): void {
  const createdAts = orderBooks.keys();
  for (const createdAt of createdAts) {
    redisplayLadder(
      sLadder,
      createdAt,
      'sell',
      xScale,
      yScale,
      zScale,
      orderBooks.get(createdAt).sell,
      r,
    );
    redisplayLadder(
      sLadder,
      createdAt,
      'buy',
      xScale,
      yScale,
      zScale,
      orderBooks.get(createdAt).buy,
      r,
    );
  }
}


function redisplayLadder(
  sParent: any,
  createdAt: number,
  sellOrBuy: string,
  xScale: d3Scale.ScaleTime<number, number>,
  yScale: d3Scale.ScaleLinear<number, number>,
  zScale: d3Scale.ScaleLinear<number, number>,
  ladder: Array<LadderEach>,
  r: (d: LadderEach) => void,
): void {
  const sLadder = sParent.selectAll(`.ladder-${createdAt}-${sellOrBuy}`).data(ladder);
  const sLadderEnter = sLadder.enter().append('circle');
  const sLadderExit = sLadder.exit();
  sLadderExit.remove();
  redisplayLadderEach(createdAt, sellOrBuy, xScale, yScale, zScale, sLadder, r);
  redisplayLadderEach(createdAt, sellOrBuy, xScale, yScale, zScale, sLadderEnter, r);
}

function redisplayLadderEach(
  createdAt: number,
  sellOrBuy: string,
  xScale: d3Scale.ScaleTime<number, number>,
  yScale: d3Scale.ScaleLinear<number, number>,
  zScale: d3Scale.ScaleLinear<number, number>,
  s: any,
  r: (d: LadderEach) => void,
): void {
  s
    .attr('class', `ladder-${createdAt}-${sellOrBuy} ladder`)
    .attr('cx', (d: LadderEach) => {
      return xScale(new Date(createdAt * 1000));
    })
    .attr('cy', (d: LadderEach) => {
      return yScale(d.price);
    })
    .attr('r', r)
    .attr('stroke-width', '0')
    .attr('stroke', 'none')
    .attr('fill', (d: LadderEach) => {
      if (sellOrBuy === 'buy') {
        return d3ScaleChromatic.interpolateReds(zScale(d.quantity));
      }
      return d3ScaleChromatic.interpolateBlues(zScale(d.quantity));
    })
    .on('click', (d: LadderEach) => {
      console.log(d);
    })
    ;
}


export function redisplayPriceLine(
  sParent: any,
  xScale: d3Scale.ScaleTime<number, number>,
  yScale: d3Scale.ScaleLinear<number, number>,
  store: StoreProduct,
): void {
  const line = d3Shape.line()
    .x((createdAt: any, i) => {
      return xScale(new Date(createdAt * 1000));
    })
    .y((createdAt: any) => {
      return yScale(store.get(createdAt).price);
    })
    ;
  let s = sParent.select('.priceline');
  if (s.empty()) {
    s = sParent.append('path')
      .attr('class', 'priceline');
  }
  s
    .datum(store.keys())
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('stroke-width', '1px')
    .attr('d', line)
    ;
}
