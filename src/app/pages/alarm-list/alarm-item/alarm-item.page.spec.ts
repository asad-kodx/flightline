import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlarmItemPage } from './alarm-item.page';

describe('AlarmItemPage', () => {
  let component: AlarmItemPage;
  let fixture: ComponentFixture<AlarmItemPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
