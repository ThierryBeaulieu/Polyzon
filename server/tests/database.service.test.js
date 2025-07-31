const { MongoMemoryServer } = require("mongodb-memory-server");
const { dbService } = require("../services/database.service");
const DB_CONSTS = require("../utils/env");

describe("Database tests", () => {
    let mongoServer;
    let uri = "";
    beforeEach(async () => {
        jest.spyOn(console, "log").mockImplementation(() => { });
        mongoServer = await MongoMemoryServer.create();
        uri = mongoServer.getUri();
    });

    afterEach(async () => {
        await dbService.client.close();
        await mongoServer.stop();
        jest.restoreAllMocks();
    });

    it("should connect to the database", async () => {
        await dbService.connectToServer(uri);
        expect(dbService.client).not.toBeUndefined();
    });

    it("should not connect to the database with invalid URI", async () => {
        const spy = jest.spyOn(console, "error").mockImplementation(() => { });
        await dbService.connectToServer("bad-uri");
        expect(spy).toHaveBeenCalled();
    });

    it("should populate a collection", async () => {
        const products = [
            {
                "id": "0",
                "name": "Savon à main",
                "description": "Savon à main organique 100% biologique",
                "price": 14.99,
                "stars": 4.5,
                "thumbnail": "assets/savon1.jpeg"
            },
            {
                "id": "1",
                "name": "Barre de savon",
                "description": "Barre de savon pour les mains 100% biologique",
                "price": 12.99,
                "stars": 4,
                "thumbnail": "assets/savon2.jpeg"
            }];

        const collectionName = DB_CONSTS.DB_COLLECTION_PRODUCTS;
        await dbService.connectToServer(uri);
        await dbService.db.createCollection(collectionName);
        await dbService.populateDb(collectionName, products);
        const insertedElements = await dbService.db.collection(collectionName).find({}).toArray();
        expect(insertedElements.length).toEqual(2);
        expect(insertedElements).toEqual(products);
    });

    it("should not populate a collection if data exsits", async () => {
        const products = [
            {
                "id": "0",
                "name": "Savon à main",
                "description": "Savon à main organique 100% biologique",
                "price": 14.99,
                "stars": 4.5,
                "thumbnail": "assets/savon1.jpeg"
            },
            {
                "id": "1",
                "name": "Barre de savon",
                "description": "Barre de savon pour les mains 100% biologique",
                "price": 12.99,
                "stars": 4,
                "thumbnail": "assets/savon2.jpeg"
            }];

        const collectionName = DB_CONSTS.DB_COLLECTION_PRODUCTS;
        await dbService.connectToServer(uri);
        await dbService.db.createCollection(collectionName);
        await dbService.db.collection(collectionName).insertOne(products[0]);
        await dbService.populateDb(collectionName, products);
        const insertedElements = await dbService.db.collection(collectionName).find({}).toArray();
        expect(insertedElements.length).toEqual(1);
        expect(insertedElements).toEqual([products[0]]);
    });
});
