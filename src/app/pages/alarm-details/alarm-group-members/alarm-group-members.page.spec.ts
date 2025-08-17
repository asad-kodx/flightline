import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlarmGroupMembersPage } from './alarm-group-members.page';

describe('AlarmGroupMembersPage', () => {
  let component: AlarmGroupMembersPage;
  let fixture: ComponentFixture<AlarmGroupMembersPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmGroupMembersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
