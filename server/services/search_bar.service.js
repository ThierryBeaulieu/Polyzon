class SearchBarService {
  constructor (productService) {
    this.productService = productService;
  }

  async search(searchParameters, exact) {
    const products = await this.productService.search(searchParameters, exact);
    return products;
  }
}

module.exports = { SearchBarService };
