import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingPageRoutingModule } from './landing-page-routing.module';
import { HomeComponent } from './home/home.component';
import { CategoriesComponent } from './categories/categories.component';
import { AdvertisementComponent } from './advertisement/advertisement.component';
import { StatsComponent } from './stats/stats.component';
import { JumbotronComponent } from './jumbotron/jumbotron.component';
import { CategoryService } from 'src/app/services/category.service';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    HomeComponent,
    CategoriesComponent,
    AdvertisementComponent,
    StatsComponent
  ],
  imports: [
    CommonModule,
    LandingPageRoutingModule,
    JumbotronComponent
  ],
  providers:[
    HttpClientModule,
    CategoryService,
  ]
})
export class LandingPageModule { }
