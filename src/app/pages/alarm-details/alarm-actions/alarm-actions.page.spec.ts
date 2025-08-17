import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlarmActionsPage } from './alarm-actions.page';

describe('AlarmActionsPage', () => {
  let component: AlarmActionsPage;
  let fixture: ComponentFixture<AlarmActionsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmActionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
