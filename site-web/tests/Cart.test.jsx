import { screen, fireEvent } from '@testing-library/react';
import customRender from './customRender';
import CartPage from '../src/pages/Cart';
import { beforeEach, test } from 'vitest';
import { ACTIONS } from '../src/reducer/reducer';

describe('CartPage', () => {
    let providerProps;
    let rerenderFn;
    beforeEach(() => {
        providerProps = {
            value: {
                state: {
                    cartProducts: [
                        { id: 1, name: 'Product 1', price: 10 },
                        { id: 2, name: 'Product 2', price: 20 },
                    ],
                },
                dispatch: vi.fn(),
            },
        };
        rerenderFn = customRender(<CartPage />, { providerProps }).rerender;
    });

    test('Should render page title', () => {
        const pageTitle = screen.getByText('Votre panier');
        expect(pageTitle).toBeVisible();
    });

    test('Should render the cart products', () => {
        const productsContainer = document.getElementsByClassName('cart-products-wrapper')[0];
        expect(productsContainer).toBeInTheDocument();
        expect(productsContainer.children.length).toBe(2);
    });

    test('Should render the total price', () => {
        const totalPrice = document.getElementById('price');
        expect(totalPrice).toBeVisible();
        expect(totalPrice.textContent)
            .toBe(`Prix total : ${providerProps.value.state.cartProducts.reduce((a, c) => a + c.price, 0).toFixed(2)}$`);
    });

    test('Should render "Le panier est présentement vide" message when cart is empty', () => {
        providerProps.value.state.cartProducts = [];
        customRender(<CartPage />, { providerProps }, rerenderFn);
        const emptyCartMessage = screen.getByText('Le panier est présentement vide');
        expect(emptyCartMessage).toBeVisible();
    });

    test('Should render "Vider le panier" button', () => {
        const emptyCartButton = document.getElementById('empty-cart-button');
        expect(emptyCartButton).toBeVisible();
    });

    test('Should render a disabled "Vider le panier" button when cart is empty', () => {
        providerProps.value.state.cartProducts = [];
        customRender(<CartPage />, { providerProps }, rerenderFn);
        const emptyCartButton = document.getElementById('empty-cart-button');
        expect(emptyCartButton).toBeDisabled();
    });

    test('Should render an enabled "Vider le panier" button when cart is not empty', () => {
        const emptyCartButton = document.getElementById('empty-cart-button');
        expect(emptyCartButton).not.toBeDisabled();
    });

    test('Should render "Procéder à l\'achat" button', () => {
        const checkoutButton = document.getElementById('checkout-button');
        expect(checkoutButton).toBeVisible();
    });

    test('Should disable "Procéder à l\'achat" button when cart is empty', () => {
        providerProps.value.state.cartProducts = [];
        customRender(<CartPage />, { providerProps }, rerenderFn);
        const checkoutButton = document.getElementById('checkout-button');
        expect(checkoutButton).toBeDisabled();
    });

    test('Should enable "Procéder à l\'achat" button when cart is not empty', () => {
        const checkoutButton = document.getElementById('checkout-button');
        expect(checkoutButton).not.toBeDisabled();
    });

    test('Should call dispatch with ACTIONS.EMPTY_CART when clicking on "Vider le panier"', () => {
        const emptyCartButton = document.getElementById('empty-cart-button');
        fireEvent.click(emptyCartButton);
        expect(providerProps.value.dispatch).toHaveBeenCalledWith({ type: ACTIONS.EMPTY_CART });
    });

    test('Should call dispatch with ACTIONS.CHECKOUT_CART when clicking on "Procéder à l\'achat"', () => {
        const checkoutButton = document.getElementById('checkout-button');
        fireEvent.click(checkoutButton);
        expect(providerProps.value.dispatch).toHaveBeenCalledWith({ type: ACTIONS.CHECKOUT_CART });
    });

    test('Should call dispatch with ACTIONS.REMOVE_FROM_CART when clicking on "X" next to an item', () => {
        const removeItemButton = document.getElementsByClassName('remove-item')[0];
        fireEvent.click(removeItemButton);
        expect(providerProps.value.dispatch).toHaveBeenCalledWith({ type: ACTIONS.REMOVE_FROM_CART, payload: { id: 1 } });
    });
});