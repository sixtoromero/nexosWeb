import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService, Message } from 'primeng/api';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

//Servicios
import { TableService } from '../../services/table.service';
import { GeneralService } from '../../services/general.service';

//Modelos
import { MesaModel } from '../../models/mesa.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [TableService, GeneralService, MessageService, ConfirmationService]
})
export class TableComponent implements OnInit {

  msgs: Message[] = [];
  tables: MesaModel[] = [];
  selectedTables = new MesaModel();
  
  isNew: boolean = true;
  displayModalTable: boolean = false;

  public myForm: FormGroup  = new FormGroup({});

  constructor(
      private fb: FormBuilder, 
      private _service: TableService, 
      private _general: GeneralService,
      private confirmationService: ConfirmationService,
      private ngxService: NgxUiLoaderService) {

    this.myForm = fb.group({
      IdMesa: ['', []],
      NumMaxComensa: ['', [Validators.required]],
      Ubicacion: ['', [Validators.required]]
    });

  }

  get f() {
    return this.myForm.controls;
  }

  ngOnInit(): void {
    this.getTableAll();    
  }

  getTableAll() {
    this.ngxService.start();
    this._service.getTableAll()
    .pipe(finalize(() => this.ngxService.stop()))
    .subscribe(response => {
      if (response["IsSuccess"]) {
        this.tables = response["Data"] as MesaModel[];
      }
    }, error => {
      this._general.showError('Ha ocurrido un error inesperado.');
    });
  }

  processTable() {
    if (this.isNew === true) {
      this.saveTable();
    } else {
      this.editTable();
    }
  }

  editTable() {
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
        this.getTableAll();
      } else {
        this._general.showError(`Ha ocurrido un error inesperado: ${response["Message"]}`);
      }
    }, error => {
      this._general.showError('Ha ocurrido un error inesperado.');
    });
  }

  saveTable() {
    
    this.ngxService.start();
    const model = this.prepareSave();

    this._service.insert(model)
    .pipe(finalize(() => this.ngxService.stop()))
    .subscribe(response => {
      if (response["IsSuccess"]){        
        this.clear();
        this._general.showSuccess('Registrado exitosamente');        
        this.getTableAll();
      } else {
        this._general.showError(`Ha ocurrido un error inesperado: ${response["Message"]}`);
      }
    }, error => {
      this._general.showError('Ha ocurrido un error inesperado.');
    });
    
  }

  editModal(model: MesaModel){

    this.f.IdMesa.setValue(model.IdMesa);
    this.f.NumMaxComensa.setValue(model.NumMaxComensa);
    this.f.Ubicacion.setValue(model.Ubicacion);    

    this.isNew = false;
    this.displayModalTable = true;
  }

  deleteTable(item: MesaModel) {
    this.confirmationService.confirm({
      message: `Realmente desea eliminar el registro seleccionado ${item.NumMaxComensa} ${item.Ubicacion}?`,
      header: 'Eliminar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ngxService.start();
        this._service.delete(item.IdMesa)
        .pipe(finalize(() => this.ngxService.stop()))
        .subscribe(response => {
          if (response["IsSuccess"]){
            this.displayModalTable = false;
            this._general.showSuccess('Eliminado exitosamente');
            this.getTableAll();
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
    this.displayModalTable = false;
    this.isNew = false;
    this.myForm.reset();
  }

  private prepareSave(): MesaModel {
    return new MesaModel().deserialize(this.myForm.value);
  }

}
