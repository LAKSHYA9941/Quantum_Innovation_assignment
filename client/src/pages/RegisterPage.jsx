import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Calendar, UserPlus } from 'lucide-react';
import { useAuth } from '../AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({ name: '', dateOfBirth: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.name.trim() || form.name.trim().length < 2) {
      toast.error('Name must be at least 2 characters'); return false;
    }
    if (!form.dateOfBirth) {
      toast.error('Date of birth is required'); return false;
    }
    if (new Date(form.dateOfBirth) >= new Date()) {
      toast.error('Date of birth must be in the past'); return false;
    }
    if (!form.email) {
      toast.error('Email is required'); return false;
    }
    if (!form.password || form.password.length < 6) {
      toast.error('Password must be at least 6 characters'); return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await register(form);
      toast.success(data.message || 'Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Password strength
  const strength = (() => {
    const p = form.password;
    if (!p) return null;
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthLabel = strength === null ? null :
    strength <= 1 ? { label: 'Weak', color: '#ef4444' } :
    strength <= 3 ? { label: 'Medium', color: '#f59e0b' } :
    { label: 'Strong', color: '#10b981' };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative" style={{ background: 'var(--bg-primary)' }}>
      <div className="grid-bg" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand */}
        <div className="text-center mb-8 fade-up">
          <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>
            Create Account
          </h1>
        </div>

        <div className="rounded-2xl p-8 card-glow fade-up fade-up-1" style={{ background: 'var(--bg-card)' }}>
          {/* Tabs */}
          <div className="flex mb-8 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <Link to="/login" className="pb-3 px-4 text-sm font-semibold transition-colors"
              style={{ color: 'var(--text-muted)', fontFamily: 'Syne, sans-serif', letterSpacing: '0.05em' }}>
              SIGN IN
            </Link>
            <span className="pb-3 px-4 text-sm font-semibold tab-active cursor-default"
              style={{ fontFamily: 'Syne, sans-serif', letterSpacing: '0.05em' }}>
              REGISTER
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="fade-up fade-up-2">
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  autoComplete="name"
                  className="auth-input w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div className="fade-up fade-up-2">
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Date of Birth
              </label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="date"
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  className="auth-input w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            </div>

            {/* Email */}
            <div className="fade-up fade-up-3">
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
                />
              </div>
            </div>

            {/* Password */}
            <div className="fade-up fade-up-4">
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="auth-input w-full pl-10 pr-10 py-3 rounded-xl text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Password strength bar */}
              {strengthLabel && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4,5].map((i) => (
                      <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{ background: i <= strength ? strengthLabel.color : 'var(--border-subtle)' }} />
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: strengthLabel.color }}>{strengthLabel.label} password</p>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="fade-up fade-up-5 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-cyan w-full py-3.5 rounded-xl text-sm tracking-widest uppercase"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Creating account…
                  </span>
                ) : 'Create Account'}
              </button>
            </div>
          </form>

          <p className="text-center mt-6 text-sm fade-up" style={{ color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold transition-colors hover:underline" style={{ color: 'var(--accent-cyan)' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
