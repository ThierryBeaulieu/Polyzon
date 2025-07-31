const DB_CONSTS = require('../utils/env');
const { dbService } = require('./database.service');
const { FileSystemManager } = require('./file_system_manager');
const { ProductService } = require('../services/product.service');
const { randomUUID } = require('crypto');

class PurchaseService {
  constructor() {
    this.fileSystemManager = new FileSystemManager();
    this.dbService = dbService;
    this.productService = new ProductService();
  }

  get collection() {
    return this.dbService.db.collection(DB_CONSTS.DB_COLLECTION_PURCHASES);
  }

  /**
   * TODO : Récupérer toutes les commandes
   * Retourne la liste de tous les commandes
   * @returns {Promise<Array>}
   */
  async getAllPurchases() {
    return await this.collection.find().toArray();
  }

  /**
   * TODO : Récupérer les produits d'une commande spécifique en fonction de son identifiant
   * Retourne la liste de tous les produits d'une commande
   * @returns {Promise<Array>} les produits de la commande spcécifiée
   */
  async getPurchaseProducts(purchaseId) {
    const purchases = await this.collection.findOne({ id: purchaseId });
    if (!purchases) return null;
    const productPromises = purchases.productIds.map(async (productId) => {
      return await this.productService.getProductById(productId);
    });
    const products = await Promise.all(productPromises);
    return products;
  }

  /**
   * TODO : Ajouter une commande à la liste des commandes
   * @param {Object} purchase nouvelle commande à ajouter
   * @returns la commande ajoutée
   */
  async addPurchase(purchase) {
    purchase.id = randomUUID();
    await this.collection.insertOne(purchase);
    return purchase;
  }

  /**
   * TODO : Supprimer une commande en fonction de son identifiant
   * @param {string} id identifiant de la commande
   * @returns {Promise<boolean>} true si la commande a été supprimée, false sinon
   */
  async deletePurchase(id) {
    const res = await this.collection.findOneAndDelete({ id });
    return res !== null;
  }
}

module.exports = { PurchaseService };
