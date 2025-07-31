import { SERVER_URL } from './consts.js';

export const HTTPInterface = {
  SERVER_URL: `${SERVER_URL}/api`,

  GET: async function (endpoint) {
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`);
    return await response.json();
  },

  POST: async function (endpoint, data) {
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json',
      },
    });

    return await response.json();
  },

  DELETE: async function (endpoint) {
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`, {
      method: 'DELETE',
    });
    return response.status;
  },

  PATCH: async function (endpoint) {
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`, {
      method: 'PATCH',
    });
    return response.status;
  },

  PUT: async function (endpoint, data) {
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json',
      },
    });
    return response.status;
  },
};

export default class HTTPManager {
  constructor() {
    this.products = {};
    this.productsBaseURL = 'products';
    this.purchaseBaseURL = 'purchases';
    this.searchBaseURL = 'search';
  }

  /**
   * Récupère et retourne tous les produits du serveur
   * @returns {Promise} Liste de produits
   */
  async fetchAllProducts() {
    const products = await HTTPInterface.GET(`${this.productsBaseURL}`);
    return products;
  }

  /**
   * @returns {Promise} Liste des produits
   */
  async getAllProducts() {
    const productsPromise = new Promise((resolve, reject) => {
      try {
        const products = this.fetchAllProducts();
        resolve(products);
      } catch (err) {
        reject('Échec lors de la requête GET /api/products');
      }
    });

    const productsReceived = Promise.resolve(productsPromise);
    return productsReceived;
  }

  /**
   * Récupère et retourne en fonction de son identifiant
   * @param {number} id Identifiant du produit
   * @returns {Promise} Produit
   */
  async fetchProductById(id) {
    const product = await HTTPInterface.GET(`${this.productsBaseURL}/${id}`);
    return product;
  }

  /**
   * @param {number} id identifiant du produit
   * @returns {Promise} Produit
   */
  async getProductById(id) {
    const productPromise = new Promise((resolve, reject) => {
      try {
        const product = this.fetchProductById(id);
        resolve(product);
      } catch (err) {
        reject('Échec lors de la requête GET /api/products');
      }
    });

    const productReceived = Promise.resolve(productPromise);
    return productReceived;
  }

  /**
   * Ajoute une nouvelle commandes aux commandes existantes sur le serveur
   * @param {Object} purchase Commande à envoyer au serveur
   */
  async makePurchase(purchase) {
    try {
      await HTTPInterface.POST(`${this.purchaseBaseURL}`, purchase);
    } catch (err) {
      window.alert(err);
    }
  }

  /**
   * Supprime une commande sur le serveur à travers une requête
   * @param {string} id identifiant de la commande à supprimer
   */
  async deletePurchase(purchaseId) {
    try {
      await HTTPInterface.DELETE(`${this.purchaseBaseURL}/${purchaseId}`);
    } catch (err) {
      window.alert('An error has occured while deleting a purchase', err);
    }
  }

  /**
   * Récupère et retourne toutes les commandes
   * @returns {Promise} Commandes
   */
  async fetchAllPurchases() {
    const purchases = await HTTPInterface.GET(`${this.purchaseBaseURL}`);
    return purchases;
  }

  /**
   * @returns {Promise} Toutes les commandes
   */
  async getAllPurchases() {
    const purchasesPromise = new Promise((resolve, reject) => {
      try {
        const purchases = this.fetchAllPurchases();
        resolve(purchases);
      } catch (err) {
        reject('Échec lors de la requête GET /api/purchases');
      }
    });

    const purchasesReceived = Promise.resolve(purchasesPromise);
    return purchasesReceived;
  }

  /**
   * Récupère et retourne toutes les produits achetés dans une commande
   * @param {string} id identifiant de la commande dont on doit aller chercher les produits
   * @returns {Promise} Tous les produits présent dans la commande
   */
  async fetchPurchaseContent(purchaseId) {
    const purchaseContent = await HTTPInterface.GET(`${this.purchaseBaseURL}/${purchaseId}`);
    return purchaseContent;
  }

  /**
   * @returns {Promise} Tous les produits présent dans une command
   */
  async getPurchaseContent(purchaseId) {
    const productsPromise = new Promise((resolve, reject) => {
      try {
        const products = this.fetchPurchaseContent(purchaseId);
        resolve(products);
      } catch (err) {
        reject('Échec lors de la requête GET /api/purchases/:id');
      }
    });

    const productsReceived = Promise.resolve(productsPromise);
    return productsReceived;
  }

  /**
   * Effectue une recherche de mot clé sur le serveur et retourne le résultat
   * Les paramètres sont envoyés dans la query de la requête HTTP sous le format suivant :
   * search_query=query&exact=exact
   * Si exact = true, la recherche est sensible à la case
   * @param {string} query mot clé à rechercher
   * @param {boolean} exact flag qui indique si la recherche est sensible à la case ou non
   * @returns
   */
  async search(query, exact) {
    const searchResults = await HTTPInterface.GET(
      `${this.searchBaseURL}?search_query=${query}&exact=${exact}`,
    );
    return searchResults;
  }
}
