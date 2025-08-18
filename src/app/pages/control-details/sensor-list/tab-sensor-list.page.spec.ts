import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabSensorListPage } from './tab-sensor-list.page';

describe('TabSensorListPage', () => {
  let component: TabSensorListPage;
  let fixture: ComponentFixture<TabSensorListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TabSensorListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
