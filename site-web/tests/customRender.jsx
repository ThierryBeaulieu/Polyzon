import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductContext from '../src/contexts/ProductContext';

const customRender = (ui, { providerProps }, renderFn = render) => {
    return renderFn(<ProductContext.Provider {...providerProps}>{ui}</ProductContext.Provider>,
        { wrapper: BrowserRouter });
};

export default customRender;