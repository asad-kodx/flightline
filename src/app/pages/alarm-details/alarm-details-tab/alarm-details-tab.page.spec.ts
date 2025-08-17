import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlarmDetailsTabPage } from './alarm-details-tab.page';

describe('AlarmDetailsTabPage', () => {
  let component: AlarmDetailsTabPage;
  let fixture: ComponentFixture<AlarmDetailsTabPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmDetailsTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
