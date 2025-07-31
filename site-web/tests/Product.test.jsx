import { waitFor, fireEvent } from '@testing-library/react';
import { ACTIONS } from '../src/reducer/reducer';
import ProductPage from '../src/pages/Product';
import customRender from './customRender';

describe('Product page tests', () => {
    let mockProduct;
    let providerProps;

    beforeEach(() => {
        mockProduct = {
            id: 1,
            name: 'Sample Product',
            stars: 4,
            description: 'Sample description',
            price: 10,
            thumbnail: 'sample-thumbnail.jpg',
        };

        providerProps = {
            value: {
                api: {
                    getProductById: vi.fn().mockResolvedValue(mockProduct),
                },
                state: {
                    cartProducts: [],
                },
                dispatch: vi.fn(),
            }
        };
        window.alert = vi.fn();
    });

    test('Should render product details', async () => {
        const view = customRender(<ProductPage />, { providerProps });
        await waitFor(() => view.getByText("Procéder à l'achat"));
        const productImage = document.getElementsByTagName('img')[0];
        const productName = document.getElementById('product-name');
        const productStars = document.getElementById('product-stars');
        const productDescription = document.getElementById('product-description');
        const productPrice = document.getElementById('product-price');

        expect(productImage).toBeInTheDocument();
        expect(productName.textContent).toBe(mockProduct.name);
        expect(productStars.textContent).toBe(`${mockProduct.stars}/5 `);
        expect(productDescription.textContent).toBe(`Description: ${mockProduct.description}`);
        expect(productPrice.textContent).toBe(`Prix: ${mockProduct.price}`);
    });

    test('Should call dispatch with ACTIONS.ADD_TO_CART when "Ajouter au panier" button is clicked', async () => {
        const view = customRender(<ProductPage />, { providerProps });
        await waitFor(() => view.getByText(mockProduct.name));
        const addToCartButton = document.getElementById('add-to-cart-btn');
        fireEvent.click(addToCartButton);

        expect(providerProps.value.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.ADD_TO_CART,
            payload: { product: mockProduct },
        });
    });

    test('Should call dispatch with ACTIONS.REMOVE_FROM_CART when "Retirer du panier" button is clicked', async () => {
        providerProps.value.state.cartProducts = [mockProduct];
        const view = customRender(<ProductPage />, { providerProps });
        await waitFor(() => view.getByText("Retirer du panier"));
        const removeFromCartButton = document.getElementById('remove-from-cart-btn');
        fireEvent.click(removeFromCartButton);

        expect(providerProps.value.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.REMOVE_FROM_CART,
            payload: { id: mockProduct.id },
        });
    });

    test('Should call dispatch with ACTIONS.BUY_NOW when "Acheter Maintenant" button is clicked', async () => {
        const view = customRender(<ProductPage />, { providerProps });
        await waitFor(() => view.getByText("Acheter Maintenant"));
        const buyNowButton = document.getElementById('buy-now-btn');
        fireEvent.click(buyNowButton);

        expect(providerProps.value.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.BUY_NOW,
            payload: { product: mockProduct },
        });
    });

    test('Should display alert when "Acheter Maintenant" button is clicked', async () => {
        const view = customRender(<ProductPage />, { providerProps });
        await waitFor(() => view.getByText("Acheter Maintenant"));
        const buyNowButton = document.getElementById('buy-now-btn');
        fireEvent.click(buyNowButton);

        expect(window.alert).toHaveBeenCalledWith('Produit acheté avec succès');
    });
});