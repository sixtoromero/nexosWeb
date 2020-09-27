import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService, Message } from 'primeng/api';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ClienteModel } from '../../models/cliente.model';
//Servicios
import { GeneralService } from 'src/app/services/general.service';
import { CustomerService } from 'src/app/services/customer.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
  providers: [CustomerService, GeneralService, MessageService, ConfirmationService]
})
export class CustomerComponent implements OnInit {

  displayModalCustomer: boolean;
  msgs: Message[] = [];
  model = new ClienteModel();
  customers: ClienteModel[] = [];  
  selectedCustomer = new ClienteModel();

  public myForm: FormGroup  = new FormGroup({});

  constructor(
    private fb: FormBuilder, 
    private _service: CustomerService, 
    private _general: GeneralService,
    private confirmationService: ConfirmationService,
    private ngxService: NgxUiLoaderService) {
    this.myForm = fb.group({
      nombre: ['', [Validators.required]],
      apellido1: ['', [Validators.required]],
      apellido2: ['', [Validators.required]],
      observaciones: ['', []]
    });
  }

  get f() {
    return this.myForm.controls;
  }

  ngOnInit(): void {
    this.getCustomerAll();
    this.model.IdCliente = 0;
  }

  getCustomerAll() {
    this.ngxService.start();
    this._service.getCustomerAll()
    .pipe(finalize(() => this.ngxService.stop()))
    .subscribe(response => {
      if (response["IsSuccess"]) {
        this.customers = response["Data"] as ClienteModel[];
      }
    }, error => {
      this._general.showError('Ha ocurrido un error inesperado.');
    });
  }

  processCustomer() {
    if (this.model.IdCliente === 0) {
      this.saveCustomer();      
    } else {
      this.editcustomer();
    }
  }

  editcustomer() {
    //model.IdCocinero
    this.ngxService.start();
    this._service.update(this.model)
    .pipe(
      finalize(() => this.ngxService.stop()))
    .subscribe(response => {
      if (response["IsSuccess"]){
        this.clear();
        this._general.showSuccess('Registrado actualizado exitosamente');        
        this.getCustomerAll();
      } else {
        this._general.showError(`Ha ocurrido un error inesperado: ${response["Message"]}`);
      }
    }, error => {
      this._general.showError('Ha ocurrido un error inesperado.');
    });
  }

  saveCustomer() {
    this.ngxService.start();
    this._service.insert(this.model)
    .pipe(finalize(() => this.ngxService.stop()))
    .subscribe(response => {
      if (response["IsSuccess"]){
        this.clear();
        this._general.showSuccess('Registrado exitosamente');
        this.getCustomerAll();
      } else {
        
        this._general.showError(`Ha ocurrido un error inesperado: ${response["Message"]}`);
      }
    }, error => {
      this._general.showError('Ha ocurrido un error inesperado.');
    });
  }

  editModal(customer: ClienteModel){
    this.model = customer;
    this.displayModalCustomer = true;
  }

  deleteCustomer(customer: ClienteModel) {
    this.confirmationService.confirm({
      message: `Realmente desea eliminar el cocinero ${customer.Nombre} ${customer.Apellido1} ${customer.Apellido2}?`,
      header: 'Eliminar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ngxService.start();
        this._service.delete(customer.IdCliente)
        .pipe(finalize(() => this.ngxService.stop()))
        .subscribe(response => {
          if (response["IsSuccess"]){
            this.displayModalCustomer = false;
            this._general.showSuccess('Eliminado exitosamente')
            this.getCustomerAll();
          } else {
            this._general.showError(`Ha ocurrido un error inesperado: ${response["Message"]}`)  
          }
        }, error => {
          this._general.showError('Ha ocurrido un error inesperado.');
        });
      }
    });
  }

  clear(){
    this.displayModalCustomer = false;
    this.model = new ClienteModel();
  }



}
