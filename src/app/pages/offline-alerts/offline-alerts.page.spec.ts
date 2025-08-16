import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OfflineAlertsPage } from './offline-alerts.page';

describe('OfflineAlertsPage', () => {
  let component: OfflineAlertsPage;
  let fixture: ComponentFixture<OfflineAlertsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineAlertsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
