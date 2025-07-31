import { Routes, Route } from 'react-router-dom';
import ProductProvider from './contexts/ProductProvider';
import HomePage from './pages/Home';
import AboutPage from './pages/About';
import CartPage from './pages/Cart';
import ReturnsPage from './pages/Returns';
import ProductPage from './pages/Product';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import SearchPage from './pages/Search';
import './styles/App.css';

function App() {
  const routes = [
    { path: '/about', element: <AboutPage /> },
    { path: '/returns', element: <ReturnsPage /> },
    { path: '/products/:id', element: <ProductPage /> },
    { path: '/cart', element: <CartPage /> },
    { path: '/search', element: <SearchPage /> },
    { path: '/', element: <HomePage /> },
  ];

  return (
    <div id='container'>
      <ProductProvider>
        <NavBar />
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
        <Footer />
      </ProductProvider>
    </div>
  );
}

export default App;
