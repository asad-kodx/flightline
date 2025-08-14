import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SiteAlarmsListPage } from './site-alarms-list.page';

describe('SiteAlarmsListPage', () => {
  let component: SiteAlarmsListPage;
  let fixture: ComponentFixture<SiteAlarmsListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteAlarmsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
