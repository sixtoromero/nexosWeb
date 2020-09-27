import { Routes, RouterModule, Router } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ChefComponent } from './components/chef/chef.component';
import { WaiterComponent } from './components/waiter/waiter.component';
import { CustomerComponent } from './components/customer/customer.component';
import { TableComponent } from './components/table/table.component';
import { BillComponent } from './components/bill/bill.component';

const APP_ROUTES: Routes = [  

    {path: 'home', component: HomeComponent},
    {path: 'chef', component: ChefComponent},
    {path: 'waiter', component: WaiterComponent},
    {path: 'customer', component: CustomerComponent},
    {path: 'table', component: TableComponent},
    {path: 'bill', component: BillComponent},

    {path: '', redirectTo: '/home', pathMatch: 'full'}
  ];

//export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, {useHash: true});
export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);