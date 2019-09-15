import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputterComponent } from './inputter.component';

describe('InputterComponent', () => {
  let component: InputterComponent;
  let fixture: ComponentFixture<InputterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
