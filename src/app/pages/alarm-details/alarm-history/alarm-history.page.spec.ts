import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlarmHistoryPage } from './alarm-history.page';

describe('AlarmHistoryPage', () => {
  let component: AlarmHistoryPage;
  let fixture: ComponentFixture<AlarmHistoryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
