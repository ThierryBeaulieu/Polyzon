import { screen, fireEvent } from '@testing-library/react';
import * as router from 'react-router'
import SearchBox from '../src/components/SearchBox';
import { describe, expect } from 'vitest';
import customRender from './customRender';

const QuerySelect = {
    ALL_PRODUCTS: 'All_products',
    EXACT_SEARCH: 'Exact_search',
};

describe('SearchBox tests', () => {
    let providerProps;
    let mockNavigate;

    beforeEach(() => {
        mockNavigate = vi.fn();
        vi.spyOn(router, 'useNavigate').mockImplementation(() => mockNavigate)

        providerProps = {
            value: {
            },
        };

        customRender(<SearchBox />, { providerProps }).rerender;
    });

    test('Should render search box with placeholder "Rechercher sur Polyzon"', () => {
        const searchInput = screen.getByPlaceholderText('Rechercher sur Polyzon');

        expect(searchInput).toBeVisible();
    });

    test('Should render search button with right icon', () => {
        const searchButton = document.querySelector('form .search-field button');
        expect(searchButton).toBeVisible();
        expect(searchButton.classList).toContain('fa', 'fa-lg', 'fa-search');
    });

    test('Should navigate to search page with correct query parameters on form submission with all products search', () => {
        const searchForm = document.getElementById('search-form');
        const searchInput = document.getElementById('search-input');
        const queryTypeSelect = document.getElementsByTagName('select')[0];

        fireEvent.change(queryTypeSelect, { target: { value: QuerySelect.ALL_PRODUCTS } });
        fireEvent.change(searchInput, { target: { value: 'product' } });
        fireEvent.submit(searchForm);

        expect(mockNavigate).toHaveBeenCalledWith('/search?productInput=product&isSearchExact=false');
    });

    test('Should navigate to search page with correct query parameters on form submission with exact search', () => {
        const searchForm = document.getElementById('search-form');
        const searchInput = document.getElementById('search-input');
        const queryTypeSelect = document.getElementsByTagName('select')[0];

        fireEvent.change(queryTypeSelect, { target: { value: QuerySelect.EXACT_SEARCH } });
        fireEvent.change(searchInput, { target: { value: 'product' } });
        fireEvent.submit(searchForm);

        expect(mockNavigate).toHaveBeenCalledWith('/search?productInput=product&isSearchExact=true');
    });

    test('Should render search box with right query type options', () => {
        const queryTypeSelect = document.getElementsByTagName('select')[0];
        const options = queryTypeSelect.children;

        expect(queryTypeSelect).toBeVisible();
        expect(options[0].textContent).toBe('Tous les produits');
        expect(options[0].value).toBe(QuerySelect.ALL_PRODUCTS);
        expect(options[1].textContent).toBe('Exact');
        expect(options[1].value).toBe(QuerySelect.EXACT_SEARCH);
    });

});