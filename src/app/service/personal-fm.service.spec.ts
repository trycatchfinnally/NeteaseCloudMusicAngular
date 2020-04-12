import { TestBed } from '@angular/core/testing';

import { PersonalFMService } from './personal-fm.service';

describe('PersonalFMService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PersonalFMService = TestBed.get(PersonalFMService);
    expect(service).toBeTruthy();
  });
});
