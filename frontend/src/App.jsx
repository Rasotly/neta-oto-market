import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { ProductProvider } from './context/ProductContext';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';
import ProfileDashboard from './pages/ProfileDashboard';
import ProductDetail from './pages/ProductDetail';
import WhatsAppButton from './components/WhatsAppButton';
import About from './pages/About';
import ReturnPolicy from './pages/ReturnPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import SecurityPolicy from './pages/SecurityPolicy';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <ProductProvider>
          <CartProvider>
          <Toaster 
            position="bottom-right" 
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#4b5563',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
            }}
          />
          
          <ScrollToTop />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/register" element={<Auth />} />
            <Route path="/profile" element={<ProfileDashboard />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/hakkimizda" element={<About />} />
            <Route path="/iade-kosullari" element={<ReturnPolicy />} />
            <Route path="/gizlilik-politikasi" element={<PrivacyPolicy />} />
            <Route path="/gizlilik-ve-guvenlik" element={<SecurityPolicy />} />
          </Routes>
          
          <WhatsAppButton />

          </CartProvider>
        </ProductProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;