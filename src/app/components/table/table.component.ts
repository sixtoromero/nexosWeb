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
  model = new MesaModel();
  tables: MesaModel[] = [];
  selectedTables = new MesaModel();
  
  displayModalTable: boolean = false;

  public myForm: FormGroup  = new FormGroup({});

  constructor(
      private fb: FormBuilder, 
      private _service: TableService, 
      private _general: GeneralService,
      private confirmationService: ConfirmationService,
      private ngxService: NgxUiLoaderService) {
    this.myForm = fb.group({
      numMaxComensa: ['', [Validators.required]],
      ubicacion: ['', [Validators.required]]
    });
  }

  get f() {
    return this.myForm.controls;
  }

  ngOnInit(): void {
    this.getTableAll();
    this.model.IdMesa = 0;
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
    if (this.model.IdMesa === 0) {
      this.saveTable();      
    } else {
      this.editTable();
    }
  }

  editTable() {
    //model.IdCocinero
    this.ngxService.start();
    this._service.update(this.model)
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
    //this.ngxService.start();
    this.clear();
    
    //this.getTableAll();

    //this.ngxService.stop()
    /*
    this._service.insert(this.model)
    .pipe(finalize(() => this.ngxService.stop()))
    .subscribe(response => {
      if (response["IsSuccess"]){        
        this.clear();
        this._general.showSuccess('Registrado exitosamente');        
        this.getTableAll();
      } else {
        this._general.showError(`Ha ocurrido un error inesperado: ${response["Message"]}`)  
      }
    }, error => {
      this._general.showError('Ha ocurrido un error inesperado.');
    });
    */
  }

  editModal(chef: MesaModel){
    this.model = chef;
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
    this.model = new MesaModel();
  }

}
