export interface IDocument {
    _id: string;
    _rev?: string;
}

export interface IPrize extends IDocument{
    title: string;
    capacity: number;
    minAge: number;
    maxAge: number;
    location: string;
    projects: string[];
}

export interface IProject extends IDocument {
    title: string;
    description: string;
    participants: string[];
}

export interface IParticipant extends IDocument {
    firstName: string;
    lastName: string;
    birthdate: Date;
    hasPassport: boolean;
}