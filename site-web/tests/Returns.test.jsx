import { waitFor } from '@testing-library/react';
import { expect, vi } from 'vitest'
import Returns from '../src/pages/Returns';
import { act } from 'react-dom/test-utils';
import customRender from './customRender';

vi.mock("../src/components/Purchase", () => ({
    default: () => {
        return <p className="purchase">Test-Purchase</p>;
    }
}));


describe("Returns page tests", () => {
    let purchases;
    let providerProps;
    beforeEach(() => {
        purchases = [
            {
                id: '1f704ada-5f5c-4868-a30b-7e99a73ed82e',
                productIds: [
                    '1',
                    '2',
                    '3'
                ],
                totalCost: 10,
            },
            {
                id: '2f704ada-5f5c-4868-a30b-7e99a73ed82e',
                productIds: [
                    '4',
                    '5',
                    '6'
                ],
                totalCost: 20,
            },
        ];
        providerProps = {
            value: {
                api: {
                    getAllPurchases: vi.fn().mockReturnValue(purchases),
                },
            },
        };
    });

    test('Should render Returns page with 2 purchases', async () => {
        const view = customRender(<Returns />, { providerProps });
        await waitFor(() => view.getAllByText("Test-Purchase"));
        const purchaseCards = document.getElementsByClassName("purchase");
        expect(purchaseCards.length).toBe(2);
    });

    test('Should render no purchases if an error occurs', async () => {
        providerProps.value.api.getAllPurchases = vi.fn().mockRejectedValue(new Error('Error'));
        await act(async () => {
            customRender(<Returns />, { providerProps });
        });
        const purchaseContainer = document.getElementsByClassName("products-bought")[0];
        const noProductsMessage = document.getElementsByClassName("no-available-product")[0];

        expect(purchaseContainer).toBeInTheDocument();
        expect(purchaseContainer.children.length).toBe(0);
        expect(noProductsMessage).toBeVisible();
        expect(noProductsMessage.textContent).toBe("Aucun produit n'a été acheté");
    });

    test('Should render no purchases if getAllPurchases returns empty array', async () => {
        providerProps.value.api.getAllPurchases = vi.fn().mockResolvedValue([]);
        await act(async () => {
            customRender(<Returns />, { providerProps });
        });
        const purchaseContainer = document.getElementsByClassName("products-bought")[0];
        const noProductsMessage = document.getElementsByClassName("no-available-product")[0];

        expect(purchaseContainer).toBeInTheDocument();
        expect(purchaseContainer.children.length).toBe(0);
        expect(noProductsMessage).toBeVisible();
        expect(noProductsMessage.textContent).toBe("Aucun produit n'a été acheté");
    });

    test('Should call api.getAllPurchases() when the page is rendered', async () => {
        await act(async () => {
            customRender(<Returns />, { providerProps });
        });
        expect(providerProps.value.api.getAllPurchases).toHaveBeenCalled();
    });
});