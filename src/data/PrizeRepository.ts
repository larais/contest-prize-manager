import PouchDb from 'pouchdb'
import { IPrize } from '../data/Model';

export class PrizeRepository {
    private db: PouchDB.Database;

    constructor() {
        this.db = new PouchDb("prizes");
        this.createMockData();
    }

    async getAll(): Promise<IPrize[]> {
        let result = await this.db.allDocs({ include_docs: true});
        let prizes: IPrize[] = [];

        result.rows.forEach(element => {
            prizes.push(element.doc as IPrize);
        });

        return prizes;
    }

    private createMockData() {
        this.db.bulkDocs([
            {
                _id: "test-id",
                location: "Paris",
                minAge: 11,
                maxAge: 21,
                title: "Prize 1",
                participantCapacity: 12
            }
        ] as IPrize[]).then(function (response) {
            console.log(response);
        }).catch(function (err) {
            console.log(err);
        });
    }
}

export let prizeRepository: PrizeRepository = new PrizeRepository();