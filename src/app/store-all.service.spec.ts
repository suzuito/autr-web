import { TestBed } from '@angular/core/testing';

import { StoreAllService } from './store-all.service';

describe('StoreAllService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StoreAllService = TestBed.get(StoreAllService);
    expect(service).toBeTruthy();
  });
});
