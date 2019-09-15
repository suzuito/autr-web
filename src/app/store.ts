import { ChartEach, OrderBook, LadderEach, maxPriceLadderEach, minPriceLadderEach, SequenceByCreatedAt } from './model';
import {
  min,
  max,
} from './collection';


export class StoreBase {
  protected s: Map<number, SequenceByCreatedAt>;
  constructor() {
    this.s = new Map<number, SequenceByCreatedAt>();
  }

  public keys(): Array<number> {
    const ret = [];
    for (const createdAt of this.s.keys()) {
      ret.push(createdAt);
    }
    return ret;
  }

  public set(...orderBooks: Array<SequenceByCreatedAt>): void {
    orderBooks.forEach((v: SequenceByCreatedAt) => {
      this.s.set(v.createdAt, v);
    });
  }

  public get(createdAt: number): SequenceByCreatedAt {
    return this.s.get(createdAt);
  }

  public minCreatedAt(): SequenceByCreatedAt {
    const keys = this.keys();
    const i = min(keys);
    return this.s.get(keys[i]);
  }

  public maxCreatedAt(): SequenceByCreatedAt {
    const keys = this.keys();
    const i = max(keys);
    return this.s.get(keys[i]);
  }

  public length(): number {
    return this.s.size;
  }
}


export class StoreChart extends StoreBase {

  public get(createdAt: number): ChartEach {
    return super.get(createdAt) as ChartEach;
  }

  public minCreatedAt(): ChartEach {
    return super.minCreatedAt() as ChartEach;
  }

  public maxCreatedAt(): ChartEach {
    return super.maxCreatedAt() as ChartEach;
  }
}

export class StoreOrderBook extends StoreBase {
  constructor() {
    super();
  }

  public get(createdAt: number): OrderBook {
    return super.get(createdAt) as OrderBook;
  }

  public minCreatedAt(): OrderBook {
    return super.minCreatedAt() as OrderBook;
  }

  public maxCreatedAt(): OrderBook {
    return super.maxCreatedAt() as OrderBook;
  }

  public maxSellPrice(): LadderEach {
    let maxL: LadderEach = null;
    const keys = this.keys();
    for (const key of keys) {
      const l: LadderEach = maxPriceLadderEach(this.get(key).sell);
      if (maxL === null) {
        maxL = l;
        continue;
      }
      if (l.price > maxL.price) {
        maxL = l;
      }
    }
    return maxL;
  }

  public minBuyPrice(): LadderEach {
    let minL: LadderEach = null;
    const keys = this.keys();
    for (const key of keys) {
      const l: LadderEach = minPriceLadderEach(this.get(key).buy);
      if (minL === null) {
        minL = l;
        continue;
      }
      if (l.price < minL.price) {
        minL = l;
      }
    }
    return minL;
  }
}
