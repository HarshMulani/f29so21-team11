import { TestBed } from '@angular/core/testing';

import { WhiteboardManagerService } from './whiteboard-manager.service';

describe('WhiteboardManagerService', () => {
  let service: WhiteboardManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WhiteboardManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
