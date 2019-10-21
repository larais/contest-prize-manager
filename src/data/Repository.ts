import PouchDb from 'pouchdb'
import { IPrize, IDocument, IProject, IParticipant } from '../data/Model';
import uuid from 'uuid';

export class Repository<TDocument extends IDocument> {
    private db: PouchDB.Database;

    constructor(dbName: string) {
        this.db = new PouchDb(dbName);
    }

    async getAll(): Promise<TDocument[]> {
        let result = await this.db.allDocs({ include_docs: true});
        let prizes: TDocument[] = [];

        result.rows.forEach(element => {
            prizes.push(element.doc as TDocument);
        });

        return prizes;
    }

    async get(_id: string): Promise<TDocument> {         
        let result = await this.db.get<TDocument>(_id);
        return result;
    }

    async add(prize: TDocument): Promise<void> {
        prize._id = uuid.v4();
        let result = await this.db.put(prize)
        prize._rev = result.rev;   
    }

    async update(prize: TDocument): Promise<void> {
        let result = await this.db.put(prize)
        prize._rev = result.rev;  
    }

    async remove(_id: string): Promise<void> {
        let doc = await this.db.get(_id);
        await this.db.remove(doc);
    }

    async clear(): Promise<void> {
        let name = this.db.name;
        await this.db.destroy();
        this.db = new PouchDb(name);
    }
}

export let prizeRepository: Repository<IPrize> = new Repository<IPrize>("prizes");
export let projectRepository: Repository<IProject> = new Repository<IProject>("project");
export let participantRepository: Repository<IParticipant> = new Repository<IParticipant>("participant");