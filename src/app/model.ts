class Execution {
  id: string;
  quantity: number;
  price: number;
  side: string;
  createdAt: number;
}

class ChartEach {
  id: string;
  price: number;
  priceStart: number;
  priceEnd: number;
  priceMin: number;
  priceMax: number;
  sellQuantity: number;
  buyQuantity: number;
  createdAt: number;
}

class LadderEach {
  price: number;
  quantity: number;
}

class OrderBook {
  createdAt: number;
  sell: Array<LadderEach>;
  buy: Array<LadderEach>;
}
