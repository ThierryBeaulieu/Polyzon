const { HTTP_STATUS } = require('../utils/http');
const router = require('express').Router();
const { ProductService } = require('../services/product.service');
const productService = new ProductService();

/**
 * Retourne une liste de tous les produits
 * @memberof module:routes/products
 * @name GET /products
 */
router.get('/', async (request, response) => {
  try {
    const products = await productService.getAllProducts();
    response.status(HTTP_STATUS.SUCCESS).json(products);
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

/**
 * Retourne un produit en fonction de son id
 * @memberof module:routes/products/:id
 * @name GET /products/:id
 */
router.get('/:id', async (request, response) => {
  try {
    const product = await productService.getProductById(request.params.id);
    if (product) {
      response.status(HTTP_STATUS.SUCCESS).json(product);
    } else {
      response.status(HTTP_STATUS.NOT_FOUND).send();
    }
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

module.exports = { router, productService };
