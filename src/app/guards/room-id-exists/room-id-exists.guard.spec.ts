import { TestBed } from '@angular/core/testing';

import { RoomIdExistsGuard } from './room-id-exists.guard';

describe('RoomIdExistsGuard', () => {
  let guard: RoomIdExistsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RoomIdExistsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
