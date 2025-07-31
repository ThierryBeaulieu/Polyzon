const { HTTP_STATUS } = require('../utils/http');
const router = require('express').Router();
const { SearchBarService } = require('../services/search_bar.service');
const { ProductService } = require('../services/product.service');

const productService = new ProductService();
const searchBarService = new SearchBarService(productService);

/**
 * Retourne une liste de produits qui correspondent à la recherche
 * @memberof module:routes/search_bar
 * @name PATCH /search/
 */
router.get('/', async (request, response) => {
  try {
    const search_query = request.query.search_query;
    const exact = request.query.exact === 'true'; // par défaut : tout est un string
    const search = await searchBarService.search(search_query, exact);
    response.status(HTTP_STATUS.SUCCESS).json(search);
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).send(error);
  }
});

module.exports = { router, searchBarService };
