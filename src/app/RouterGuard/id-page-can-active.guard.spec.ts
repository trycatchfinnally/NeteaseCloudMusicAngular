import { TestBed, async, inject } from '@angular/core/testing';

import { IdPageCanActiveGuard } from './id-page-can-active.guard';

describe('IdPageCanActiveGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IdPageCanActiveGuard]
    });
  });

  it('should ...', inject([IdPageCanActiveGuard], (guard: IdPageCanActiveGuard) => {
    expect(guard).toBeTruthy();
  }));
});
