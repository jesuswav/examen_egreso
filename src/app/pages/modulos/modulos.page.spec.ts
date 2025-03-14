import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModulosPage } from './modulos.page';

describe('ModulosPage', () => {
  let component: ModulosPage;
  let fixture: ComponentFixture<ModulosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModulosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
