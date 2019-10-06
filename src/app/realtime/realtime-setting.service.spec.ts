import { TestBed } from '@angular/core/testing';

import { RealtimeSettingService } from './realtime-setting.service';

describe('RealtimeSettingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RealtimeSettingService = TestBed.get(RealtimeSettingService);
    expect(service).toBeTruthy();
  });
});
