import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsDeviceListPage } from './tabs-device-list.page';

describe('TabsDeviceListPage', () => {
  let component: TabsDeviceListPage;
  let fixture: ComponentFixture<TabsDeviceListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsDeviceListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
