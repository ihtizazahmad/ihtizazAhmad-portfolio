import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:'', redirectTo:'home', pathMatch:'full'},
  { path: 'home', loadChildren: () => import('./components/landing-page/landing-page.module').then(m => m.LandingPageModule) },
  { path: 'browse-menu', loadChildren: () => import('./components/browse-menu/browse-menu.module').then(m => m.BrowseMenuModule) },
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
