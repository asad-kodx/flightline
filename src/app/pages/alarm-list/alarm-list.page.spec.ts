import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlarmListPage } from './alarm-list.page';

describe('AlarmListPage', () => {
  let component: AlarmListPage;
  let fixture: ComponentFixture<AlarmListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
