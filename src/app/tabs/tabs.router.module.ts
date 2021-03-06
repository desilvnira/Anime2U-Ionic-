import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { NgModule } from '@angular/core';

// Provides routing functionality which calls the specific paths of the tab that is selected and 
// diplays the relevant data at the page.
const routes: Routes = [
    {
        path: '',
        component: TabsPage,
        children:[
            { path: 'profile', loadChildren: '../profile/profile.module#ProfilePageModule' },
            { path: 'news', loadChildren: '../news/news.module#NewsPageModule' },
            { path: 'search', loadChildren: '../search/search.module#SearchPageModule' },
            // Changes the url and changes to one of the children
        ]
    }   
];
    
      @NgModule({
        imports: [
          RouterModule.forChild(routes)
        ],
        exports: [RouterModule]
      })
      export class TabsRoutingModule { }
