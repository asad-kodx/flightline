import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlarmListTabsPage } from './alarm-list-tabs.page';

describe('AlarmListTabsPage', () => {
  let component: AlarmListTabsPage;
  let fixture: ComponentFixture<AlarmListTabsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmListTabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
