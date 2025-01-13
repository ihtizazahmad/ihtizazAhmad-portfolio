import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddRequestComponent } from '../add-request/add-request.component';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-modifiers',
  templateUrl: './modifiers.component.html',
  styleUrls: ['./modifiers.component.css']
})
export class ModifiersComponent implements OnInit{
  notes: string = '';
    constructor(public dialog: MatDialog, private dialogRef : MatDialogRef<ModifiersComponent>, @Inject(MAT_DIALOG_DATA) public data : any, private cartService : CartService) {
      this.initializeModifierState();
    }
  
    openDialog() {
      const dialogRef = this.dialog.open(AddRequestComponent, {
        width: '600px',
        maxWidth: '95vw',
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }


  ngOnInit(): void {
      console.log("first", this.data);
      // this.modifier = this.data?.modifier?.
  }
  initializeModifierState() {
    this.data.modifiers.forEach((modifier: any) => {
      modifier.categories.forEach((category: any) => {
        category.subcategories.forEach((subcategory: any) => {
          subcategory.quantity = 1; 
        });
      });
    });
  }

  increaseQuantity(subcategory: any) {
    if (subcategory.quantity < subcategory.totalQuantity) {
      subcategory.quantity++;
    }
  }

  decreaseQuantity(subcategory: any) {
    if (subcategory.quantity > 1) {
      subcategory.quantity--;
    }
  }

  Notinterested() {
    const result = this.data?.product;

    console.log(result);
    this.cartService.addToCart(result);
    this.uncheckAllCheckboxes();
    this.close();

  }

  uncheckAllCheckboxes() {
    this.data.modifiers.forEach((modifier: any) => {
        modifier.categories.forEach((category: any) => {
            category.subcategories.forEach((subcategory: any) => {
                subcategory.selected = false; 
            });
        });
    });
}
  close(): void {
    this.dialogRef.close();
  }

  apply() {
    this.logSelectedCheckboxes();
    this.uncheckAllCheckboxes();
  }
  logSelectedCheckboxes() {
    const finalArray: any[] = []; 
    this.data.modifiers.forEach((modifier: any) => {
      modifier.categories.forEach((category: any) => {
        const selectedSubcategories = category.subcategories.filter(
          (subcategory: any) => subcategory.selected
        );

        if (selectedSubcategories.length > 0) {
          const existingCategory = finalArray.find(
            (item) => item._id === category._id
          );

          const subcategoryObjects = selectedSubcategories.map(
            (subcategory: any) => ({
              name: subcategory.name,
              price: subcategory.price, 
              Selectedquantity: subcategory.quantity, 
              total: subcategory.price,
              _id: subcategory._id,
              totalQuantity: subcategory.totalQuantity,
            })
          );
          if (existingCategory) {
            existingCategory.subcategories.push(...subcategoryObjects);
          } else {
            finalArray.push({
              name: category.name,
              _id: category._id,
              subcategories: subcategoryObjects,
              notes: this.notes
            });
          }
        }
      });
    });
    const data = this.data.product;
    data.modifiers = finalArray;
    console.log("producct modifiers :", data)
    this.cartService;
    this.cartService.addToCart(data);

    this.close();
  }
}
