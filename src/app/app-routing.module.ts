import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ChefComponent } from './components/chef/chef.component';
import { WaiterComponent } from './components/waiter/waiter.component';
import { CustomerComponent } from './components/customer/customer.component';
import { TableComponent } from './components/table/table.component';
import { BillComponent } from './components/bill/bill.component';
//import { } from '../app/'

const routes: Routes = [  
  {path: 'home', component: HomeComponent},
  {path: 'chef', component: ChefComponent},
  {path: 'waiter', component: WaiterComponent},
  {path: 'customer', component: CustomerComponent},
  {path: 'table', component: TableComponent},
  {path: 'bill', component: BillComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
