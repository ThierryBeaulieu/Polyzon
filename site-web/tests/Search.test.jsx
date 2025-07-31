import { render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductContext from '../src/contexts/ProductContext';
import SearchPage from '../src/pages/Search';
import { beforeEach, expect, vi } from 'vitest';

const customRender = (ui, { providerProps, queryParameters }) => {
    // Mock the behavior of window.location.search with specific query parameters
    Object.defineProperty(window, 'location', {
        value: {
            search: queryParameters,
        },
        writable: true,
    });

    return render(<ProductContext.Provider {...providerProps}>{ui}</ProductContext.Provider>, { wrapper: BrowserRouter });
};

vi.mock("../src/components/ProductCard", () => ({
    default: ({ product }) => {
        return <p className="mock-card">{product.name}</p>;
    }
}));

describe('Search page tests', () => {
    let providerProps;
    beforeEach(() => {
        providerProps = {
            value: {
                api: {
                    search: vi.fn().mockResolvedValue([]),
                },
            },
        };
    });

    test('Should render "Aucun produit n\'est présent dans la recherche" message when search returns empty array', async () => {
        const view = customRender(<SearchPage />, { providerProps });
        await waitFor(() => view.getByText("Produits recherchés"));
        expect(view.getByText("Aucun produit n'est présent dans la recherche")).toBeVisible();
    });

    test('Should render searched products when search returns non-empty array', async () => {
        const mockProducts = [
            { id: 1, name: 'Product 1' },
            { id: 2, name: 'Product 2' },
        ];
        providerProps.value.api.search = vi.fn().mockResolvedValue(mockProducts);
        const view = customRender(<SearchPage />, { providerProps });
        await waitFor(() => view.getByText(mockProducts[0].name));
        const productsContainer = document.getElementsByClassName("available-products")[0];
        expect(productsContainer).toBeInTheDocument();
        expect(productsContainer.children.length).toBe(2);
        expect(productsContainer.children[0].textContent).toBe(mockProducts[0].name);
        expect(productsContainer.children[1].textContent).toBe(mockProducts[1].name);
    });

    test('Should call api.search() with the search query from URL', async () => {
        const productInput = 'savon';
        const isSearchExact = 'true';
        const view = customRender(<SearchPage />, { providerProps, queryParameters: `productInput=${productInput}&isSearchExact=${isSearchExact}` });
        await waitFor(() => view.getByText("Produits recherchés"));
        expect(providerProps.value.api.search).toHaveBeenCalledWith(productInput, isSearchExact);
    });

    test('Should console log if api.search() throws an error', async () => {
        providerProps.value.api.search = vi.fn().mockRejectedValue(new Error('Error'));
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const view = customRender(<SearchPage />, { providerProps });
        await waitFor(() => view.getByText("Produits recherchés"));
        expect(consoleSpy).toHaveBeenCalled();
    });
});


