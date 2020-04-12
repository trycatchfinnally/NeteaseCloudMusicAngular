import { TestBed } from '@angular/core/testing';

import { AddToPlayServiceFactoryService } from './add-to-play-service-factory.service';

describe('AddToPlayServiceFactoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AddToPlayServiceFactoryService = TestBed.get(AddToPlayServiceFactoryService);
    expect(service).toBeTruthy();
  });
});
