import { TestBed } from '@angular/core/testing';

import { StoreChartService } from './store-chart1sec.service';

describe('StoreChart1secService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StoreChartService = TestBed.get(StoreChartService);
    expect(service).toBeTruthy();
  });
});
