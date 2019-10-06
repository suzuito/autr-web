import { maxPriceLadderEach, minPriceLadderEach, normalizeLadderEach, newLadder, newChartEachSections } from './model';

describe('model.ts', () => {
  it('newLadder', () => {
    expect(newLadder([])).toEqual([]);
    expect(newLadder([
      ['1.1', '1.2'],
      ['1.3', '1.4'],
    ])).toEqual([
      { price: 1.1, quantity: 1.2 },
      { price: 1.3, quantity: 1.4 },
    ]);
  });
  it('maxPriceLadderEach', () => {
    expect(maxPriceLadderEach([])).toBeUndefined();
    expect(maxPriceLadderEach([
      { price: 100, quantity: 1000 },
    ])).toEqual(
      { price: 100, quantity: 1000 },
    );
    expect(maxPriceLadderEach([
      { price: 100, quantity: 1000 },
      { price: 150, quantity: 1500 },
    ])).toEqual(
      { price: 150, quantity: 1500 },
    );
  });
  it('minPriceLadderEach', () => {
    expect(minPriceLadderEach([])).toBeUndefined();
    expect(minPriceLadderEach([
      { price: 100, quantity: 1000 },
    ])).toEqual(
      { price: 100, quantity: 1000 },
    );
    expect(minPriceLadderEach([
      { price: 100, quantity: 1000 },
      { price: 150, quantity: 1500 },
    ])).toEqual(
      { price: 100, quantity: 1000 },
    );
  });
  it('normalizeLadderEach', () => {
    expect(normalizeLadderEach([
      { price: 101.01, quantity: 1 },
      { price: 102.06, quantity: 2 },
    ], true)).toEqual([
      { price: 101.00, quantity: 1 },
      { price: 102.00, quantity: 2 },
    ]);
    expect(normalizeLadderEach([
      { price: 101.01, quantity: 1 },
      { price: 102.06, quantity: 2 },
    ], false)).toEqual([
      { price: 102.00, quantity: 2 },
      { price: 101.00, quantity: 1 },
    ]);
    expect(normalizeLadderEach([
      { price: 101.01, quantity: 1 },
      { price: 101.02, quantity: 2 },
    ], true)).toEqual([
      { price: 101.00, quantity: 3 },
    ]);
  });
  it('newChartEachSection', () => {
    expect(newChartEachSections([], 5)).toEqual([]);
    expect(newChartEachSections([
      {
        createdAt: 1000, priceStart: 1, priceEnd: 2, priceMin: 3, priceMax: 4, sellQuantity: 10, buyQuantity: 20,
        id: null, price: null, movingAverageLines: null
      },
    ], 3)).toEqual([
      { createdAt: 1000, priceStart: 1, priceEnd: 2, priceMin: 3, priceMax: 4, window: 3, sellQuantity: 10, buyQuantity: 20, },
    ]);
    expect(newChartEachSections([
      {
        createdAt: 1000, priceStart: 1, priceEnd: 2, priceMin: 3, priceMax: 4, sellQuantity: 10, buyQuantity: 20,
        id: null, price: null, movingAverageLines: null
      },
      {
        createdAt: 1001, priceStart: 5, priceEnd: 6, priceMin: 7, priceMax: 8, sellQuantity: 11, buyQuantity: 21,
        id: null, price: null, movingAverageLines: null
      },
    ], 3)).toEqual([
      { createdAt: 1000, priceStart: 1, priceEnd: 6, priceMin: 3, priceMax: 8, window: 3, sellQuantity: 21, buyQuantity: 41, },
    ]);
    expect(newChartEachSections([
      {
        createdAt: 1000, priceStart: 1, priceEnd: 2, priceMin: 3, priceMax: 4, sellQuantity: 10, buyQuantity: 20,
        id: null, price: null, movingAverageLines: null
      },
      {
        createdAt: 1006, priceStart: 5, priceEnd: 6, priceMin: 7, priceMax: 8, sellQuantity: 11, buyQuantity: 21,
        id: null, price: null, movingAverageLines: null
      },
    ], 3)).toEqual([
      { createdAt: 1000, priceStart: 1, priceEnd: 2, priceMin: 3, priceMax: 4, window: 3, sellQuantity: 10, buyQuantity: 20, },
      { createdAt: 1006, priceStart: 5, priceEnd: 6, priceMin: 7, priceMax: 8, window: 3, sellQuantity: 11, buyQuantity: 21, },
    ]);
    expect(newChartEachSections([
      {
        createdAt: 1000, priceStart: 1, priceEnd: 2, priceMin: 3, priceMax: 16, sellQuantity: 5, buyQuantity: 6,
        id: null, price: null, movingAverageLines: null
      },
      {
        createdAt: 1001, priceStart: 7, priceEnd: 8, priceMin: 9, priceMax: 10, sellQuantity: 11, buyQuantity: 12,
        id: null, price: null, movingAverageLines: null
      },
      {
        createdAt: 1002, priceStart: 13, priceEnd: 14, priceMin: 15, priceMax: 4, sellQuantity: 17, buyQuantity: 18,
        id: null, price: null, movingAverageLines: null
      },
      {
        createdAt: 1003, priceStart: 19, priceEnd: 20, priceMin: 33, priceMax: 22, sellQuantity: 23, buyQuantity: 24,
        id: null, price: null, movingAverageLines: null
      },
      {
        createdAt: 1004, priceStart: 25, priceEnd: 26, priceMin: 27, priceMax: 28, sellQuantity: 29, buyQuantity: 30,
        id: null, price: null, movingAverageLines: null
      },
      {
        createdAt: 1005, priceStart: 31, priceEnd: 32, priceMin: 21, priceMax: 34, sellQuantity: 35, buyQuantity: 36,
        id: null, price: null, movingAverageLines: null
      },
    ], 3)).toEqual([
      { createdAt: 1000, priceStart: 1, priceEnd: 14, priceMin: 3, priceMax: 16, window: 3, sellQuantity: 33, buyQuantity: 36, },
      { createdAt: 1003, priceStart: 19, priceEnd: 32, priceMin: 21, priceMax: 34, window: 3, sellQuantity: 87, buyQuantity: 90, },
    ]);
  });
});
