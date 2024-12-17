import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModifiersComponent } from '../modifiers/modifiers.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  constructor(public dialog: MatDialog) {}

  openDialog() {
    const dialogRef = this.dialog.open(ModifiersComponent, {
      width: '600px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

products=[
  {
    name:'Royal Cheese Burger with extra Fries',
    description:'1 McChicken™, 1 Big Mac™,  1 Royal Cheeseburger, 3 medium',
    price:'23.10'
  },
  {
    name:'The classics for 3',
    description:'1 McChicken™, 1 Big Mac™,  1 Royal Cheeseburger, 3 medium sized French Fries , 3 cold drinks',
    price:'23.10'
  },
  {
    name:'Royal Cheese Burger with extra Fries',
    description:'1 McChicken™, 1 Big Mac™,  1 Royal Cheeseburger, 3 medium',
    price:'23.10'
  },
  {
    name:'The classics for 3',
    description:'1 McChicken™, 1 Big Mac™,  1 Royal Cheeseburger, 3 medium sized French Fries , 3 cold drinks',
    price:'23.10'
  },
  {
    name:'Royal Cheese Burger with extra Fries',
    description:'1 McChicken™, 1 Big Mac™,  1 Royal Cheeseburger, 3 medium',
    price:'23.10'
  },
  {
    name:'The classics for 3',
    description:'1 McChicken™, 1 Big Mac™,  1 Royal Cheeseburger, 3 medium sized French Fries , 3 cold drinks',
    price:'23.10'
  },
]
}
