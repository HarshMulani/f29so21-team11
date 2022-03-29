import { TestBed } from '@angular/core/testing';

import { UserExistsGuard } from './user-exists.guard';

describe('UserExistsGuard', () => {
  let guard: UserExistsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UserExistsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
