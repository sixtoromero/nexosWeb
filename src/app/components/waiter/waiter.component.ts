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
  model = new CamareroModel();
  waiters: CamareroModel[] = [];
  selectedWaiters = new CamareroModel();
  
  displayModalWaiter: boolean = false;

  public myForm: FormGroup  = new FormGroup({});


  constructor(
      private fb: FormBuilder, 
      private _service: WaiterService, 
      private _general: GeneralService,
      private confirmationService: ConfirmationService,
      private ngxService: NgxUiLoaderService) {
    this.myForm = fb.group({
      nombre: ['', [Validators.required]],
      apellido1: ['', [Validators.required]],
      apellido2: ['', [Validators.required]]
    });
  }

  get f() {
    return this.myForm.controls;
  }

  ngOnInit(): void {
    this.getWaiterAll();
    this.model.IdCamarero = 0;
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
    if (this.model.IdCamarero === 0) {
      this.saveWaiter();      
    } else {
      this.editWaiter();
    }
  }

  editWaiter() {
    //model.IdCamarero
    this.ngxService.start();
    this._service.update(this.model)
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
    this._service.insert(this.model)
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

  editModal(chef: CamareroModel){
    this.model = chef;
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
    this.model = new CamareroModel();
  }

}
