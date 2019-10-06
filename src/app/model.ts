import { min, max } from './collection';

export interface SequenceByCreatedAt {
  createdAt: number;
}

export interface Execution extends SequenceByCreatedAt {
  id: string;
  quantity: number;
  price: number;
  side: string;
}

export interface ChartEach extends SequenceByCreatedAt {
  id: string;
  price: number;
  priceStart: number;
  priceEnd: number;
  priceMin: number;
  priceMax: number;
  sellQuantity: number;
  buyQuantity: number;
  movingAverageLines: { [s: string]: number; };
}

export interface ChartEachSection extends SequenceByCreatedAt {
  priceStart: number;
  priceEnd: number;
  priceMin: number;
  priceMax: number;
  sellQuantity: number;
  buyQuantity: number;
  window: number;
}

function newChartEachSection(a: ChartEach, window: number): ChartEachSection {
  return {
    createdAt: a.createdAt,
    priceStart: a.priceStart,
    priceEnd: a.priceEnd,
    priceMin: a.priceMin,
    priceMax: a.priceMax,
    sellQuantity: a.sellQuantity,
    buyQuantity: a.buyQuantity,
    window,
  } as ChartEachSection;
}

export function newChartEachSections(
  arr: Array<ChartEach>,
  window: number,
): Array<ChartEachSection> {
  if (arr.length <= 0) {
    return [];
  }
  const ret: Array<ChartEachSection> = [];
  const sorted: Array<ChartEach> = arr.sort((l, r) => l.createdAt - r.createdAt);
  let b: ChartEachSection = null;
  for (const a of sorted) {
    if (b === null) {
      b = newChartEachSection(a, window);
      continue;
    }
    if (a.createdAt >= b.createdAt + window) {
      ret.push(b);
      b = newChartEachSection(a, window);
    } else {
      if (a.priceMax > b.priceMax) {
        b.priceMax = a.priceMax;
      }
      if (a.priceMin < b.priceMin) {
        b.priceMin = a.priceMin;
      }
      b.priceEnd = a.priceEnd;
      b.sellQuantity += a.sellQuantity;
      b.buyQuantity += a.buyQuantity;
    }
  }
  ret.push(b);
  return ret;
}

export function averagePriceDiff(arr: Array<ChartEachSection>): number {
  let s = 0;
  let i = 0;
  for (const a of arr) {
    s += a.priceMax - a.priceMin;
    i++;
  }
  return s / i;
}

export interface LadderEach {
  price: number;
  quantity: number;
}

export interface OrderBook extends SequenceByCreatedAt {
  sell: Array<LadderEach>;
  buy: Array<LadderEach>;
}

export function newLadder(arr: Array<Array<string>>): Array<LadderEach> {
  const l: Array<LadderEach> = [];
  for (const i of arr) {
    l.push({
      price: parseFloat(i[0]),
      quantity: parseFloat(i[1]),
    });
  }
  return l;
}

export interface Product extends SequenceByCreatedAt {
  price: number;
}

export function maxPriceLadderEach(arr: Array<LadderEach>): LadderEach {
  const i = max(arr.slice(0, 70), v => v.price);
  return arr[i];
}

export function minPriceLadderEach(arr: Array<LadderEach>): LadderEach {
  const i = min(arr.slice(0, 70), v => v.price);
  return arr[i];
}

export function normalizeLadderEach(arr: Array<LadderEach>, asc: boolean): Array<LadderEach> {
  const ret: Array<LadderEach> = [];
  const tmp: Map<number, number> = new Map<number, number>();
  for (const a of arr) {
    const price = Math.floor(a.price);
    if (!tmp.has(price)) {
      tmp.set(price, 0);
    }
    tmp.set(price, tmp.get(price) + a.quantity);
  }
  for (const price of tmp.keys()) {
    ret.push({
      price,
      quantity: tmp.get(price),
    } as LadderEach);
  }
  if (asc) {
    return ret.sort((a, b) => a.price - b.price);
  }
  return ret.sort((a, b) => b.price - a.price);
}

export const SideBuy = 1;
export const SideSell = 2;

export const EntryTypeLimit = 1;
export const EntryTypeMarket = 2;

export const EntryStatusDoing = 1;
export const EntryStatusDone = 2;
export const EntryStatusCannceled = 3;

export interface Entry {
  id: string;
  price: number;
  quantity: number;
  createdAt: number;
  side: number;
  entryType: number;
  status: number;
}

export interface ExecutedEntry {
  id: string;
  price: number;
  quantity: number;
  createdAt: number;
  side: number;
}

export function resultExecutedEntries(entries: Array<ExecutedEntry>) {
  let s = 0;
  let nSell = 0;
  let nBuy = 0;
  for (const entry of entries) {
    if (entry.side === SideBuy) {
      nBuy++;
      s -= entry.price * entry.quantity;
    } else {
      nSell++;
      s += entry.price * entry.quantity;
    }
  }
  console.log(s, nBuy, nSell);
}
