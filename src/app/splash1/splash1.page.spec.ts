import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Splash1Page } from './splash1.page';

describe('Splash1Page', () => {
  let component: Splash1Page;
  let fixture: ComponentFixture<Splash1Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Splash1Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Splash1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
