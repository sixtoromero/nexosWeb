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

@Component({
  selector: 'app-chef',
  templateUrl: './chef.component.html',
  styleUrls: ['./chef.component.scss'],
  providers: [ChefService, GeneralService, MessageService, ConfirmationService]
})
export class ChefComponent implements OnInit {

  msgs: Message[] = [];
  model = new CocineroModel();
  chefs: CocineroModel[] = [];
  selectedChef = new CocineroModel();
  
  displayModalChef: boolean = false;

  public chefForm: FormGroup  = new FormGroup({});

  constructor(
      private fb: FormBuilder, 
      private _service: ChefService, 
      private _general: GeneralService,
      private confirmationService: ConfirmationService,
      private ngxService: NgxUiLoaderService) {
    this.chefForm = fb.group({
      nombre: ['', [Validators.required]],
      apellido1: ['', [Validators.required]],
      apellido2: ['', [Validators.required]]
    });
  }

  get f() {
    return this.chefForm.controls;
  }

  ngOnInit(): void {
    this.getChefAll();
    this.model.IdCocinero = 0;
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
    if (this.model.IdCocinero === 0) {
      this.saveChef();      
    } else {
      this.editChef();
    }
  }

  editChef() {
    //model.IdCocinero
    this.ngxService.start();
    this._service.update(this.model)
    .pipe(
      finalize(() => this.ngxService.stop()))
    .subscribe(response => {
      if (response["IsSuccess"]){
        this.clear();
        this._general.showSuccess('Registrado actualizado exitosamente');        
        this.getChefAll();
      } else {
        this._general.showError(`Ha ocurrido un error inesperado: ${response["Message"]}`);
      }
    }, error => {
      this._general.showError('Ha ocurrido un error inesperado.');
    });
  }

  saveChef() {
    this.ngxService.start();
    this._service.insert(this.model)
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
    this.model = chef;
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

  clear(){
    this.displayModalChef = false;
    this.model = new CocineroModel();
  }

}
