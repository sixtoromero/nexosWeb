import { Deserializable } from './deserializable.model';
import { DetalleFacturaModel } from './detallefactura.model';

export class FacturaModel implements Deserializable {    

    public IdFactura: number;
    public IdCliente: number;
    public IdCamarero: number;
    public IdMesa: number;
    public FechaFactura: Date;
    public DetalleFacturaModel: DetalleFacturaModel[];

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}