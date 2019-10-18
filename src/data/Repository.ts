import PouchDb from 'pouchdb'
import { IPrize, IDocument, IProject, IParticipant } from '../data/Model';
import uuid from 'uuid';

export class Repository<TDocument extends IDocument> {
    private db: PouchDB.Database;

    constructor(dbName: string) {
        this.db = new PouchDb(dbName);
    }

    async getAll(): Promise<TDocument[]> {
        try {
            let result = await this.db.allDocs({ include_docs: true});
            let prizes: TDocument[] = [];

            result.rows.forEach(element => {
                prizes.push(element.doc as TDocument);
            });

            return prizes;
        } catch(e) {
            console.log(e);
            return [];
        }
    }

    async add(prize: TDocument): Promise<void> {
        try {
            prize._id = uuid.v4();
            let result = await this.db.put(prize)
            prize._rev = result.rev;        
        } catch (e) {
            console.log(e);
        }
    }

    async update(prize: TDocument): Promise<void> {
        try {
            let result = await this.db.put(prize)
            prize._rev = result.rev;        
        } catch (e) {
            console.log(e);
        }
    }

    async remove(_id: string): Promise<void> {
        try {
            let doc = await this.db.get(_id);
            await this.db.remove(doc);
        } catch (e) {
            console.log(e);
        }
    }
}

export let prizeRepository: Repository<IPrize> = new Repository<IPrize>("prizes");
export let projectRepository: Repository<IProject> = new Repository<IProject>("project");
export let participantRepository: Repository<IParticipant> = new Repository<IParticipant>("participant");