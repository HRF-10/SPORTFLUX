import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImuPage } from './imu.page';

describe('ImuPage', () => {
  let component: ImuPage;
  let fixture: ComponentFixture<ImuPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImuPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
