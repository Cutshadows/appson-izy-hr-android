import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionmodalPage } from './optionmodal.page';

describe('OptionmodalPage', () => {
  let component: OptionmodalPage;
  let fixture: ComponentFixture<OptionmodalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionmodalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionmodalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
