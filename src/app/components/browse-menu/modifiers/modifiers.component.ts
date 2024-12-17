import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddRequestComponent } from '../add-request/add-request.component';

@Component({
  selector: 'app-modifiers',
  templateUrl: './modifiers.component.html',
  styleUrls: ['./modifiers.component.css']
})
export class ModifiersComponent {
    constructor(public dialog: MatDialog) {}
  
    openDialog() {
      const dialogRef = this.dialog.open(AddRequestComponent, {
        width: '600px',
        maxWidth: '95vw',
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }
  vegetableToppings = [
    'Cheese',
    'Green peppers',
    'Tomato',
    'Mushrooms',
    'Sweetcorn',
    'Jalapenos',
    'Olives',
    'Pineapples',
    'Onions',
  ];

  meatToppings = [
    'Chicken',
    'Beef',
    'Salami',
    'Pepperoni',
    'Chicken Tikka',
    'Fish',
  ];

  seafoodToppings = ['Tuna', 'Anchovies', 'Prawns'];
}
