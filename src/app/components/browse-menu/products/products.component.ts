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
  businessId = '674ba2d30e062b07414d6704';
  category_id: any;
  filteredProducts: any[] = []; 
  products: any[] = [];
  allProducts: any[] = [];
  categories: any[] = [];
  activeCategory: string = 'All'; 
  catName: any = '';
  noProducts: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private loadingService: LoadingService,
    private categoryService: CategoryService,
    public dialog: MatDialog,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.catName = params.get('name');
      console.log("getting cat name:", this.catName);
    });
    this.loadProducts();
    this.getCategory();
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
        console.log("getting all products by user id:", res);
        this.allProducts = res;
        this.filteredProducts = [...this.allProducts];

        if (this.catName) {
          this.showProducts(this.catName); // Filter products after loading
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
    console.log("Category selected:", category);
    if (category === 'All' || !category) {
      this.activeCategory = 'All';
      this.filteredProducts = [...this.allProducts];
    } else {
      this.activeCategory = category;
      this.filteredProducts = this.allProducts.filter(product =>
        product.categoryId && product.categoryId[0]?.name === category
      );
    }

    this.noProducts = this.filteredProducts.length === 0;
    console.log("Filtered products:", this.filteredProducts);
  }

  getCategory(): void {
    this.categoryService.getSubCategories().subscribe((res: any) => {
      this.categories = res;
      console.log("Filtered categories:", this.categories);
    });
  }

  addProduct(data: any): void {
    this.cartService.addToCart(data);
  }

  getShortDescription(description: string | undefined, limit: number): string {
    if (!description) return '';
    const words = description.split(' ');
    return words.length > limit 
      ? words.slice(0, limit).join(' ') + '...' 
      : description;
  }
  
}
