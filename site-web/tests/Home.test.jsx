import { waitFor } from '@testing-library/react';
import { expect, vi } from 'vitest'
import HomePage from '../src/pages/Home';
import customRender from './customRender';

vi.mock("../src/components/ProductCard", () => ({
    default: () => {
        return <p className="mock-card">Test-Product</p>;
    }
}));

describe("Home page tests", () => {
    let products;
    let providerProps;
    beforeEach(() => {
        products = [
            { id: 1, name: 'Product 1', price: 10 },
            { id: 2, name: 'Product 2', price: 20 },
            { id: 3, name: 'Product 3', price: 30 },
        ];

        providerProps = {
            value: {
                api: {
                    getAllProducts: vi.fn().mockResolvedValue(products),
                },
            },
        };
    });

    test('Should render Home page with 3 products', async () => {
        const view = customRender(<HomePage />, { providerProps });
        await waitFor(() => view.getAllByText("Test-Product"));
        const productCards = document.getElementsByClassName("mock-card");
        expect(productCards.length).toBe(3);
    });

    test('Should render no products if an error occurs', async () => {
        providerProps.value.api.getAllProducts = vi.fn().mockRejectedValue(new Error('Error'));
        const view = customRender(<HomePage />, { providerProps });
        await waitFor(() => view.getByText("Tous les produits"));
        const productContainer = document.getElementsByClassName("available-products")[0];
        expect(productContainer).toBeInTheDocument();
        expect(productContainer.children.length).toBe(0);
    });



});