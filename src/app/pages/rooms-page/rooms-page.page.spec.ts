import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoomsPagePage } from './rooms-page.page';

describe('RoomsPagePage', () => {
  let component: RoomsPagePage;
  let fixture: ComponentFixture<RoomsPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomsPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
