import { TestBed } from '@angular/core/testing';

import { AddCommentService } from './add-comment.service';

describe('AddCommentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AddCommentService = TestBed.get(AddCommentService);
    expect(service).toBeTruthy();
  });
});
