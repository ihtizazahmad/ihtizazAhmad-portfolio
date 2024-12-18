import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';

const routes: Routes = [
  {path:'', redirectTo:'home', pathMatch:'full'},
  { path: 'home', loadChildren: () => import('./components/landing-page/landing-page.module').then(m => m.LandingPageModule) },
  { path: 'browse-menu', loadChildren: () => import('./components/browse-menu/browse-menu.module').then(m => m.BrowseMenuModule) },
  {path:'cart', component:CartComponent},
  {path:'checkout', component:CheckoutComponent}
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
