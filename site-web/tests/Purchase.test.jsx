import Purchase from '../src/components/Purchase';
import { describe, expect, test } from 'vitest';
import { act } from 'react-dom/test-utils';
import { ACTIONS } from '../src/reducer/reducer';
import customRender from './customRender';

describe("Purchase tests", () => {
    let mockProducts;
    let mockPurchase;
    let providerProps;
    let mockUpdatePurchases;
    beforeEach(() => {
        mockProducts = [
            { id: 1, name: 'Product 1' },
            { id: 2, name: 'Product 2' },
            { id: 3, name: 'Product 3' },
        ];
        mockPurchase = {
            id: '1f704ada-5f5c-4868-a30b-7e99a73ed82e',
            productIds: [
                '1',
                '2',
                '3'
            ],
            totalCost: 10,
        };
        mockUpdatePurchases = vi.fn();
        providerProps = {
            value: {
                api:
                {
                    getPurchaseContent: vi.fn().mockResolvedValue(mockProducts),
                },
                state: {
                    cartProducts: [],
                },
                dispatch: vi.fn(),
            },
        };
    });

    test('Should render Purchase with right totalCost', async () => {
        await act(async () => {
            customRender(<Purchase purchase={mockPurchase} />, { providerProps });
        });
        const totalCost = document.getElementsByClassName('cost')[0];
        expect(totalCost).toBeVisible();
        expect(totalCost.textContent).toBe('Prix total: 10.00 $');
    });

    test('Should render Purchase with 3 products', async () => {
        await act(async () => {
            customRender(<Purchase purchase={mockPurchase} />, { providerProps });
        });
        const products = document.getElementsByClassName('purchased-products');
        expect(products.length).toBe(3);
    });

    test('Should call api.getPurchaseContent() with the purchase productIds', async () => {
        await act(async () => {
            customRender(<Purchase purchase={mockPurchase} />, { providerProps });
        });
        expect(providerProps.value.api.getPurchaseContent).toHaveBeenCalledWith(mockPurchase.id);
    });


    test('Should render "Rembourser la commande" button', async () => {
        await act(async () => {
            customRender(<Purchase purchase={mockPurchase} updatePurchases={mockUpdatePurchases} />, { providerProps });
        });
        const refundButton = document.getElementsByClassName('refund')[0];
        expect(refundButton).toBeVisible();
    });

    test('Clicking on "Rembourser la commande" button should call updatePurchases with the right purchase id', async () => {
        await act(async () => {
            customRender(<Purchase purchase={mockPurchase} updatePurchases={mockUpdatePurchases} />, { providerProps });
        });
        const refundButton = document.getElementsByClassName('refund')[0];
        refundButton.click();

        expect(mockUpdatePurchases).toHaveBeenCalledWith(mockPurchase.id);
    });

    test('Clicking on "Rembourser la commande" button should call dispatch with ACTIONS.REFUND_PURCHASE', async () => {
        await act(async () => {
            customRender(<Purchase purchase={mockPurchase} updatePurchases={mockUpdatePurchases} />, { providerProps });
        });
        const refundButton = document.getElementsByClassName('refund')[0];
        refundButton.click();

        expect(providerProps.value.dispatch).toHaveBeenCalledWith(
            { type: ACTIONS.REFUND_PURCHASE, payload: { id: mockPurchase.id } }
        );
    });
});