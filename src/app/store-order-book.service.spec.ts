import { TestBed } from '@angular/core/testing';

import { StoreOrderBookService } from './store-order-book.service';

describe('StoreOrderBookService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StoreOrderBookService = TestBed.get(StoreOrderBookService);
    expect(service).toBeTruthy();
  });
});
