import { TestBed } from '@angular/core/testing';

import { LikeListProviderService } from './like-list-provider.service';

describe('LikeListProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LikeListProviderService = TestBed.get(LikeListProviderService);
    expect(service).toBeTruthy();
  });
});
