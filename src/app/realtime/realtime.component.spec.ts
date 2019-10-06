import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealtimeComponent } from './realtime.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

describe('RealtimeComponent', () => {
  let component: RealtimeComponent;
  let fixture: ComponentFixture<RealtimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RealtimeComponent,
      ],
      imports: [
        HttpClientModule,
        FormsModule,
        MatCheckboxModule,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealtimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
