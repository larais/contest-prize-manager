export interface IPrize {
    _id: string;
    _rev?: string;
    title: string;
    participantCapacity: number;
    minAge: number;
    maxAge: number;
    location: string;
}

export interface IProject {
    _id: string;
    _rev?: string;
    title: string;
    description: string;
    participants: string[];
}

export interface IParticipant {
    _id: string;
    _rev?: string;
    firstName: string;
    lastName: string;
    birthdate: Date;
    hasPassport: boolean;
}