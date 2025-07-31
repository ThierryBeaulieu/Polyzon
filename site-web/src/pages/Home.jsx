import { useState, useEffect, useContext } from 'react';
import ProductCard from '../components/ProductCard';
import ProductContext from '../contexts/ProductContext';
import '../styles/Home.css';

function HomePage() {
  const api = useContext(ProductContext).api;
  const [products, setProducts] = useState([]);

  // TODO : Récupérer la liste des produits depuis le serveur. Utilisez l'attribut api de ProductContext
  useEffect(() => {
    api
      .getAllProducts()
      .then((products) => setProducts(products))
      .catch(() => setProducts([]));
  }, []);

  return (
    <>
      <main>
        <section>
          <h2>Tous les produits</h2>
          <div className='available-products'>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

export default HomePage;
