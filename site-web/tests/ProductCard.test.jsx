import { fireEvent } from '@testing-library/react';
import { ACTIONS } from '../src/reducer/reducer';
import ProductCard from '../src/components/ProductCard';
import { beforeEach, expect } from 'vitest';
import { SERVER_URL } from '../src/utils/consts';
import customRender from './customRender';

describe('ProductCard tests', () => {
    let product;
    let providerProps;
    let rerenderFn;

    beforeEach(() => {
        product = {
            id: 1,
            name: 'Sample Product',
            thumbnail: 'sample-thumbnail.jpg',
        };

        providerProps = {
            value: {
                state: {
                    cartProducts: [],
                },
                dispatch: vi.fn(),
            }
        };

        window.alert = vi.fn();
        rerenderFn = customRender(<ProductCard product={product} />, { providerProps }).rerender;
    });

    test('Should render product card with right name', () => {
        const productName = document.getElementsByTagName('h3')[0];

        expect(productName).toBeVisible();
        expect(productName.textContent).toBe('Sample Product');
    });

    test('Should render "Ajouter au panier" button when product is not in cart', () => {
        const addToCartButton = document.getElementsByClassName('add-to-cart')[0];
        expect(addToCartButton).toBeVisible();
    });

    test('Should render "Retirer du panier" button when product is in cart', () => {
        providerProps.value.state.cartProducts = [product];
        customRender(<ProductCard product={product} />, { providerProps }, rerenderFn);
        const removeFromCartButton = document.getElementsByClassName('remove-from-cart')[0];
        expect(removeFromCartButton).toBeVisible();
    });

    test('Clicking on "Ajouter au panier" button should add product to cart', () => {
        const addToCartButton = document.getElementsByClassName('add-to-cart')[0];

        fireEvent.click(addToCartButton);

        expect(providerProps.value.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.ADD_TO_CART, payload: { product }
        });
    });

    test('Clicking on "Retirer du panier" button should remove product from cart', () => {
        providerProps.value.state.cartProducts = [product];
        customRender(<ProductCard product={product} />, { providerProps }, rerenderFn);
        const removeFromCartButton = document.getElementsByClassName('remove-from-cart')[0];

        fireEvent.click(removeFromCartButton);

        expect(providerProps.value.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.REMOVE_FROM_CART, payload: { id: product.id }
        });
    });

    test('Should render product card with right image', () => {
        const productImage = document.getElementsByTagName('img')[0];

        expect(productImage).toBeVisible();
        expect(productImage.src).toBe(`${SERVER_URL}/${product.thumbnail}`);
    });

    test('Should render product card with right link', () => {
        const productLink = document.getElementsByTagName('a')[0];

        expect(productLink).toBeVisible();
        expect(productLink.href).toContain(`/products/${product.id}`);
    });

});