import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiclusterTableComponent } from './bicluster-table.component';

describe('BiclusterTableComponent', () => {
  let component: BiclusterTableComponent;
  let fixture: ComponentFixture<BiclusterTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiclusterTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BiclusterTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
