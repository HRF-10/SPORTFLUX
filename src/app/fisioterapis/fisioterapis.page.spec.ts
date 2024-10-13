import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FisioterapisPage } from './fisioterapis.page';

describe('FisioterapisPage', () => {
  let component: FisioterapisPage;
  let fixture: ComponentFixture<FisioterapisPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FisioterapisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
