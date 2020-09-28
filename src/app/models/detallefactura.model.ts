import { Deserializable } from './deserializable.model';

export class DetalleFacturaModel implements Deserializable {    
    
    public IdDetalleFactura: number;
    public IdFactura: number;
    public IdCocinero: number;
    public Plato: number;
    public Importe: number;

    public Cocinero: string;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}