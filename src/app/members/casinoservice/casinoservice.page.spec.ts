import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CasinoservicePage } from './casinoservice.page';

describe('CasinoservicePage', () => {
  let component: CasinoservicePage;
  let fixture: ComponentFixture<CasinoservicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CasinoservicePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasinoservicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
