import { TestBed } from '@angular/core/testing';

import { BackendControllerService } from './backend-controller.service';

describe('BackendControllerService', () => {
  let service: BackendControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
