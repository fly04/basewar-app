import { TestBed } from '@angular/core/testing';

import { BasesService } from './bases.service';

describe('BasesService', () => {
  let service: BasesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BasesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
