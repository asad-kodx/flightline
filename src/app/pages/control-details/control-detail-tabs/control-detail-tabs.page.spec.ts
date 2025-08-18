import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlDetailTabsPage } from './control-detail-tabs.page';

describe('ControlDetailTabsPage', () => {
  let component: ControlDetailTabsPage;
  let fixture: ComponentFixture<ControlDetailTabsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlDetailTabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
