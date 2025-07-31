import { useContext } from 'react';
import ProductContext from '../contexts/ProductContext';
import { Link } from 'react-router-dom';
import { SERVER_URL } from '../utils/consts';
import { ACTIONS } from '../reducer/reducer';
import '../styles/ProductCard.css';

export default function ProductCard({ product }) {
  const { state, dispatch } = useContext(ProductContext);

  const isInShoppingCart = () => {
    return state.cartProducts.some((x) => x.id === product.id);
  };

  return (
    <>
      <div className='card'>
        {/* TODO : compléter l'affichage des informations du produit */}
        <h3>{product.name}</h3>
        <div className='image-container'>
          <Link to={`/products/${product.id}`}>
            <img
              alt='Product for sale'
              src={product.thumbnail ? `${SERVER_URL}/${product.thumbnail}` : ''}
            />
          </Link>
        </div>
        <div className='action-buttons'>
          {isInShoppingCart() ? (
            <button
              onClick={() => {
                dispatch({ type: ACTIONS.REMOVE_FROM_CART, payload: { id: product.id } });
              }}
              className='base-button remove-from-cart'
            >
              Retirer du panier
            </button>
          ) : (
            <button
              onClick={() => {
                dispatch({ type: ACTIONS.ADD_TO_CART, payload: { product } });
              }}
              className='base-button add-to-cart'
            >
              Ajouter au panier
            </button>
          )}
        </div>
      </div>
    </>
  );
}
