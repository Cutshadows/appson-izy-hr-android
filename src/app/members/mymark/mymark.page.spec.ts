import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MymarkPage } from './mymark.page';

describe('MymarkPage', () => {
  let component: MymarkPage;
  let fixture: ComponentFixture<MymarkPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MymarkPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MymarkPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
