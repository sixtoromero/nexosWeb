import { Deserializable } from './deserializable.model';

export class CamareroModel implements Deserializable  {    
    public IdCamarero: number;
    public Nombre: string;
    public Apellido1: string;
    public Apellido2: string;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}