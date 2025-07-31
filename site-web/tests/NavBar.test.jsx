import { screen } from '@testing-library/react';
import NavBar from '../src/components/NavBar';
import { expect } from 'vitest';
import customRender from './customRender';

const clientURL = 'http://localhost:3000';

vi.mock("../src/components/SearchBox", () => ({
    default: () => {
        return <form className="search-box"></form>;
    }
}));

describe("NavBar tests", () => {
    let providerProps;
    let rerenderFn;
    beforeEach(() => {
        providerProps = {
            value: {
                state: {
                    cartProducts: [],
                },
            },
        };
        rerenderFn = customRender(<NavBar />, { providerProps }).rerender;
    });

    test('Should render NavBar with 4 links', () => {
        const links = screen.getAllByRole('link');
        expect(links.length).toBe(4);
        expect(links[0].href).toBe(`${clientURL}/`);
        expect(links[1].href).toBe(`${clientURL}/about`);
        expect(links[2].href).toBe(`${clientURL}/cart`);
        expect(links[3].href).toBe(`${clientURL}/returns`);
    });

    test('Should render search box', () => {
        const searchBox = document.getElementsByClassName('search-box')[0];
        expect(searchBox).toBeVisible();
    });

    test('Should render cart icon in cart link', () => {
        const cartIcon = document.getElementById('cart-icon');
        expect(cartIcon).toBeVisible();
        expect(cartIcon.classList).toContain('fa-solid', 'fa-cart-shopping', 'shopping-cart');
    });

    test('Should render cart link with 2 products', () => {
        providerProps.value.state.cartProducts = [
            { id: 1, name: 'Product 1' },
            { id: 2, name: 'Product 2' },
        ];
        customRender(<NavBar />, { providerProps }, rerenderFn);
        const cartLink = screen.getAllByRole('link')[2];
        expect(cartLink.textContent).toBe('Panier (2)');
    });

    test('Should render cart link with 0 products if cart is empty', () => {
        const cartLink = screen.getAllByRole('link')[2];
        expect(cartLink.textContent).toBe('Panier (0)');
    });
})