import { Deserializable } from './deserializable.model';

export class MesaModel implements Deserializable {    
    public IdMesa: number;
    public NumMaxComensa: number;
    public Ubicacion: string;    

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}