import { TestBed } from '@angular/core/testing';

import { CommentChangeService } from './comment-change.service';

describe('CommentChangeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommentChangeService = TestBed.get(CommentChangeService);
    expect(service).toBeTruthy();
  });
});
