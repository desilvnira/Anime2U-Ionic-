import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchingPage } from './watching.page';

describe('WatchingPage', () => {
  let component: WatchingPage;
  let fixture: ComponentFixture<WatchingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WatchingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WatchingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
