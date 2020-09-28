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
  //model = new ClienteModel();
  customers: ClienteModel[] = [];  
  selectedCustomer = new ClienteModel();
  isNew: boolean = true;

  public myForm: FormGroup  = new FormGroup({});

  constructor(
    private fb: FormBuilder, 
    private _service: CustomerService, 
    private _general: GeneralService,
    private confirmationService: ConfirmationService,
    private ngxService: NgxUiLoaderService) {
    this.myForm = fb.group({
      IdCliente: ['', []],
      Nombre: ['', [Validators.required]],
      Apellido1: ['', [Validators.required]],
      Apellido2: ['', [Validators.required]],
      Observaciones: ['', []]
    });
  }

  get f() {
    return this.myForm.controls;
  }

  ngOnInit(): void {
    this.getCustomerAll();
    //this.model.IdCliente = 0;
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
    if (this.isNew === true) {
      this.saveCustomer();      
    } else {
      this.editcustomer();
    }
  }

  editcustomer() {
    //model.IdCocinero
    this.ngxService.start();
    const model = this.prepareSave();
    this._service.update(model)
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
    const model = this.prepareSave();
    this._service.insert(model)
    .pipe(finalize(() => this.ngxService.stop()))
    .subscribe(response => {
      if (response["IsSuccess"]) {
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

  editModal(model: ClienteModel){
    //this.model = customer;
    
    this.f.IdCliente.setValue(model.IdCliente);
    this.f.Nombre.setValue(model.Nombre);
    this.f.Apellido1.setValue(model.Apellido1);
    this.f.Apellido2.setValue(model.Apellido2);
    this.f.Observaciones.setValue(model.Observaciones);

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
    this.isNew = false;
    this.myForm.reset();
  }

  private prepareSave(): ClienteModel {
    return new ClienteModel().deserialize(this.myForm.value);
  }



}
