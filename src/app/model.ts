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
}

export interface LadderEach {
  price: number;
  quantity: number;
}

export interface OrderBook extends SequenceByCreatedAt {
  sell: Array<LadderEach>;
  buy: Array<LadderEach>;
}

export function maxPriceLadderEach(arr: Array<LadderEach>): LadderEach {
  const i = max(arr.slice(0, 70), v => v.price);
  return arr[i];
}

export function minPriceLadderEach(arr: Array<LadderEach>): LadderEach {
  const i = min(arr.slice(0, 70), v => v.price);
  return arr[i];
}

export function normalizeLadderEach(arr: Array<LadderEach>): Array<LadderEach> {
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
  return ret;
}
