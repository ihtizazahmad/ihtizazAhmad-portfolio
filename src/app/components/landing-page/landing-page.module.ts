import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingPageRoutingModule } from './landing-page-routing.module';
import { JumbotronComponent } from './jumbotron/jumbotron.component';
import { HomeComponent } from './home/home.component';
import { CategoriesComponent } from './categories/categories.component';
import { AdvertisementComponent } from './advertisement/advertisement.component';
import { StatsComponent } from './stats/stats.component';


@NgModule({
  declarations: [
    JumbotronComponent,
    HomeComponent,
    CategoriesComponent,
    AdvertisementComponent,
    StatsComponent
  ],
  imports: [
    CommonModule,
    LandingPageRoutingModule
  ]
})
export class LandingPageModule { }
