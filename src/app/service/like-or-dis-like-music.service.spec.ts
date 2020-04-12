import { TestBed } from '@angular/core/testing';

import { LikeOrDisLikeMusicService } from './like-or-dis-like-music.service';

describe('LikeOrDisLikeMusicService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LikeOrDisLikeMusicService = TestBed.get(LikeOrDisLikeMusicService);
    expect(service).toBeTruthy();
  });
});
