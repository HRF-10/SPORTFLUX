import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatRoom2Page } from './chat-room2.page';

describe('ChatRoom2Page', () => {
  let component: ChatRoom2Page;
  let fixture: ComponentFixture<ChatRoom2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatRoom2Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatRoom2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
