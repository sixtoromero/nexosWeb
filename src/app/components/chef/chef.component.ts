import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService, Message } from 'primeng/api';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

//Servicios
import { ChefService } from '../../services/chef.service';
import { GeneralService } from '../../services/general.service';

//Modelos
import { CocineroModel } from '../../models/cocinero.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { finalize } from 'rxjs/operators';

import { Deserializable } from '../../models/deserializable.model';

@Component({
  selector: 'app-chef',
  templateUrl: './chef.component.html',
  styleUrls: ['./chef.component.scss'],
  providers: [ChefService, GeneralService, MessageService, ConfirmationService]
})
export class ChefComponent implements OnInit {

  msgs: Message[] = [];
  //model = new CocineroModel();
  //model: CocineroModel;// = new CocineroModel();
  chefs: CocineroModel[] = [];
  selectedChef = new CocineroModel();
  
  displayModalChef: boolean = false;
  isNew: boolean = true;

  public chefForm: FormGroup  = new FormGroup({});

  constructor(
      private fb: FormBuilder, 
      private _service: ChefService, 
      private _general: GeneralService,
      private confirmationService: ConfirmationService,
      private ngxService: NgxUiLoaderService) {
    this.chefForm = fb.group({
      IdCocinero: ['0', []],
      Nombre: ['', [Validators.required]],
      Apellido1: ['', [Validators.required]],
      Apellido2: ['', [Validators.required]]
    });
  }

  get f() {
    return this.chefForm.controls;
  }

  ngOnInit(): void {
    this.getChefAll();    
  }

  getChefAll() {
    this.ngxService.start();
    this._service.getChefAll()
    .pipe(finalize(() => this.ngxService.stop()))
    .subscribe(response => {
      if (response["IsSuccess"]) {
        this.chefs = response["Data"] as CocineroModel[];
      }
    }, error => {
      this._general.showError('Ha ocurrido un error inesperado.');
    });
  }

  processChef() {    

    if (this.isNew) {      
      this.saveChef();      
    } else {
      this.editChef();
    }
  }

  editChef() {
    //model.IdCocinero
    this.ngxService.start();
    const chefModel = this.prepareSave();
    this._service.update(chefModel)
    .pipe(
      finalize(() => this.ngxService.stop()))
    .subscribe(response => {
      if (response["IsSuccess"]){
        this.clear();
        this._general.showSuccess('Registrado actualizado exitosamente');        
        this.getChefAll();
        this.isNew = true;
      } else {
        this._general.showError(`Ha ocurrido un error inesperado: ${response["Message"]}`);
      }
    }, error => {
      this._general.showError('Ha ocurrido un error inesperado.');
    });
  }

  saveChef() {
    
    this.ngxService.start();
    
    const model = this.prepareSave();

    this._service.insert(model)
      .pipe(finalize(() => this.ngxService.stop()))
      .subscribe(response => {
        if (response["IsSuccess"]){
          this.clear();
          this._general.showSuccess('Registrado exitosamente');
          this.getChefAll();
        } else {
          this._general.showError(`Ha ocurrido un error inesperado: ${response["Message"]}`)  
        }
      }, error => {
        this._general.showError('Ha ocurrido un error inesperado.');
    });
  }

  editModal(chef: CocineroModel){
    //this.model = chef;

    this.f.IdCocinero.setValue(chef.IdCocinero);
    this.f.Nombre.setValue(chef.Nombre);
    this.f.Apellido1.setValue(chef.Apellido1);
    this.f.Apellido2.setValue(chef.Apellido2);

    this.isNew = false;
    this.displayModalChef = true;

  }

  deleteChef(chef: CocineroModel) {
    this.confirmationService.confirm({
      message: `Realmente desea eliminar el cocinero ${chef.Nombre} ${chef.Apellido1} ${chef.Apellido2}?`,
      header: 'Eliminar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ngxService.start();
        this._service.delete(chef.IdCocinero)
        .pipe(finalize(() => this.ngxService.stop()))
        .subscribe(response => {
          if (response["IsSuccess"]){
            this.displayModalChef = false;
            this._general.showSuccess('Eliminado exitosamente')
            this.getChefAll();
          } else {
            this._general.showError(`Ha ocurrido un error inesperado: ${response["Message"]}`)  
          }
        }, error => {
          this._general.showError('Ha ocurrido un error inesperado.');
        });
      }
    });
  }

  private prepareSave(): CocineroModel {
    return new CocineroModel().deserialize(this.chefForm.value);
  }

  clear(){
    this.displayModalChef = false;
    this.isNew = false;
    this.chefForm.reset();
  }

}
