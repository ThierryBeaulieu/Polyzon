const { PurchaseService } = require("../services/purchase.service");
const { MongoMemoryServer } = require('mongodb-memory-server');
const { dbService } = require('../services/database.service');

const DB_CONSTS = require('../utils/env');

describe("PurchaseService tests", () => {
    let purchaseService;
    let mongoServer;

    const mockData = {
        products: [
            { id: 1, name: 'Product 1', description: 'description 1' },
            { id: 2, name: 'Product 2', description: 'Description 2' },
        ],
        purchases: [
            { id: 1, productIds: [1, 2] },
            { id: 2, productIds: [1] }
        ]
    };

    beforeEach(async () => {
        jest.spyOn(console, "log").mockImplementation(() => { });
        mongoServer = await MongoMemoryServer.create();
        uri = mongoServer.getUri();
        await dbService.connectToServer(uri);
        await dbService.db.createCollection(DB_CONSTS.DB_COLLECTION_PRODUCTS);
        await dbService.db.collection(DB_CONSTS.DB_COLLECTION_PRODUCTS)
            .insertMany(structuredClone(mockData.products));
        await dbService.db.createCollection(DB_CONSTS.DB_COLLECTION_PURCHASES);
        await dbService.db.collection(DB_CONSTS.DB_COLLECTION_PURCHASES)
            .insertMany(structuredClone(mockData.purchases));

        purchaseService = new PurchaseService();
        purchaseService.dbService = dbService;

        purchaseService.productService = {
            getProductById: jest.fn((id) => {
                return mockData.products.find(product => product.id === id);
            })
        };
    });

    afterEach(async () => {
        await dbService.client.close();
        await mongoServer.stop();
        jest.restoreAllMocks();
    });

    it('getAllPurchases should return all purchases', async () => {
        const purchases = (await purchaseService.getAllPurchases()).map(({ _id, ...rest }) => rest);
        expect(purchases).toEqual(mockData.purchases);
    });

    it('getPurchaseProducts should return all products from a given purchase', async () => {
        const products = (await purchaseService.getPurchaseProducts(1)).map(({ _id, ...rest }) => rest);
        expect(products).toEqual(mockData.products);
    });

    it('getPurchaseProducts should return null on an invalid purchase', async () => {
        const products = await purchaseService.getPurchaseProducts(0);
        expect(products).toBeNull();
    });

    it('addPurchase should add a purchase', async () => {
        const newPurchase = await purchaseService.addPurchase({ productIds: [2] });
        delete newPurchase._id;
        const purchases = (await purchaseService.getAllPurchases()).map(({ _id, ...rest }) => rest);
        expect(purchases.length).toBe(3);
        expect(purchases).toEqual([...mockData.purchases, newPurchase]);
    });

    it('deletePurchase should delete a purchase based on id', async () => {
        const deletedRes = await purchaseService.deletePurchase(1);
        const purchases = (await purchaseService.getAllPurchases()).map(({ _id, ...rest }) => rest);
        expect(purchases.length).toBe(1);
        expect(purchases).toEqual([mockData.purchases[1]]);
        expect(deletedRes).toBeTruthy();
    });

    it('deletePurchase should return false on an invalid purchase', async () => {
        const deletedRes = await purchaseService.deletePurchase(0);
        expect(deletedRes).toBeFalsy();
    });
});
