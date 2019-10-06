import { ChartEach, SequenceByCreatedAt } from './model';
import { StoreChart } from './store';

/*
export function getSections(
  s: Map<number, ChartEach>,
  createdAtStart: number,
  createdAtEnd: number,
  secondsWindow: number,
): StoreChart {
  const store: StoreChart = new StoreChart();
  for (let createdAt = createdAtStart; createdAt < createdAtEnd; createdAt++) {
    const chs: Array<ChartEach> = extractSections(s, createdAtStart, secondsWindow);
    store.set(group(createdAt, chs));
  }
  return store;
}

function extractSections(
  s: Map<number, ChartEach>,
  createdAtStart: number,
  secondsWindow: number,
): Array<ChartEach> {
  const ret: Array<ChartEach> = [];
  for (let i = 0; i < secondsWindow; i++) {
    const ch: ChartEach = s.get(createdAtStart + i);
    console.log(createdAtStart + i, ch);
    ret.push(ch);
  }
  return ret;
}

function group(createdAt: number, s: Array<ChartEach>): ChartEach {
  const r: ChartEach = {
    id: `${createdAt}`,
    createdAt,
    price: 0,
    priceStart: 0,
    priceEnd: 0,
    priceMin: 99999999999999999999,
    priceMax: 0,
    sellQuantity: 0,
    buyQuantity: 0,
    movingAverageLines: {},
  };
  let createdAtMin = 9999999999999999999;
  let createdAtMax = 0;
  for (const a of s) {
    if (a.priceMin < r.priceMin) {
      r.priceMin = a.priceMin;
    }
    if (a.priceMax > r.priceMax) {
      r.priceMax = a.priceMax;
    }
    if (createdAtMin < r.createdAt) {
      r.priceStart = a.priceStart;
      createdAtMin = a.createdAt;
    }
    if (createdAtMax > r.createdAt) {
      r.priceEnd = a.priceEnd;
      createdAtMax = a.createdAt;
    }
  }
  return r;
}
*/
