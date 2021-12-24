import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatScreenLayoutComponent } from './chat-screen-layout.component';

describe('ChatScreenLayoutComponent', () => {
  let component: ChatScreenLayoutComponent;
  let fixture: ComponentFixture<ChatScreenLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatScreenLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatScreenLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
