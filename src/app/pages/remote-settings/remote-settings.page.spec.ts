import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RemoteSettingsPage } from './remote-settings.page';

describe('RemoteSettingsPage', () => {
  let component: RemoteSettingsPage;
  let fixture: ComponentFixture<RemoteSettingsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoteSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
