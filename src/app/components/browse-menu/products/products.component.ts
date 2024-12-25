import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModifiersComponent } from '../modifiers/modifiers.component';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { CategoryService } from 'src/app/services/category.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  loader: boolean = true;
  businessId = '674ba2d30e062b07414d6704';
  category_id: any;
  filteredProducts: any[] = [];  // Store the filtered products
  products: any[] = [];
  categories: any[] = [];
  activeCategory: string = 'All'; // To track the active category

  constructor(
    private router: Router,
    private productService: ProductService,
    private loadingService: LoadingService,
    private categoryService: CategoryService,
    public dialog: MatDialog,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.showProducts();
    this.getCategory();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ModifiersComponent, {
      width: '600px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  showProducts(category: string = 'All'): void {
    this.activeCategory = category;
    this.productService.getProducts().subscribe((res: any) => {
      this.products = res.filter((product: any) =>
        category === 'All' ? product.userId?._id === this.businessId : 
      (product.userId?._id === this.businessId && product.categoryId.name === category)
      );
    });
  }
  
  getCategory(): void {
    this.categoryService.getCategory().subscribe((res: any) => {
      this.categories = res.filter((category: any) =>
        category.userId?._id === this.businessId
      );
      console.log("Filtered categories:", this.categories);
    });
  }
  
}
