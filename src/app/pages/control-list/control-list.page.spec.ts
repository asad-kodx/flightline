import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlListPage } from './control-list.page';

describe('ControlListPage', () => {
  let component: ControlListPage;
  let fixture: ComponentFixture<ControlListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
