import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExamenPage } from './examen.page';

describe('ExamenPage', () => {
  let component: ExamenPage;
  let fixture: ComponentFixture<ExamenPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
