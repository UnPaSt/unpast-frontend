import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugstoneComponent } from './drugstone.component';

describe('DrugstoneComponent', () => {
  let component: DrugstoneComponent;
  let fixture: ComponentFixture<DrugstoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrugstoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrugstoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
