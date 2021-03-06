import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService, Message } from 'primeng/api';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

//Servicios
import { BillService } from '../../services/bill.service';
import { GeneralService } from '../../services/general.service';

//Modelos
import { ViewFacturaModel } from '../../models/viewfactura.model';

import { NgxUiLoaderService } from 'ngx-ui-loader';
import { finalize } from 'rxjs/operators';

import { Deserializable } from '../../models/deserializable.model';
import { ChefService } from 'src/app/services/chef.service';
import { CocineroModel } from 'src/app/models/cocinero.model';
import { CustomerService } from 'src/app/services/customer.service';
import { ClienteModel } from 'src/app/models/cliente.model';
import { CamareroModel } from 'src/app/models/camarero.model';
import { WaiterService } from 'src/app/services/waiter.service';
import { TableService } from 'src/app/services/table.service';
import { MesaModel } from 'src/app/models/mesa.model';
import { FacturaModel } from 'src/app/models/factura.model';
import { DetalleFacturaModel } from 'src/app/models/detallefactura.model';




@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss'],
  providers: [BillService, ChefService, CustomerService, WaiterService, GeneralService, MessageService, ConfirmationService]
})
export class BillComponent implements OnInit {
  
  msgs: Message[] = [];
  
  bills: ViewFacturaModel[] = [];
  selectedBills = new ViewFacturaModel();
  
  addDetBills: DetalleFacturaModel[] = [];
  selectedAddDetBills = new DetalleFacturaModel();

  displayModalBill: boolean = false;
  isNew: boolean = true;

  chefs: CocineroModel[] = [];
  chefDropbox: any[] = [];

  customers: ClienteModel[] = [];
  customerDropbox: any[] = [];

  waiters: CamareroModel[] = [];
  waitersDropbox: any[] = [];  

  tables: MesaModel[] = [];
  tableDropbox: any[] = [];

  public facForm: FormGroup  = new FormGroup({});

  constructor(
    private fb: FormBuilder, 
    private _service: BillService, 
    private _chefservice: ChefService, 
    private _customerservice: CustomerService,
    private _waiterservice: WaiterService, 
    private _tableservice: TableService,
    private _general: GeneralService,    
    private confirmationService: ConfirmationService,
    private ngxService: NgxUiLoaderService) {
  
      this.facForm = fb.group({
        IdCocinero: ['', [Validators.required]],
        IdCliente: ['', [Validators.required]],
        IdCamarero: ['', [Validators.required]],
        IdMesa: ['', [Validators.required]],
        Plato: ['', [Validators.required]],
        Importe: ['', [Validators.required]]
      });
  }

  get f() {
    return this.facForm.controls;
  }

  ngOnInit(): void {
    this.getViewFacetura();
    this.getChefAll();
    this.getCustomerAll();
    this.getWaiterAll();
    this.getTableAll();    

  }

  getViewFacetura() {
    this.ngxService.start();
    this._service.getViewFactura()
    .pipe(finalize(() => this.ngxService.stop()))
    .subscribe(response => {
      if (response["IsSuccess"]) {
        this.bills = response["Data"] as ViewFacturaModel[];
      }
    }, error => {
      this._general.showError('Ha ocurrido un error inesperado.');
    });
  }

  getChefAll() {
    this.ngxService.start();
    this._chefservice.getChefAll()
    .pipe(finalize(() => this.ngxService.stop()))
    .subscribe(response => {
      if (response["IsSuccess"]) {
        this.chefs = response["Data"] as CocineroModel[];
        this.chefs.map(item => {
          this.chefDropbox.push({ label: `${item.Nombre} ${item.Apellido1} ${item.Apellido2}` , value: item.IdCocinero });
        });
      }
    }, error => {
      this._general.showError('Ha ocurrido un error inesperado.');
    });
  }

  getCustomerAll() {
    this.ngxService.start();
    this._customerservice.getCustomerAll()
    .pipe(finalize(() => this.ngxService.stop()))
    .subscribe(response => {
      if (response["IsSuccess"]) {
        this.customers = response["Data"] as ClienteModel[];
        this.customers.map(item => {          
          this.customerDropbox.push({ label: `${item.Nombre} ${item.Apellido1} ${item.Apellido2}` , value: item.IdCliente });
        });
      }
    }, error => {
      this._general.showError('Ha ocurrido un error inesperado.');
    });
  }

  getTableAll() {
    this.ngxService.start();
    this._tableservice.getTableAll()
    .pipe(finalize(() => this.ngxService.stop()))
    .subscribe(response => {
      if (response["IsSuccess"]) {
        this.tables = response["Data"] as MesaModel[];
        this.tables.map(item => {
          this.tableDropbox.push({ label: `${item.Ubicacion} - ${item.NumMaxComensa}` , value: item.IdMesa });
        });
      }
    }, error => {
      this._general.showError('Ha ocurrido un error inesperado.');
    });
  }

  getWaiterAll() {
    this.ngxService.start();
    this._waiterservice.getWaiterAll()
    .pipe(finalize(() => this.ngxService.stop()))
    .subscribe(response => {
      if (response["IsSuccess"]) {
        this.waiters = response["Data"] as CamareroModel[];
        this.waiters.map(item => {
          this.waitersDropbox.push({ label: `${item.Nombre} ${item.Apellido1} ${item.Apellido2}` , value: item.IdCamarero });
        });
      }
    }, error => {
      this._general.showError('Ha ocurrido un error inesperado.');
    });
  }

  editModal(Id: number) {

  }

  deleteBill(item: DetalleFacturaModel) {
    //console.log(item);
    let index = this.addDetBills.indexOf(item);
    if (index !== -1) {
      this.addDetBills.splice(index, 1);
    }
    
  }

  clear() {
    this.displayModalBill = false;
    this.addDetBills = [];
    this.facForm.reset();
  }

  processBill(){

  }

  addItem() {
    debugger;
    let idetFac: DetalleFacturaModel = new DetalleFacturaModel();
    const iModel = this.prepareItemDetFac();

    console.log('iModel', iModel);
    idetFac.IdFactura = 0;
    idetFac.IdCocinero = iModel.IdCocinero;
    idetFac.Plato = iModel.Plato;
    idetFac.Importe = iModel.Importe;
    const nameChef = this.chefs.find(x => x.IdCocinero === iModel.IdCocinero);
    idetFac.Cocinero = `${nameChef.Nombre} ${nameChef.Apellido1} ${nameChef.Apellido2}`;

    this.addDetBills.push(idetFac);

    this.f.IdCocinero.setValue('');
    this.f.Plato.setValue('');
    this.f.Importe.setValue('');

  }

  createBill() {
    this.ngxService.start();
    let model: FacturaModel = new FacturaModel();
    let idet: DetalleFacturaModel = new DetalleFacturaModel();
    const iFac = this.prepareItemFac();
    
    model.DetalleFactura = new Array<DetalleFacturaModel>();
    

    model.IdFactura = 0;
    model.IdCliente = iFac.IdCliente;
    model.IdCamarero = iFac.IdCamarero;
    model.IdMesa = iFac.IdMesa;
    this.addDetBills.map(item => {
      idet = new DetalleFacturaModel();
      idet.IdCocinero = item.IdCocinero;
      idet.Plato = item.Plato;
      idet.Importe = item.Importe;
      model.DetalleFactura.push(idet);
    });

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

  private prepareItemDetFac(): DetalleFacturaModel {
    return new DetalleFacturaModel().deserialize(this.facForm.value);
  }

  private prepareItemFac(): FacturaModel {
    return new FacturaModel().deserialize(this.facForm.value);
  }

}
