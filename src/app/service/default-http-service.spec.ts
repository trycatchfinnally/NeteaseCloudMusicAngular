import { TestBed } from '@angular/core/testing';

import { DefaultHttpService  } from './default-http-service';

describe('DefaultHttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DefaultHttpService = TestBed.get(DefaultHttpService);
    expect(service).toBeTruthy();
  });
});
