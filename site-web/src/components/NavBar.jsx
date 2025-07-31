import { useContext } from 'react';
import { Link } from 'react-router-dom';
import SearchBox from './SearchBox';
import ProductContext from '../contexts/ProductContext';
import '../styles/NavBar.css';


function NavBar() {
  const { state } = useContext(ProductContext);
  return (
    <>
      <header>
        <nav>
          <ul className='flex-center'>
            <li>
              <Link to='/'>
                <img
                  alt='logo'
                  id='logoPolyZonWhite'
                  src='/LogoPolyZonWhite.png'
                ></img>
              </Link>
            </li>
            <SearchBox />
            <li>
              <Link to='/about' className='nav-link'>
                À propos
              </Link>
            </li>
            <li>
              <Link to='/cart' className='nav-link'>
                <i id='cart-icon' className='fa-solid fa-cart-shopping shopping-cart'></i>
                Panier ({state.cartProducts.length})
              </Link>
            </li>
            <li>
              <Link to='/returns' className='nav-link'>
                Retour
                <br />
                <strong>et commande</strong>
              </Link>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}

export default NavBar;
