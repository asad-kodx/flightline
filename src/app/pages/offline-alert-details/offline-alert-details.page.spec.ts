import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OfflineAlertDetailsPage } from './offline-alert-details.page';

describe('OfflineAlertDetailsPage', () => {
  let component: OfflineAlertDetailsPage;
  let fixture: ComponentFixture<OfflineAlertDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineAlertDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
