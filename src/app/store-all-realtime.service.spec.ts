import { TestBed } from '@angular/core/testing';

import { StoreAllRealtimeService } from './store-all-realtime.service';

describe('StoreAllRealtimeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StoreAllRealtimeService = TestBed.get(StoreAllRealtimeService);
    expect(service).toBeTruthy();
  });
});
