import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InstruccionesModalComponent } from './instrucciones-modal.component';

describe('InstruccionesModalComponent', () => {
  let component: InstruccionesModalComponent;
  let fixture: ComponentFixture<InstruccionesModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [InstruccionesModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InstruccionesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
