import { TestBed } from '@angular/core/testing';

import { MusicUrlAvailableCheckerService } from './music-url-available-checker.service';

describe('MusicUrlUseableCheckerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MusicUrlAvailableCheckerService = TestBed.get(MusicUrlAvailableCheckerService);
    expect(service).toBeTruthy();
  });
});
