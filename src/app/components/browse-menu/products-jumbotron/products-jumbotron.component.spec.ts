import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsJumbotronComponent } from './products-jumbotron.component';

describe('ProductsJumbotronComponent', () => {
  let component: ProductsJumbotronComponent;
  let fixture: ComponentFixture<ProductsJumbotronComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductsJumbotronComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsJumbotronComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
