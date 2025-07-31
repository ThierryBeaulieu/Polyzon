import { useReducer } from 'react';
import HTTPManager from '../utils/http_manager';
import ProductContext from './ProductContext';
import reducer from '../reducer/reducer';

const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    cartProducts: [],
    searchProducts: [],
  });
  const api = new HTTPManager();
  return (
    <ProductContext.Provider value={{ state, dispatch, api }}>{children}</ProductContext.Provider>
  );
};

export default ProductProvider;
