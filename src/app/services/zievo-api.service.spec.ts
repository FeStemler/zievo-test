import { TestBed } from '@angular/core/testing';

import { ZievoApiService } from './zievo-api.service';

describe('ZievoApiService', () => {
  let service: ZievoApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZievoApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
