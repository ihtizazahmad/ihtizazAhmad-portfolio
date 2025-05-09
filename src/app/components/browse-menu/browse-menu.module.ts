import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrowseMenuRoutingModule } from './browse-menu-routing.module';
import { ProductsComponent } from './products/products.component';
import { JumbotronComponent } from '../landing-page/jumbotron/jumbotron.component';
import { ProductsJumbotronComponent } from './products-jumbotron/products-jumbotron.component';
import { ModifiersComponent } from './modifiers/modifiers.component';
import { MaterialModule } from 'src/app/material';
import { AddRequestComponent } from './add-request/add-request.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SharedService } from 'src/app/services/shared.service';
import { ProductService } from 'src/app/services/product.service';
import { CategoryService } from 'src/app/services/category.service';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ProductsComponent,
    ProductsJumbotronComponent,
    ModifiersComponent,
    AddRequestComponent,
  ],
  imports: [
    CommonModule,
    BrowseMenuRoutingModule,
    JumbotronComponent,
    MaterialModule,
    FormsModule,
    HttpClientModule,
  ],
  providers:[
    HttpClient,
    ProductService,
    CategoryService,
SharedService
  ]
})
export class BrowseMenuModule { }
