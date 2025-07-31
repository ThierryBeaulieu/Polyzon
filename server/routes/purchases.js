const { HTTP_STATUS } = require('../utils/http');
const router = require('express').Router();
const { PurchaseService } = require('../services/purchase.service');
const purchaseService = new PurchaseService();

/**
 * Retourne une liste de tous les commandes
 * @memberof module:routes/purchases
 * @name GET /purchases
 */
router.get('/', async (request, response) => {
  try {
    const purchases = await purchaseService.getAllPurchases();
    response.status(HTTP_STATUS.SUCCESS).json(purchases);
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

/**
 * Ajoute une commande
 * @memberof module:routes/purchases
 * @name POST /purchases
 */
router.post('/', async (request, response) => {
  try {
    if (!Object.keys(request.body).length) {
      response.status(HTTP_STATUS.BAD_REQUEST).send();
      return;
    }
    purchase = await purchaseService.addPurchase(request.body);
    response.status(HTTP_STATUS.CREATED).json(purchase);
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

/**
 * Retourne une liste de tous les produits d'une commande
 * @memberof module:routes/purchases
 * @name GET /purchases/:id
 */
router.get('/:id', async (request, response) => {
  try {
    const products = await purchaseService.getPurchaseProducts(request.params.id);
    response.status(HTTP_STATUS.SUCCESS).json(products);
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

/**
 * Supprime une commande en fonction de son id
 * @memberof module:routes/purchases
 * @name DELETE /purchases/:id
 */
router.delete('/:id', async (request, response) => {
  try {
    const isDeleted = await purchaseService.deletePurchase(request.params.id);
    if (isDeleted) {
      response.status(HTTP_STATUS.SUCCESS).json({ message: 'Purchase deleted' });
    } else {
      response.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Purchase not found' });
    }
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

module.exports = { router, purchaseService };
