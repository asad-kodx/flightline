import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EntityGraphsPage } from './entity-graphs.page';

describe('EntityGraphsPage', () => {
  let component: EntityGraphsPage;
  let fixture: ComponentFixture<EntityGraphsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityGraphsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
