import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddControlPage } from './add-control.page';

describe('AddControlPage', () => {
  let component: AddControlPage;
  let fixture: ComponentFixture<AddControlPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddControlPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
