import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { finalize } from 'rxjs/operators';
import { GeneralService } from 'src/app/services/general.service';

import { CustomerService } from 'src/app/services/customer.service';
import { ProjectService } from 'src/app/services/project.service';
import { CustomerModel } from 'src/app/models/customer.model';
import { ProjectModel } from 'src/app/models/project.model';
import { InfoProjectModel } from 'src/app/models/infoproject.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  providers: [CustomerService, ProjectService, GeneralService, MessageService, ConfirmationService]
})
export class HomeComponent implements OnInit {

  msgs: Message[] = [];

  //publiInfoProjects: InfoProjectModel[] = [];
  results: InfoProjectModel[] = [];  

  selectInfoPro: InfoProjectModel;

  displayModal: boolean = false;
  isNew: boolean = true;
  
  public myForm: FormGroup  = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,  
    private projectService: ProjectService,
    private general: GeneralService,    
    private confirmationService: ConfirmationService,
    private ngxService: NgxUiLoaderService,
    private messageService: MessageService
  ) { 

    this.myForm = fb.group({
      Type: ['', [Validators.required]],
      SenderId: ['', [Validators.required]],
      AddresseeId: ['', [Validators.required]],
      Subject: ['', [Validators.required]],
      Body: ['', [Validators.required]]      
    });

  }

  ngOnInit(): void {    
    this.getProjectInfoAsync();    
  }

  get f() {
    return this.myForm.controls;
  }

  insertOrupdate(){
    if (this.isNew){
      this.insert();
    } else {
      this.update();
    }
  }

  insert() {
    this.ngxService.start();
    const model = this.prepareSave();    
    model.Id = 0;
    this.customerService.insert(model)
    .pipe(finalize(() => this.ngxService.stop()))
    .subscribe(response => {
      if (response["IsSuccess"]){        
        this.displayModal = false; 
        this.getProjectInfoAsync();
        this.general.showSuccess('registrado exitosamente');
      } else {
        this.general.showError(`Ha ocurrido un error inesperado: ${response["Message"]}`);
      }
    }, error => {
      this.general.showError('Ha ocurrido un error inesperado.');
    });
  }

  update() {
    this.ngxService.start();
    const model = this.prepareSave();    
    this.customerService.update(model)
    .pipe(finalize(() => this.ngxService.stop()))
    .subscribe(response => {
      if (response["IsSuccess"]){        
        this.displayModal = false;         
        this.getProjectInfoAsync();
        this.general.showSuccess('Actualizado exitosamente');        
      } else {
        this.general.showError(`Ha ocurrido un error inesperado: ${response["Message"]}`);
      }
    }, error => {
      this.general.showError('Ha ocurrido un error inesperado.');
    });
  }

  getProjectInfoAsync() {
    this.ngxService.start();
    this.projectService.getProjectInfo()
    .pipe(finalize(() => this.ngxService.stop()))
    .subscribe(response => {
      console.log('Respuesta', response);
      if (response["IsSuccess"]) {                
        let result: ProjectModel;        
        result = response["Data"] as ProjectModel;// InfoProjectModel[];
        this.results = result.InfoProjects;
      }
    }, error => {
      this.ngxService.stop()
      this.general.showError('Ha ocurrido un error inesperado.');
    });
  }

  deleteCorrespondence(Id: number){
    this.ngxService.start();
    this.customerService.delete(Id)
    .pipe(finalize(() => this.ngxService.stop()))
    .subscribe(response => {      
      if (response["IsSuccess"]) {        
        this.general.showSuccess("Se ha eliminado el registro correctamente.");
        this.getProjectInfoAsync();
      }
    }, error => {
      this.ngxService.stop()
      this.general.showError('Ha ocurrido un error inesperado.');
    });
  }

  confirmDelete(Id: number) {
    this.confirmationService.confirm({
        message: 'Está seguro de eliminar el registro seleccionado?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.deleteCorrespondence(Id);
        }
    });
  }

  editModal(Id: number) {

    // this.f.Type.setValue(item.Names);
    // this.f.SenderId.setValue(item.Surnames);
    // this.f.AddresseeId.setValue(item.Email);
    // this.f.Subject.setValue(item.Address);
    // this.f.Body.setValue(item.Phone);

    // this.selectInfoPro = item;
    // this.displayModal = true;
    // this.isNew = false;

  }

  private prepareSave(): CustomerModel {
    return new CustomerModel().deserialize(this.myForm.value);
  }



}
