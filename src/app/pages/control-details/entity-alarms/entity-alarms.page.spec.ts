import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EntityAlarmsPage } from './entity-alarms.page';

describe('EntityAlarmsPage', () => {
  let component: EntityAlarmsPage;
  let fixture: ComponentFixture<EntityAlarmsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityAlarmsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
