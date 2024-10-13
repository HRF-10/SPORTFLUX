import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Splash2Page } from './splash2.page';

describe('Splash2Page', () => {
  let component: Splash2Page;
  let fixture: ComponentFixture<Splash2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Splash2Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Splash2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
