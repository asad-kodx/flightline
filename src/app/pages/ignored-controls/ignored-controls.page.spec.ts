import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IgnoredControlsPage } from './ignored-controls.page';

describe('IgnoredControlsPage', () => {
  let component: IgnoredControlsPage;
  let fixture: ComponentFixture<IgnoredControlsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(IgnoredControlsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
