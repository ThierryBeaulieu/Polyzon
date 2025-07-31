const DB_CONSTS = require('../utils/env');
const { dbService } = require('./database.service');
const { FileSystemManager } = require('./file_system_manager');

const path = require('path');

class ProductService {
  constructor() {
    this.JSON_PATH = path.join(__dirname + '../../data/products.json');
    this.fileSystemManager = new FileSystemManager();
    this.dbService = dbService;
  }

  get collection() {
    return this.dbService.db.collection(DB_CONSTS.DB_COLLECTION_PRODUCTS);
  }

  /**
   * TODO : Remplir la collection avec les données du fichier JSON
   * @returns {Promise<void>}
   */
  async populateDb() {
    const products = JSON.parse(await this.fileSystemManager.readFile(this.JSON_PATH)).products;
    await this.dbService.populateDb(DB_CONSTS.DB_COLLECTION_PRODUCTS, products);
  }

  /**
   * TODO : Retourner tous les produits de la base de données
   * Retourne la liste de tous les produits
   * @returns {Promise<Array>}
   */
  async getAllProducts() {
    return await this.collection.find().toArray();
  }

  /**
   * TODO : Retourner un produit en fonction de son identifiant
   * Retourne un produit en fonction de son id
   * @param {string} id
   * @returns Retourne un produit en fonction de son id
   */
  async getProductById(id) {
    const filter = { id };
    return this.collection.findOne(filter);
  }

  /**
   * TODO : Implémenter la recherche pour les champs des produits. Astuce : utilisez l'opérateur '$or' de MongoDB
   *
   * Cherche et retourne les produits qui ont un mot clé spécifique dans leur description (name, description)
   * Si le paramètre 'exact' est TRUE, la recherche est sensible à la case
   * en utilisant l'option "i" dans la recherche par expression régulière
   * @param {string} substring mot clé à chercher
   * @param {boolean} exact si la recherche est sensible à la case
   * @returns tous les produits qui ont le mot clé cherché dans leur contenu (name, description)
   */
  async search(substring, exact) {
    const regexSearch = { $regex: `${substring}`, $options: exact ? "" : "i" };
    const filter = {
      $or: [{ name: regexSearch }, { description: regexSearch }],
    };
    const products = await this.collection.find(filter).toArray();
    return products;
  }
}

module.exports = { ProductService };
