import { HttpEventType, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { ResponseModel } from '../models/response.model';
import { ViewFacturaModel } from '../models/viewfactura.model';
import { FacturaModel } from '../models/factura.model';
import { TotalesByCamareroModel } from '../models/totalesbycamarero.model';

const httpOptions = {
    headers: new HttpHeaders({
        'Contend-Type': 'application/json'
    })
};

@Injectable({
    providedIn: 'root',
})
export class BillService {
    
    endPoint = `${environment.apiURL}/Factura`;
    endPointRpt = `${environment.apiURL}/ViewFactura`;

    constructor(private _http: HttpClient) { }    

    getViewFactura(): Observable<Observable<ResponseModel<ViewFacturaModel[]>>> {        
        return this._http.get<Observable<ResponseModel<ViewFacturaModel[]>>>(`${this.endPointRpt}/GetViewFactura` );
    }

    insert(model: FacturaModel): Observable<Observable<ResponseModel<string>>> {
        return this._http.post<Observable<ResponseModel<string>>>(`${this.endPoint}/InsertAsync`, model, httpOptions);
    }

    getTotalesByCamarero(): Observable<Observable<ResponseModel<TotalesByCamareroModel[]>>> {        
        return this._http.get<Observable<ResponseModel<TotalesByCamareroModel[]>>>(`${this.endPointRpt}/GetTotalesporCamarero` );
    }
    
    
}