import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YetToWatchPage } from './yet-to-watch.page';

describe('YetToWatchPage', () => {
  let component: YetToWatchPage;
  let fixture: ComponentFixture<YetToWatchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YetToWatchPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YetToWatchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
