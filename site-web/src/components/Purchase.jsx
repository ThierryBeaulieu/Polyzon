import { useContext, useEffect, useState } from 'react';
import ProductContext from '../contexts/ProductContext';
import { CircularProgress } from '@mui/material';
import { ACTIONS } from '../reducer/reducer';
import '../styles/App.css';
import '../styles/Purchase.css';

function Purchase({purchase, updatePurchases}) {
  const api = useContext(ProductContext).api;
  const { dispatch } = useContext(ProductContext);
  const [isLoading, setIsLoading] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const fetchedProducts = await api.getPurchaseContent(purchase.id);
    setProducts(fetchedProducts);
    setIsLoading(false);
  };

  // TODO : implémenter la demande de remboursement
  const handleRefund = (purchaseId) => {
    dispatch({ type: ACTIONS.REFUND_PURCHASE, payload: { id: purchaseId } });
    updatePurchases(purchaseId);
  };

  return (
    <>
      <div className='purchase'>
        {isLoading ? (
          <div className='circular-progress-bar'>
            <CircularProgress color='inherit' />
          </div>
        ) : (
          <>
          {/* TODO : Afficher le nom et le prix des produits */}
            {products.map((product) => (
              <div className='purchased-products' key={product.id}>
                <div>{product.name}</div>
                <div>{product.price}</div>
              </div>
            ))}
          </>
        )}
        {/* TODO : Afficher le prix total de la commande avec 2 décimales de précision */}
        <div className='cost'>Prix total: {Number(purchase.totalCost).toFixed(2)} $</div>
        <button onClick={() => handleRefund(purchase.id)} className='base-button refund'>
          Rembourser la commande
        </button>
      </div>
    </>
  );
}

export default Purchase;
