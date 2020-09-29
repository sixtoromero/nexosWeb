import { Deserializable } from './deserializable.model';

export class ClienteModel implements Deserializable {    
    public IdCliente: number;
    public Nombre: string;
    public Apellido1: string;
    public Apellido2: string;
    public Observaciones: string;
    public Total: number;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }

}