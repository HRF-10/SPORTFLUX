import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Splash3Page } from './splash3.page';

describe('Splash3Page', () => {
  let component: Splash3Page;
  let fixture: ComponentFixture<Splash3Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Splash3Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Splash3Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
