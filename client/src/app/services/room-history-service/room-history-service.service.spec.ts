import { TestBed } from '@angular/core/testing';

import { RoomHistoryServiceService } from './room-history-service.service';

describe('RoomHistoryServiceService', () => {
  let service: RoomHistoryServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoomHistoryServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
