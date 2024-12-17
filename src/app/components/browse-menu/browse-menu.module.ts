import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrowseMenuRoutingModule } from './browse-menu-routing.module';
import { ProductsComponent } from './products/products.component';
import { JumbotronComponent } from '../landing-page/jumbotron/jumbotron.component';
import { ProductsJumbotronComponent } from './products-jumbotron/products-jumbotron.component';
import { ModifiersComponent } from './modifiers/modifiers.component';
import { MaterialModule } from 'src/app/material';
import { AddRequestComponent } from './add-request/add-request.component';


@NgModule({
  declarations: [
    ProductsComponent,
    ProductsJumbotronComponent,
    ModifiersComponent,
    AddRequestComponent
  ],
  imports: [
    CommonModule,
    BrowseMenuRoutingModule,
    JumbotronComponent,
    MaterialModule
  ]
})
export class BrowseMenuModule { }
