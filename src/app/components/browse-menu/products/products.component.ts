import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModifiersComponent } from '../modifiers/modifiers.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { CategoryService } from 'src/app/services/category.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SharedService } from 'src/app/services/shared.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  loader: boolean = true;
  businessId = '66fc5fb8aef1d315dc9fd4e6';
  //  for test mode-->
  //  businessId = '65d6e2acf4cb2c368afded71';
  category_id: any;
  filteredProducts: any[] = [];
  products: any[] = [];
  allProducts: any[] = [];
  categories: any[] = [];
  activeCategory: string = 'All';
  catName: any = '';
  noProducts: boolean = false;
  modifiers: any;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private loadingService: LoadingService,
    private categoryService: CategoryService,
    public dialog: MatDialog,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.catName = params.get('name');
    });
    this.loadProducts();
    this.getCategory();
    this.getModifiers();
  }

  openDialog(data: any): void {
    const dialogRef = this.dialog.open(ModifiersComponent, {
      width: '600px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  loadProducts(): void {
    this.loader = true;
    this.productService.getProducts().subscribe(
      (res: any) => {
        this.allProducts = res;
        console.log("this.allProducts", this.allProducts)
        this.filteredProducts = [...this.allProducts];
        if (this.catName) {
          this.showProducts(this.catName);
        }
        this.noProducts = this.filteredProducts.length === 0;
      },
      (error) => {
        console.error("Error fetching products:", error);
        this.noProducts = true;
      },
      () => {
        this.loader = false;
      }
    );
  }

  showProducts(category: any): void {
    if (category === 'All' || !category) {
      this.activeCategory = 'All';
      this.filteredProducts = [...this.allProducts];
    } else {
      this.activeCategory = category;
      this.filteredProducts = this.allProducts.filter(product =>product.categoryParents && product.categoryParents[0]?.name  === category
      );
    }
    this.noProducts = this.filteredProducts.length === 0;
  }

  getCategory(): void {
    this.categoryService.getCategory().subscribe((res: any) => {
      this.categories = res;
    });
  }

  addProduct(data: any): void {
    let filtermodifier = this.modifiers.filter((i: any) => i?.productId?._id == data._id)
    if (filtermodifier.length > 0) {
      this.openModifierModal(data, filtermodifier);
    } else {
      this.cartService.addToCart(data);
    }
  }

  openModifierModal(product: any, modifiers: any[]): void {
    const dialogRef = this.dialog.open(ModifiersComponent, {
      data: { product, modifiers },
      width: '50%',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  getShortDescription(description: string | undefined, limit: number): string {
    if (!description) return '';
    const words = description.split(' ');
    return words.length > limit
      ? words.slice(0, limit).join(' ') + '...'
      : description;
  }

  getModifiers() {
    this.productService.getModierByUserId().subscribe({
      next: (res: any) => {
        this.modifiers = res;
      }, error: (error: any) => {
        console.log("getting error :", error)
      }
    })
  }

}
