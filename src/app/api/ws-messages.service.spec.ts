import { TestBed } from '@angular/core/testing';

import { WsMessagesService } from './ws-messages.service';

describe('WsMessagesService', () => {
  let service: WsMessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WsMessagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
