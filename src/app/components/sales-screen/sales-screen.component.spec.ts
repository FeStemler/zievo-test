import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesScreenComponent } from './sales-screen.component';

describe('SalesScreenComponent', () => {
  let component: SalesScreenComponent;
  let fixture: ComponentFixture<SalesScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesScreenComponent]
    });
    fixture = TestBed.createComponent(SalesScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
