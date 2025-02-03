import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  allCategories: any[] = [];
  loader: boolean = false;
  constructor(
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadSubCategories();
  }

  private loadSubCategories() {
    this.loader = true;
    this.categoryService.getSubCategories().subscribe(
      (categories) => {
        this.allCategories = categories;
        this.loader = false;
      },
      (error) => {
        console.error('Error fetching subCategories', error);
        this.loader = false;
      }
    );
  }

  loadProdcutByCategory(name: any) {
    if (name) {
      this.router.navigate(['/browse-menu/products', name]);
    }
  }
}
