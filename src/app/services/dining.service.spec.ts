import { TestBed } from '@angular/core/testing';

import { DiningService } from './dining.service';

describe('DiningService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DiningService = TestBed.get(DiningService);
    expect(service).toBeTruthy();
  });
});
