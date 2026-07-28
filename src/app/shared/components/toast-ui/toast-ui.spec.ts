import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastUi } from './toast-ui';

describe('ToastUi', () => {
  let component: ToastUi;
  let fixture: ComponentFixture<ToastUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastUi],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastUi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
