import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlDetailsWrapperPage } from './control-details-wrapper.page';

describe('ControlDetailsWrapperPage', () => {
  let component: ControlDetailsWrapperPage;
  let fixture: ComponentFixture<ControlDetailsWrapperPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlDetailsWrapperPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
