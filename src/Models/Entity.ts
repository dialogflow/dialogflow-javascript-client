export class Entity implements IEntity{
    public name: string;
    public entires: Entity.Entry[];
}

export namespace Entity {
    export class Entry implements IEntity.IEntry {
        public value: string;
        public synonyms: string[];
    }
}

export interface IEntity {
    name: string;
    entires: IEntity.IEntry[];
}

export namespace IEntity {
    export interface IEntry {
        value: string;
        synonyms: string[];
    }
}
