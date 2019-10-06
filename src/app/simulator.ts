import { StoreChart } from './store';
import {
  Entry, ExecutedEntry, SideBuy,
  SideSell, EntryTypeLimit, ChartEachSection,
  ChartEach, EntryTypeMarket, EntryStatusDoing, EntryStatusCannceled, EntryStatusDone,
} from './model';

export interface Pair {
  entry: Entry;
  executedEntry: ExecutedEntry;
}

export class Simulator {
  public store: StoreChart;
  private entries: Map<string, Entry>;
  private executedEntries: Map<string, ExecutedEntry>;

  private freeA: number;
  private nameA: string;
  private reservedA: number;

  private freeB: number;
  private nameB: string;
  private reservedB: number;

  constructor(
    store: StoreChart,
    freeA: number,
    nameA: string,
    freeB: number,
    nameB: string,
  ) {
    this.store = store;
    this.entries = new Map<string, Entry>();
    this.executedEntries = new Map<string, ExecutedEntry>();
    this.freeA = freeA;
    this.reservedA = 0;
    this.freeB = freeB;
    this.reservedB = 0;
    this.nameA = nameA;
    this.nameB = nameB;
  }

  public clear(): void {
    this.entries.clear();
    this.executedEntries.clear();
  }

  protected entry(createdAt: number) {
    throw new Error('Not impl');
  }

  protected onExecutedEntry(createdAt: number, executedEntry: ExecutedEntry) {
    throw new Error('Not impl');
  }

  public getEEPairs(): Array<Pair> {
    const ret: Array<Pair> = [];
    this.executedEntries.forEach((ee: ExecutedEntry) => {
      const e: Entry = this.entries.get(ee.id);
      ret.push({
        entry: e,
        executedEntry: ee,
      });
    });
    return ret;
  }

  public getEntries(): Array<Entry> {
    const ret = [];
    for (const k of this.entries.keys()) {
      ret.push(this.entries.get(k));
    }
    return ret;
  }

  public getExecutedEntries(): Array<ExecutedEntry> {
    const ret = [];
    for (const k of this.executedEntries.keys()) {
      ret.push(this.executedEntries.get(k));
    }
    return ret;
  }

  private setEntry(entry: Entry): void {
    if (entry.side === SideBuy) {
      if (this.freeA < entry.price * entry.quantity) {
        // console.log(`Cannot entry (freeA(${this.nameA}):${this.freeA} < ${entry.price * entry.quantity})`);
        return;
      }
      this.freeA -= entry.price * entry.quantity;
      this.reservedA += entry.price * entry.quantity;
    }
    if (entry.side === SideSell) {
      // if (this.freeB < entry.price * entry.quantity) {
      //   console.log(`Cannot entry (freeB(${this.nameB}):${this.freeB} < ${entry.price * entry.quantity})`);
      //   return;
      // }
      this.freeB -= entry.price * entry.quantity;
      this.reservedB += entry.price * entry.quantity;
    }
    this.entries.set(entry.id, entry);
  }

  public cancelEntries(fn: (e: Entry) => boolean = () => true): void {
    const deleted = [];
    for (const key of this.entries.keys()) {
      const e = this.entries.get(key);
      if (e.status !== EntryStatusDoing) {
        continue;
      }
      if (fn(e)) {
        deleted.push(key);
      }
    }
    for (const key of deleted) {
      const e = this.entries.get(key);
      const p = e.price * e.quantity;
      if (e.side === SideBuy) {
        this.freeA += p;
        this.reservedA -= p;
      }
      if (e.side === SideSell) {
        this.freeB += p;
        this.reservedB -= p;
      }
      this.entries.delete(key);
    }
  }

