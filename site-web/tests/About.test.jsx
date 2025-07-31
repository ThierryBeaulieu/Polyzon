import { render, screen } from '@testing-library/react';
import AboutPage from '../src/pages/About';
import { BrowserRouter } from 'react-router-dom';

describe("About page tests", () => {
    test('Should render about page', () => {
        render(<AboutPage />, { wrapper: BrowserRouter });
        const pageTitle = screen.getByRole('heading', { level: 2 });
        const description = screen.getByText("Ce projet est une simple application d'achat.");
        const instructions = screen.getByText("Vous pouvez ajouter des produits à votre panier à partir du menu principal.");
        expect(pageTitle).toHaveTextContent('PolyZon');
        expect(description).toBeInTheDocument();
        expect(instructions).toBeInTheDocument();
    });
})