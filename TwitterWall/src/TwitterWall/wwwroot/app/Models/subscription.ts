export class Subscription {
    Id: number;
    Value: string;
    Type: string;

    constructor(Id: number, Value: string, Type: string) {
        this.Id = Id;
        this.Value = Value;
        this.Type = Type;
    }
}