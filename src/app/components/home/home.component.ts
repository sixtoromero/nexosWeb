import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import { ClienteModel } from 'src/app/models/cliente.model';
import { TotalesByCamareroModel } from 'src/app/models/totalesbycamarero.model';
import { BillService } from 'src/app/services/bill.service';
import { CustomerService } from 'src/app/services/customer.service';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  providers: [BillService, CustomerService, GeneralService, MessageService, ConfirmationService]
})
export class HomeComponent implements OnInit {

  msgs: Message[] = [];
  reportTotales: TotalesByCamareroModel[] = [];
  displayModalBill: boolean = false;
  customers: ClienteModel[] = [];

  constructor(
    private _service: BillService,
    private _customerService: CustomerService,
    private _general: GeneralService,    
    private confirmationService: ConfirmationService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.getViewFacetura();
    this.getClientesMayorCompra();
  }

  getViewFacetura() {
    this.ngxService.start();
    this._service.getTotalesByCamarero()
    .pipe(finalize(() => this.ngxService.stop()))
    .subscribe(response => {
      if (response["IsSuccess"]) {
        this.reportTotales = response["Data"] as TotalesByCamareroModel[];
        console.log('Reporte', this.reportTotales)
      }
    }, error => {
      this._general.showError('Ha ocurrido un error inesperado.');
    });
  }

  getClientesMayorCompra() {
    this.ngxService.start();
    this._customerService.getClientesMayorCompra()
    .pipe(finalize(() => this.ngxService.stop()))
    .subscribe(response => {
      if (response["IsSuccess"]) {
        this.customers = response["Data"] as ClienteModel[];
      }
    }, error => {
      this._general.showError('Ha ocurrido un error inesperado.');
    });
  }

}
