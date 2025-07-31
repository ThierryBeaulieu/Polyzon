const { ProductService } = require("../services/product.service");
const { MongoMemoryServer } = require('mongodb-memory-server');
const { dbService } = require('../services/database.service');

const DB_CONSTS = require('../utils/env');

describe("ProductService tests", () => {
    let productService;
    let mongoServer;
    const collectionName = DB_CONSTS.DB_COLLECTION_PRODUCTS;

    const testPath = 'testPath';
    const mockData = {
        products: [
            { id: 1, name: 'Product 1', description: 'description 1' },
            { id: 2, name: 'Product 2', description: 'Description 2' },
        ]
    };

    beforeEach(async () => {
        jest.spyOn(console, "log").mockImplementation(() => { });
        mongoServer = await MongoMemoryServer.create();
        uri = mongoServer.getUri();
        await dbService.connectToServer(uri);
        await dbService.db.createCollection(collectionName);
        await dbService.db.collection(collectionName).insertMany(structuredClone(mockData.products));

        productService = new ProductService();
        productService.dbService = dbService;

        const mockFileSystemManager = {
            readFile: jest.fn().mockResolvedValue(JSON.stringify(mockData))
        };
        productService.fileSystemManager = mockFileSystemManager;
        productService.JSON_PATH = testPath;
    });

    afterEach(async () => {
        await dbService.client.close();
        await mongoServer.stop();
        jest.restoreAllMocks();
    });

    it('populateDb should call readFile and populateDb functions', async () => {
        const fsSpy = jest.spyOn(productService.fileSystemManager, "readFile");
        const dbSpy = jest.spyOn(productService.dbService, "populateDb");
        await productService.populateDb();
        expect(fsSpy).toHaveBeenCalled();
        expect(dbSpy).toHaveBeenCalled();
        expect(dbSpy).toHaveBeenCalledWith(DB_CONSTS.DB_COLLECTION_PRODUCTS, mockData.products);
    });

    it('getAllProducts should return all products from the database', async () => {
        // Retrait du _id unique attribué par MongoDB
        const result = (await productService.getAllProducts()).map(({ _id, ...rest }) => rest);
        expect(result).toEqual(mockData.products);
    });

    it('getProductById should return a product by its id', async () => {
        const expectedResult = mockData.products[0];
        const result = await productService.getProductById(expectedResult.id);
        expect(result).toEqual(expect.objectContaining(expectedResult));
    });

    it('getProductById should return null if id is not found', async () => {
        const invalidId = 123;
        const result = await productService.getProductById(invalidId);
        expect(result).toBeNull();
    });

    it('search should return all products matching search criteria', async () => {
        const substring = 'description';
        const result = (await productService.search(substring, false)).map(({ _id, ...rest }) => rest);
        expect(result).toEqual(mockData.products);
    });

    it('search should return only products matching search criteria with exact parameter', async () => {
        const substring = 'description';
        const result = (await productService.search(substring, true)).map(({ _id, ...rest }) => rest);
        expect(result).toEqual([mockData.products[0]]);
    });

    it('search should return nothing if no critera matches', async () => {
        const substring = 'test';
        const result = (await productService.search(substring, true)).map(({ _id, ...rest }) => rest);
        expect(result).toEqual([]);
    });
});
