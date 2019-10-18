export default interface Participant {
    _id: string;
    _rev?: string;
    firstName: string;
    lastName: string;
    birthdate: Date;
    hasPassport: boolean;
}