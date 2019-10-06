
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import * as d3Axis from 'd3-axis';
import * as d3Time from 'd3-time';
import * as d3Shape from 'd3-shape';
import { OrderBook, LadderEach, ChartEach, Product, ChartEachSection, Entry, ExecutedEntry, SideBuy } from '../model';
import { StoreOrderBook, StoreChart, StoreProduct } from '../store';
import { Area, GroupedLadder } from '../store-all-realtime.service';
import { Pair } from '../simulator';

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
    const axisY = d3Axis.axisRight(this.scalePrice);
    this.g('axis-y')
      .attr(
        'transform',
        `translate(${this.widthSvg - this.paddingRight}, ${this.paddingTop})`
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
  chart: StoreChart,
): void {
  const createdAts: Array<number> = chart.keys();
  const sChart = sParent.selectAll(`.chart`).data(createdAts);
  const sChartEnter = sChart.enter().append('polyline');
  const sChartExit = sChart.exit();
  sChartExit.remove();
  redisplayChartEach(xScale, yScale, sChart, chart);
  redisplayChartEach(xScale, yScale, sChartEnter, chart);
}

function redisplayChartEach(
  xScale: d3Scale.ScaleTime<number, number>,
  yScale: d3Scale.ScaleLinear<number, number>,
  s: any,
  chart: StoreChart,
): void {
  s
    .attr('class', `chart`)
    .attr('points', (createdAt: number) => {
      const d: ChartEach = chart.get(createdAt);
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
  sLadder.selectAll('.ladder').remove();
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
  const sLadder = sParent.selectAll(`.ladder-${sellOrBuy}-${createdAt}`).data(ladder);
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
    .attr('class', `ladder-${sellOrBuy}-${createdAt} ladder`)
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
  yValueGetter: (d: any) => number,
): void {
  const line = d3Shape.line()
    .x((createdAt: any) => {
      return xScale(new Date(createdAt * 1000));
    })
    .y((createdAt: any) => {
      return yScale(yValueGetter(createdAt));
    })
    ;
  let s = sParent.select('.priceline');
  if (s.empty()) {
    s = sParent.append('path')
      .attr('class', 'priceline');
  }
  s
    .datum(store.sortedKeys())
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('stroke-width', '1px')
    .attr('d', line)
    ;
}

export function redisplayArea(
  sParent: any,
  sellOrBuy: string,
  xScale: d3Scale.ScaleTime<number, number>,
  yScale: d3Scale.ScaleLinear<number, number>,
  area: Array<Array<Area>>,
  stroke: (d: any, i: number) => string = () => 'none',
): void {
  sParent.selectAll(`.ladder-area-${sellOrBuy}`).remove();
  const d3area = d3Shape.area()
    .x((d: any) => xScale(new Date(d.createdAt * 1000)))
    .y0((d: any) => yScale(d.y0))
    .y1((d: any) => yScale(d.y1))
    ;
  sParent.selectAll(`.ladder-area-${sellOrBuy}`)
    .data(area)
    .join('path')
    .attr('class', `ladder-area-${sellOrBuy}`)
    .attr('d', d3area)
    .attr('fill', stroke)
    .attr('stroke', 'gray')
    .attr('stroke-width', '1px')
    ;
}

export function redisplayGroupedLadders(
  sParent: any,
  xScale: d3Scale.ScaleTime<number, number>,
  yScale: d3Scale.ScaleLinear<number, number>,
  zScale: d3Scale.ScaleLinear<number, number>,
  createdAt: number,
  ladders: Array<GroupedLadder>,
  sellOrBuy: string,
): void {
  const sLadder = sParent.selectAll(`.grouped-ladder-${sellOrBuy}-${createdAt}`).data(ladders);
  const sLadderEnter = sLadder.enter().append('line');
  const sLadderExit = sLadder.exit();
  sLadderExit.remove();
  console.log(ladders);
  redisplayGroupedLadder(sLadder, xScale, yScale, zScale, createdAt, sellOrBuy);
  redisplayGroupedLadder(sLadderEnter, xScale, yScale, zScale, createdAt, sellOrBuy);
}

export function redisplayGroupedLadder(
  s: any,
  xScale: d3Scale.ScaleTime<number, number>,
  yScale: d3Scale.ScaleLinear<number, number>,
  zScale: d3Scale.ScaleLinear<number, number>,
  createdAt: number,
  sellOrBuy: string,
): void {
  s
    .attr('class', `grouped-ladder-${sellOrBuy}-${createdAt}`)
    .attr('x1', (d: GroupedLadder) => xScale(new Date(createdAt * 1000)))
    .attr('y1', (d: GroupedLadder) => yScale(d.minPrice))
    .attr('x2', (d: GroupedLadder) => xScale(new Date(createdAt * 1000)))
    .attr('y2', (d: GroupedLadder) => yScale(d.maxPrice))
    .attr('stroke-width', 2)
    .attr('stroke', (d: GroupedLadder) => {
      if (sellOrBuy === 'buy') {
        return d3ScaleChromatic.interpolateReds(zScale(d.quantity));
      }
      return d3ScaleChromatic.interpolateBlues(zScale(d.quantity));
    })
    ;
}

export function redisplaySection(
  s: any,
  xScale: d3Scale.ScaleTime<number, number>,
  yScale: d3Scale.ScaleLinear<number, number>,
  secs: Array<ChartEachSection>,
): void {
  const sBox = s.selectAll(`.secs`).data(secs);
  const sBoxEnter = sBox.enter().append('polyline');
  const sBoxExit = sBox.exit();
  sBoxExit.remove();
  redisplayBox(sBox, xScale, yScale);
  redisplayBox(sBoxEnter, xScale, yScale);
}

function redisplayBox(
  s: any,
  xScale: d3Scale.ScaleTime<number, number>,
  yScale: d3Scale.ScaleLinear<number, number>,
): void {
  s
    .attr('class', 'secs')
    .attr('points', (d: ChartEachSection) => {
      const a = [
        `${xScale(new Date(d.createdAt * 1000))}, ${yScale(d.priceMin)}`,
        `${xScale(new Date((d.createdAt + d.window) * 1000))}, ${yScale(d.priceMin)} `,
        `${xScale(new Date((d.createdAt + d.window) * 1000))}, ${yScale(d.priceMax)} `,
        `${xScale(new Date(d.createdAt * 1000))}, ${yScale(d.priceMax)} `,
        `${xScale(new Date(d.createdAt * 1000))}, ${yScale(d.priceMin)} `,
      ];
      return a.join(' ');
    })
    .attr('stroke-width', '1')
    .attr('stroke', 'black')
    .attr('fill', 'none')
    ;
}

export function redisplayExecutedEntry(
  s: any,
  xScale: d3Scale.ScaleTime<number, number>,
  yScale: d3Scale.ScaleLinear<number, number>,
  entries: Array<any>,
): void {
  const sPoint = s.selectAll(`.entries`).data(entries);
  const sPointEnter = sPoint.enter().append('circle');
  const sPointExit = sPoint.exit();
  sPointExit.remove();
  redisplayEntryEach(sPoint, xScale, yScale);
  redisplayEntryEach(sPointEnter, xScale, yScale);
}

function redisplayEntryEach(
  s: any,
  xScale: d3Scale.ScaleTime<number, number>,
  yScale: d3Scale.ScaleLinear<number, number>,
): void {
  s
    .attr('class', 'entries')
    .attr('r', 3)
    .attr('cx', d => xScale(new Date(d.createdAt * 1000)))
    .attr('cy', d => yScale(d.price))
    .attr('fill', d => {
      if (d.side === SideBuy) { return 'red'; }
      return 'blue';
    })
    ;
}

export function redisplayPair(
  s: any,
  xScale: d3Scale.ScaleTime<number, number>,
  yScale: d3Scale.ScaleLinear<number, number>,
  pairs: Array<Pair>,
): void {
  const sEntry = s.selectAll(`.pair-entry`).data(pairs);
  const sEntryEnter = sEntry.enter().append('circle');
  const sEntryExit = sEntry.exit();
  sEntryExit.remove();
  redisplayPairEntry(sEntry, xScale, yScale);
  redisplayPairEntry(sEntryEnter, xScale, yScale);

  const sExecutedEntry = s.selectAll(`.pair-executed-entry`).data(pairs);
  const sExecutedEntryEnter = sExecutedEntry.enter().append('circle');
  const sExecutedEntryExit = sExecutedEntry.exit();
  sExecutedEntryExit.remove();
  redisplayPairExecutedEntry(sExecutedEntry, xScale, yScale);
  redisplayPairExecutedEntry(sExecutedEntryEnter, xScale, yScale);

  const sLine = s.selectAll(`.pair-line`).data(pairs);
  const sLineEnter = sLine.enter().append('line');
  const sLineExit = sLine.exit();
  sLineExit.remove();
  redisplayPairLine(sLine, xScale, yScale);
  redisplayPairLine(sLineEnter, xScale, yScale);
}

function redisplayPairEntry(
  s: any,
  xScale: d3Scale.ScaleTime<number, number>,
  yScale: d3Scale.ScaleLinear<number, number>,
): void {
  s
    .attr('class', 'pair-entry')
    .attr('r', 3)
    .attr('cx', (d: Pair) => xScale(new Date(d.entry.createdAt * 1000)))
    .attr('cy', (d: Pair) => yScale(d.entry.price))
    .attr('fill', (d: Pair) => {
      if (d.entry.side === SideBuy) { return 'red'; }
      return 'blue';
    })
    ;
}

function redisplayPairExecutedEntry(
  s: any,
  xScale: d3Scale.ScaleTime<number, number>,
  yScale: d3Scale.ScaleLinear<number, number>,
): void {
  s
    .attr('class', 'pair-executed-entry')
    .attr('r', 3)
    .attr('cx', (d: Pair) => xScale(new Date(d.executedEntry.createdAt * 1000)))
    .attr('cy', (d: Pair) => yScale(d.executedEntry.price))
    .attr('fill', 'white')
    .attr('stroke', (d: Pair) => {
      if (d.executedEntry.side === SideBuy) { return 'red'; }
      return 'blue';
    })
    .attr('stroke-width', 1)
    ;
}

function redisplayPairLine(
  s: any,
  xScale: d3Scale.ScaleTime<number, number>,
  yScale: d3Scale.ScaleLinear<number, number>,
): void {
  s
    .attr('class', 'pair-line')
    .attr('r', 3)
    .attr('x1', (d: Pair) => xScale(new Date(d.executedEntry.createdAt * 1000)))
    .attr('x2', (d: Pair) => xScale(new Date(d.entry.createdAt * 1000)))
    .attr('y1', (d: Pair) => yScale(d.executedEntry.price))
    .attr('y2', (d: Pair) => yScale(d.entry.price))
    .attr('stroke', (d: Pair) => {
      if (d.executedEntry.side === SideBuy) { return 'red'; }
      return 'blue';
    })
    .attr('stroke-width', 1)
    .on('click', (d: Pair) => {
      console.log(d);
    })
    ;
}
