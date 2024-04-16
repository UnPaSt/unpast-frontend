import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GprofilerButtonComponent } from './gprofiler-button.component';

describe('GprofilerButtonComponent', () => {
  let component: GprofilerButtonComponent;
  let fixture: ComponentFixture<GprofilerButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GprofilerButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GprofilerButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
