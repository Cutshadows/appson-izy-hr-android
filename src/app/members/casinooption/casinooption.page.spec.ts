import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CasinooptionPage } from './casinooption.page';

describe('CasinooptionPage', () => {
  let component: CasinooptionPage;
  let fixture: ComponentFixture<CasinooptionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CasinooptionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasinooptionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
