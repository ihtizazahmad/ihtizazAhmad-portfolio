import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent {

  constructor(private router:Router){}
  gotobrowsermenu(){
    this.router.navigate(['/browse-menu'])
  }
  
  categories = [
    { img: '../../../../assets/burgers.png' ,
      name:'Burgers & Fast food',
      totalitems:'21'
    },
    { img: '../../../../assets/salad.png' ,
      name:'Salads',
      totalitems:'32'
    },
    { img: '../../../../assets/pasta.png' ,
      name:'Pasta & Casuals',
      totalitems:'4'
    },
    { img: '../../../../assets/pizza.png' ,
      name:'Pizza',
      totalitems:'32'
    },
    { img: '../../../../assets/breakfast.png' ,
      name:'Breakfast',
      totalitems:'13'
    },
    { img: '../../../../assets/soup.png' ,
      name:'Soups',
      totalitems:'22'
    },
    { img: '../../../../assets/burgers.png' ,
      name:'Burgers & Fast food',
      totalitems:'21'
    },
    { img: '../../../../assets/salad.png' ,
      name:'Salads',
      totalitems:'32'
    }
  ]

}
