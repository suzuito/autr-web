import { TestBed } from '@angular/core/testing';

import { StoreChart1secService } from './store-chart1sec.service';

describe('StoreChart1secService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StoreChart1secService = TestBed.get(StoreChart1secService);
    expect(service).toBeTruthy();
  });
});
