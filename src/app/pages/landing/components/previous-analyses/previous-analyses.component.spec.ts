import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousAnalysesComponent } from './previous-analyses.component';

describe('PreviousAnalysesComponent', () => {
  let component: PreviousAnalysesComponent;
  let fixture: ComponentFixture<PreviousAnalysesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviousAnalysesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousAnalysesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
