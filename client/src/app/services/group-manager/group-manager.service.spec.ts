import { TestBed } from '@angular/core/testing';

import { GroupManagerService } from './group-manager.service';

describe('GroupManagerService', () => {
  let service: GroupManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
