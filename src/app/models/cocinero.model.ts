import { Deserializable } from './deserializable.model';

export class CocineroModel implements Deserializable  {    
    public IdCocinero: number;
    public Nombre: string;
    public Apellido1: string;
    public Apellido2: string;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }

}