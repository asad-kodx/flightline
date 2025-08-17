import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RemoteControlComponentPage } from './remote-control-component.page';

describe('RemoteControlComponentPage', () => {
  let component: RemoteControlComponentPage;
  let fixture: ComponentFixture<RemoteControlComponentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoteControlComponentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
