import { Deserializable } from './deserializable.model';
import { InfoProjectModel } from './infoproject.model';

export class ProjectModel implements Deserializable  {
    public Id: number;
    public CustomerId: number;
    public ProjectName: string;
    public StartDate: Date;
    public EndDate: Date;
    public Price: number;
    public NumberHours: number;
    public Status: string;
    public Date: Date;

    public InfoProjects: InfoProjectModel[];
    
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }

}
