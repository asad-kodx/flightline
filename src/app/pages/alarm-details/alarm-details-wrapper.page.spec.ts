import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlarmDetailsWrapperPage } from './alarm-details-wrapper.page';

describe('AlarmDetailsWrapperPage', () => {
  let component: AlarmDetailsWrapperPage;
  let fixture: ComponentFixture<AlarmDetailsWrapperPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmDetailsWrapperPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
