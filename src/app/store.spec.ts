import { StoreBase } from './store';
import { SequenceByCreatedAt } from './model';


describe('store.ts', () => {
  it('newLadder', () => {
    const store: StoreBase = new StoreBase();
    store.set({ createdAt: 1000 });
    store.set({ createdAt: 1001 });
    store.set({ createdAt: 1002 });
    expect(store.sortedKeys()).toEqual([1000, 1001, 1002]);
    expect(store.has(1003)).toBeFalsy();
    expect(store.has(1000)).toBeTruthy();
    expect(store.get(1000)).toEqual({ createdAt: 1000 });
    expect(store.get(1003)).toBeUndefined();
    expect(store.minCreatedAt()).toEqual({ createdAt: 1000 });
    expect(store.maxCreatedAt()).toEqual({ createdAt: 1002 });
    expect(store.length()).toEqual(3);
    expect(
      store.filter(
        (v: SequenceByCreatedAt) => v.createdAt >= 1000 && v.createdAt < 1002,
      ),
    ).toEqual([
      { createdAt: 1000 },
      { createdAt: 1001 },
    ]);
    store.deleteUntil(1001);
    expect(store.length()).toEqual(1);
    expect(store.get(1002)).toEqual({ createdAt: 1002 });
  });
});
