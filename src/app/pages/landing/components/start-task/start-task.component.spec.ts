import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartTaskComponent } from './start-task.component';

describe('StartTaskComponent', () => {
  let component: StartTaskComponent;
  let fixture: ComponentFixture<StartTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StartTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
