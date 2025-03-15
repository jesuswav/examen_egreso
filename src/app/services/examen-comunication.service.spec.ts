import { TestBed } from '@angular/core/testing';

import { ExamenComunicationService } from './examen-comunication.service';

describe('ExamenComunicationService', () => {
  let service: ExamenComunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExamenComunicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
