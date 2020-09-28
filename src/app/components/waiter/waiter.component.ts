import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService, Message } from 'primeng/api';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

//Servicios
import { WaiterService } from '../../services/waiter.service';
import { GeneralService } from '../../services/general.service';

//Modelos
import { CamareroModel } from '../../models/camarero.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-waiter',
  templateUrl: './waiter.component.html',
  styleUrls: ['./waiter.component.scss'],
  providers: [WaiterService, GeneralService, MessageService, ConfirmationService]
})
export class WaiterComponent implements OnInit {

  msgs: Message[] = [];
  //model = new CamareroModel();
  waiters: CamareroModel[] = [];
  selectedWaiters = new CamareroModel();
  
  displayModalWaiter: boolean = false;
  isNew: boolean = true;

  public myForm: FormGroup  = new FormGroup({});


  constructor(
      private fb: FormBuilder, 
      private _service: WaiterService, 
      private _general: GeneralService,
      private confirmationService: ConfirmationService,
      private ngxService: NgxUiLoaderService) {
    this.myForm = fb.group({
      IdCamarero: ['', []],
      Nombre: ['', [Validators.required]],
      Apellido1: ['', [Validators.required]],
      Apellido2: ['', [Validators.required]]
    });
  }

  get f() {
    return this.myForm.controls;
  }

  ngOnInit(): void {
    this.getWaiterAll();    
  }

  getWaiterAll() {
    this.ngxService.start();
    this._service.getWaiterAll()
    .pipe(finalize(() => this.ngxService.stop()))
    .subscribe(response => {
      if (response["IsSuccess"]) {
        this.waiters = response["Data"] as CamareroModel[];
      }
    }, error => {
      this._general.showError('Ha ocurrido un error inesperado.');
    });
  }

  processWaiter() {
    
    if (this.isNew === true) {
      this.saveWaiter();      
    } else {
      this.editWaiter();
    }
  }

  editWaiter() {
    //model.IdCamarero
    this.ngxService.start();
    const model = this.prepareSave();
    this._service.update(model)
    .pipe(
      finalize(() => this.ngxService.stop()))
    .subscribe(response => {
      if (response["IsSuccess"]){
        this.clear();
        this._general.showSuccess('Registrado actualizado exitosamente');        
        this.getWaiterAll();
      } else {
        this._general.showError(`Ha ocurrido un error inesperado: ${response["Message"]}`);
      }
    }, error => {
      this._general.showError('Ha ocurrido un error inesperado.');
    });
  }

  saveWaiter() {
    this.ngxService.start();
    const model = this.prepareSave();
    this._service.insert(model)
    .pipe(finalize(() => this.ngxService.stop()))
    .subscribe(response => {
      if (response["IsSuccess"]){
        this.clear();
        this._general.showSuccess('Registrado exitosamente');
        this.getWaiterAll();
      } else {
        this._general.showError(`Ha ocurrido un error inesperado: ${response["Message"]}`)  
      }
    }, error => {
      this._general.showError('Ha ocurrido un error inesperado.');
    });
  }

  editModal(model: CamareroModel){

    this.f.IdCamarero.setValue(model.IdCamarero);
    this.f.Nombre.setValue(model.Nombre);
    this.f.Apellido1.setValue(model.Apellido1);
    this.f.Apellido2.setValue(model.Apellido2);

    this.isNew = false;    
    this.displayModalWaiter = true;

  }

  deleteWaiter(chef: CamareroModel) {
    this.confirmationService.confirm({
      message: `Realmente desea eliminar el Camarero ${chef.Nombre} ${chef.Apellido1} ${chef.Apellido2}?`,
      header: 'Eliminar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ngxService.start();
        this._service.delete(chef.IdCamarero)
        .pipe(finalize(() => this.ngxService.stop()))
        .subscribe(response => {
          if (response["IsSuccess"]){
            this._general.showSuccess('Eliminado exitosamente')
            this.getWaiterAll();
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
    this.displayModalWaiter = false;    
    this.isNew = true;
    this.myForm.reset();
  }

  private prepareSave(): CamareroModel {
    return new CamareroModel().deserialize(this.myForm.value);
  }


}
