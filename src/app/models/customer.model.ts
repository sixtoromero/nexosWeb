import { Deserializable } from './deserializable.model';

export class CustomerModel implements Deserializable  {    
    public Id: number;
    public Names: string;
    public Surnames: string;
    public Email: string;
    public Address: string;
    public Phone: string;
    public Date: Date;


    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}