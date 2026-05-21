import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0d1526',
            color: '#e8f4f8',
            border: '1px solid rgba(0,229,255,0.15)',
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#00e5ff', secondary: '#060b14' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#060b14' } },
        }}
      />
    </AuthProvider>
  );
}
