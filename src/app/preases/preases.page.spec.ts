import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreasesPage } from './preases.page';

describe('PreasesPage', () => {
  let component: PreasesPage;
  let fixture: ComponentFixture<PreasesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreasesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreasesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
