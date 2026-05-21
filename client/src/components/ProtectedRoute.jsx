import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--accent-cyan)', borderTopColor: 'transparent' }} />
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
