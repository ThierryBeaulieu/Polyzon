import { useContext, useState, useEffect } from 'react';
import ProductContext from '../contexts/ProductContext';
import CircularProgress from '@mui/material/CircularProgress';
import Purchase from '../components/Purchase';
import '../styles/Returns.css';

function ReturnsPage() {
  const api = useContext(ProductContext).api;
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    let fetchedPurchases;
    try {
      fetchedPurchases = await api.getAllPurchases();
    } catch (err) {
      fetchedPurchases = [];
    }
    setPurchases(fetchedPurchases);
    setIsLoading(false);
  };

  // TODO : Vérifier si l'historique des commandes est vide
  const isPurchaseHistoryEmpty = () => {
    return purchases.length === 0;
  };

  const updatePurchases = (purchaseId) => {
    setPurchases((prevPurchases) => prevPurchases.filter((purchase) => purchase.id !== purchaseId));
  };

  return (
    <>
      <main>
        <section>
          <h2>Produits achetés récemment</h2>
          {isLoading ? (
            <div className='circular-progress-bar'>
              <CircularProgress color='inherit' />
            </div>
          ) : (
            <>
              {isPurchaseHistoryEmpty() && (
                <div className='no-available-product'>
                  <h3>Aucun produit n'a été acheté</h3>
                </div>
              )}
              <div className='products-bought'>
                {/* TODO : Afficher toutes les commandes */}
                {purchases.map((purchase) => (
                  <Purchase purchase={purchase} updatePurchases={updatePurchases} key={purchase.id} />
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </>
  );
}

export default ReturnsPage;
