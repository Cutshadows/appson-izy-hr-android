import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestingPage } from './testing.page';

describe('TestingPage', () => {
  let component: TestingPage;
  let fixture: ComponentFixture<TestingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
