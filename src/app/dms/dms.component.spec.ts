import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmsComponent } from './dms.component';

describe('DmsComponent', () => {
  let component: DmsComponent;
  let fixture: ComponentFixture<DmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
