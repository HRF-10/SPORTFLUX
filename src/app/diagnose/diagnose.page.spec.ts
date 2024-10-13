import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiagnosePage } from './diagnose.page';

describe('DiagnosePage', () => {
  let component: DiagnosePage;
  let fixture: ComponentFixture<DiagnosePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagnosePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
