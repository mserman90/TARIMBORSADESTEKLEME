import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AppLayout } from '@/components/AppLayout';
import { LandingPage } from '@/pages/LandingPage';
import { AuthPage } from '@/pages/AuthPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { MarketPage } from '@/pages/MarketPage';
import { NewsPage } from '@/pages/NewsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<MarketPage />} />
            <Route path="supports" element={<MarketPage />} />
            <Route path="products/:slug" element={<ProductDetailPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="news" element={<NewsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
