const { SearchBarService } = require('../services/search_bar.service');

describe('SearchBarService', () => {
  const mockProductService = {
    search: jest.fn(),
  };

  const searchBarService = new SearchBarService(mockProductService);

  it('should call productService.search with correct parameters', async () => {
    const searchParameters = 'example';
    const exact = true;
    const expectedResult = [{ id: "1", name: "test1" }, { id: "2", name: "test2" }];

    mockProductService.search.mockResolvedValueOnce(expectedResult);

    const result = await searchBarService.search(searchParameters, exact);

    expect(mockProductService.search).toHaveBeenCalledWith(searchParameters, exact);

    expect(result).toEqual(expectedResult);
  });
});
