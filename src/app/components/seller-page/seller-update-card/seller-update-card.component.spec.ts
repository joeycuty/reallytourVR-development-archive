import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerUpdateCardComponent } from './seller-update-card.component';

describe('SellerUpdateCardComponent', () => {
  let component: SellerUpdateCardComponent;
  let fixture: ComponentFixture<SellerUpdateCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellerUpdateCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerUpdateCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
