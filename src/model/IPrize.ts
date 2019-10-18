export interface IPrize {
    _id: string;
    _rev?: string;
    title: string;
    participantCapacity: number;
    minAge: number;
    maxAge: number;
    location: string;
}