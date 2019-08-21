import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntermarkPage } from './entermark.page';

describe('EntermarkPage', () => {
  let component: EntermarkPage;
  let fixture: ComponentFixture<EntermarkPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntermarkPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntermarkPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
