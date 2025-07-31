import { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductContext from '../contexts/ProductContext';
import { SERVER_URL } from '../utils/consts';
import { ACTIONS } from '../reducer/reducer';
import '../styles/Product.css';

function ProductPage() {
  const params = useParams(); // Récupère les paramètres de l'URL
  const [product, setProduct] = useState({});
  const { state, dispatch, api } = useContext(ProductContext);
  const [isProductInCart, setIsProductInCart] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  // TODO : Ajout les bonnes dépendances pour éviter les appels en boucle
  useEffect(() => {
    updateProductInCart();
  }, [state.cartProducts, product]);

  const fetchData = async () => {
    const product = await api.getProductById(params.id);
    setProduct(product);
  };

  // TODO : Vérifier si le produit est déjà dans le panier et mettre à jour l'attribut isProductInCart
  const updateProductInCart = () => {
    const exists = state.cartProducts.some((item) => item.name === product.name);
    setIsProductInCart(exists);
  };

  return (
    <>
      <main>
        <section className='product-page-wrapper'>
          <div className='product-page'>
            <img
              alt='Product for sale'
              src={product.thumbnail ? `${SERVER_URL}/${product.thumbnail}` : ''}
            />
          </div>
          <div>
            <h2 id='product-name' className='h2-padding-removed'>{product.name}</h2>
            <p id='product-stars'>{product.stars}/5 <i className='fa-solid fa-star'></i></p>
            <p id='product-description'>
              <strong>Description:</strong> {product.description}
            </p>
            <p id='product-price'>
              <strong>Prix:</strong> {product.price}
            </p>
          </div>
          <div>
            <h2 className='h2-padding-removed'> Procéder à l'achat</h2>
            <div className='purchase-buttons-wrapper'>
              <div>
                {isProductInCart ? (
                  <button
                    id='remove-from-cart-btn'
                    onClick={() => {
                      dispatch({ type: ACTIONS.REMOVE_FROM_CART, payload: { id: product.id } });
                    }}
                    className='base-button remove-from-cart from-product-page'
                  >
                    Retirer du panier
                  </button>
                ) : (
                  <button
                    id='add-to-cart-btn'
                    onClick={() => {
                      dispatch({ type: ACTIONS.ADD_TO_CART, payload: { product } });
                    }}
                    className='base-button add-to-cart from-product-page'
                  >
                    Ajouter au panier
                  </button>
                )}
              </div>

              <button
                id='buy-now-btn'
                onClick={() => {
                  dispatch({ type: ACTIONS.BUY_NOW, payload: { product } });
                  window.alert('Produit acheté avec succès');
                }}
                className='base-button buy-now from-product-page'
              >
                Acheter Maintenant
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default ProductPage;

// purchase-button-remove et purchase-button-buy
