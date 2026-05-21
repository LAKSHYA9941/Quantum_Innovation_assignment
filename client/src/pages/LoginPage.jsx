import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const formRef = useRef(null);

  const [form, setForm]        = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]  = useState(false);
  const [error, setError]      = useState('');

  const handleChange = (e) => {
    setError('');
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const shakeForm = () => {
    const el = formRef.current;
    if (!el) return;
    el.classList.remove('shake');
    void el.offsetWidth;
    el.classList.add('shake');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Please fill in both email and password.');
      shakeForm();
      return;
    }

    setLoading(true);
    try {
      const data = await login(form);
      toast.success(data.message || 'Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      setError(msg);
      shakeForm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative" style={{ background: 'var(--bg-primary)' }}>
      <div className="grid-bg" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand */}
        <div className="text-center mb-8 fade-up">
          <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>
            Welcome Back
          </h1>
        </div>

        {/* Card */}
        <div ref={formRef} className="rounded-2xl p-8 card-glow fade-up fade-up-1" style={{ background: 'var(--bg-card)' }}>

          {/* Tabs */}
          <div className="flex mb-8 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <span className="pb-3 px-4 text-sm font-semibold tab-active cursor-default"
              style={{ fontFamily: 'Syne, sans-serif', letterSpacing: '0.05em' }}>SIGN IN</span>
            <Link to="/register" className="pb-3 px-4 text-sm font-semibold transition-colors"
              style={{ color: 'var(--text-muted)', fontFamily: 'Syne, sans-serif', letterSpacing: '0.05em' }}>REGISTER</Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* Inline error banner */}
            {error && (
              <div className="error-banner">
                <AlertCircle size={15} style={{ color: '#f87171', flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* Email */}
            <div className="fade-up fade-up-2">
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="auth-input w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                  style={error && !form.email ? { borderColor: 'rgba(239,68,68,0.5)' } : {}}
                />
              </div>
            </div>

            {/* Password */}
            <div className="fade-up fade-up-3">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Password
                </label>
                <button type="button" className="text-xs transition-colors hover:underline" style={{ color: 'var(--accent-cyan)' }}>
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="auth-input w-full pl-10 pr-10 py-3 rounded-xl text-sm"
                  style={error && !form.password ? { borderColor: 'rgba(239,68,68,0.5)' } : {}}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="fade-up fade-up-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-cyan w-full py-3.5 rounded-xl text-sm tracking-widest uppercase"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Signing in…
                  </span>
                ) : 'Login'}
              </button>
            </div>
          </form>

          <p className="text-center mt-6 text-sm fade-up fade-up-5" style={{ color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold transition-colors hover:underline" style={{ color: 'var(--accent-cyan)' }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}