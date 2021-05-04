import { Routes, RouterModule, Router } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

const APP_ROUTES: Routes = [  

    {path: 'home', component: HomeComponent},
    //{path: 'chef', component: ChefComponent},    

    {path: '', redirectTo: '/home', pathMatch: 'full'}
  ];

//export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, {useHash: true});
export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);