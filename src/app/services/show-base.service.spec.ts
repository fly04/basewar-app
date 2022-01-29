import { TestBed } from '@angular/core/testing';

import { ShowBaseService } from './show-base.service';

describe('ShowBaseService', () => {
  let service: ShowBaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShowBaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
