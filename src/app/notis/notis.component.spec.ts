import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotisComponent } from './notis.component';

describe('NotisComponent', () => {
  let component: NotisComponent;
  let fixture: ComponentFixture<NotisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
