import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'watching', loadChildren: './watching/watching.module#WatchingPageModule' },
  { path: 'completed', loadChildren: './completed/completed.module#CompletedPageModule' },
  { path: 'yet-to-watch', loadChildren: './yet-to-watch/yet-to-watch.module#YetToWatchPageModule' },
  { path: 'top10', loadChildren: './top10/top10.module#Top10PageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