  private execute(createdAt: number) {
    const current = this.store.get(createdAt);
    if (!current) {
      return;
    }
    const deletedEntryIds = [];
    for (const entryId of this.entries.keys()) {
      const entry = this.entries.get(entryId);
      if (entry.status !== EntryStatusDoing) {
        continue;
      }
      if (entry.entryType === EntryTypeLimit) {
        if (entry.side === SideBuy && current.price <= entry.price) {
          this.setExecutedEntry(
            createdAt,
            {
              id: entry.id,
              price: entry.price,
              quantity: entry.quantity,
              side: entry.side,
              createdAt,
            },
          );
          deletedEntryIds.push(entry.id);
        }
        if (entry.side === SideSell && current.price >= entry.price) {
          this.setExecutedEntry(
            createdAt,
            {
              id: entry.id,
              price: entry.price,
              quantity: entry.quantity,
              side: entry.side,
              createdAt,
            },
          );
          deletedEntryIds.push(entry.id);
        }
      } else {
        this.setExecutedEntry(
          createdAt,
          {
            id: entry.id,
            price: current.price,
            quantity: entry.quantity,
            side: entry.side,
            createdAt,
          },
        );
        deletedEntryIds.push(entry.id);
      }
    }
    for (const entryId of deletedEntryIds) {
      const e = this.entries.get(entryId);
      e.status = EntryStatusDone;
    }
  }

  public buyLimitEntry(createdAt: number, price: number, quantity: number): Entry {
    const entry: Entry = {
      id: randomId(),
      createdAt,
      price,
      quantity,
      side: SideBuy,
      entryType: EntryTypeLimit,
      status: EntryStatusDoing,
    };
    this.setEntry(entry);
    return entry;
  }

  public sellLimitEntry(createdAt: number, price: number, quantity: number): Entry {
    const entry: Entry = {
      id: randomId(),
      createdAt,
      price,
      quantity,
      side: SideSell,
      entryType: EntryTypeLimit,
      status: EntryStatusDoing,
    };
    this.setEntry(entry);
    return entry;
  }

  public sellMarketEntry(createdAt: number, quantity: number): Entry {
    const s: ChartEach = this.store.get(createdAt);
    const entry: Entry = {
      id: randomId(),
      createdAt,
      price: s.price,
      quantity,
      side: SideSell,
      entryType: EntryTypeMarket,
      status: EntryStatusDoing,
    };
    this.setEntry(entry);
    return entry;
  }

  private setExecutedEntry(createdAt: number, entry: ExecutedEntry): void {
    if (entry.side === SideBuy) {
      this.reservedA -= entry.price * entry.quantity;
      this.freeB += entry.price * entry.quantity;
    }
    if (entry.side === SideSell) {
      this.reservedB -= entry.price * entry.quantity;
      this.freeA += entry.price * entry.quantity;
    }
    this.executedEntries.set(entry.id, entry);
    this.onExecutedEntry(createdAt, entry);
  }

  public start(createdAtStart: number, createdAtEnd: number) {
    for (let createdAt = createdAtStart; createdAt < createdAtEnd; createdAt++) {
      this.entry(createdAt);
      this.execute(createdAt);
    }
  }
}

function randomId(): string {
  // https://github.com/GoogleChrome/chrome-platform-analytics/blob/master/src/internal/identifier.js
  // const FORMAT: string = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
  const chars = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.split('');
  for (let i = 0, len = chars.length; i < len; i++) {
    switch (chars[i]) {
      case 'x':
        chars[i] = Math.floor(Math.random() * 16).toString(16);
        break;
      case 'y':
        chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16);
        break;
    }
  }
  return chars.join('');
}

export class Simulator002 extends Simulator {
  constructor(store: StoreChart, currentYen: number) {
    super(store, currentYen, 'yen', 0, 'btc');
  }

  protected entry(createdAt: number) {
    const current: ChartEach = this.store.get(createdAt);
    if (!current) {
      return;
    }
    this.buyLimitEntry(
      createdAt,
      current.price - 1500,
      0.01,
    );
    const canceledSell: Array<Entry> = [];
    this.cancelEntries((entry: Entry) => {
      if (entry.side === SideBuy && createdAt - entry.createdAt > 60) {
        return true;
      }
      if (entry.side === SideSell && createdAt - entry.createdAt > 60) {
        canceledSell.push(entry);
        return true;
      }
      return false;
    });
    for (const entry of canceledSell) {
      this.sellMarketEntry(
        createdAt,
        entry.quantity,
      );
    }
  }

  protected onExecutedEntry(createdAt: number, executedEntry: ExecutedEntry) {
    if (executedEntry.side === SideSell) {
      return;
    }
    this.sellLimitEntry(
      createdAt,
      executedEntry.price + 750,
      executedEntry.quantity,
    );
  }
}
