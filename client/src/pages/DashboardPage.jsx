import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, Settings, X, ChevronLeft, ChevronRight,
  Shield, Users, TrendingUp, Activity
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import toast from 'react-hot-toast';

// Static demo data
const TABLE_DATA = [
  { id: 1, name: 'Michael Holz', avatar: 'MH', dateCreated: '04/10/2013', role: 'Admin', status: 'active', color: '#0ea5e9' },
  { id: 2, name: 'Paula Wilson', avatar: 'PW', dateCreated: '05/08/2014', role: 'Publisher', status: 'active', color: '#8b5cf6' },
  { id: 3, name: 'Antonio Moreno', avatar: 'AM', dateCreated: '11/05/2015', role: 'Publisher', status: 'suspended', color: '#f97316' },
  { id: 4, name: 'Mary Saveley', avatar: 'MS', dateCreated: '06/09/2016', role: 'Reviewer', status: 'active', color: '#10b981' },
  { id: 5, name: 'Martin Sommer', avatar: 'MT', dateCreated: '12/08/2017', role: 'Moderator', status: 'inactive', color: '#6366f1' },
  { id: 6, name: 'Aria Nakamura', avatar: 'AN', dateCreated: '03/14/2018', role: 'Editor', status: 'active', color: '#ec4899' },
  { id: 7, name: 'Carlos Rivera', avatar: 'CR', dateCreated: '07/22/2019', role: 'Publisher', status: 'active', color: '#14b8a6' },
  { id: 8, name: 'Lena Fischer', avatar: 'LF', dateCreated: '01/11/2020', role: 'Reviewer', status: 'suspended', color: '#f59e0b' },
  { id: 9, name: 'James Okafor', avatar: 'JO', dateCreated: '09/30/2021', role: 'Moderator', status: 'active', color: '#ef4444' },
  { id: 10, 'name': 'Sophie Laurent', avatar: 'SL', dateCreated: '02/17/2022', role: 'Admin', status: 'inactive', color: '#a78bfa' },
  { id: 11, name: 'Riku Tanaka', avatar: 'RT', dateCreated: '05/03/2023', role: 'Publisher', status: 'active', color: '#34d399' },
  { id: 12, name: 'Priya Sharma', avatar: 'PS', dateCreated: '08/19/2023', role: 'Editor', status: 'active', color: '#fb923c' },
];

const PAGE_SIZE = 5;

const statusConfig = {
  active: { label: 'Active', cls: 'badge-active' },
  inactive: { label: 'Inactive', cls: 'badge-inactive' },
  suspended: { label: 'Suspended', cls: 'badge-suspended' },
};


export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  const totalPages = Math.ceil(TABLE_DATA.length / PAGE_SIZE);
  const pageData = TABLE_DATA.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully');
    navigate('/login');
  };

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="grid-bg" />

      {/* Top nav */}
      <header className="relative z-10 border-b" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold text-base" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>
              Quantum<span style={{ color: 'var(--accent-cyan)' }}>IT</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-teal))', color: '#060b14' }}>
                {initials}
              </div>
              <div>
                <p className="text-sm font-semibold leading-none" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
                <p className="text-xs leading-none mt-0.5" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:opacity-80"
              style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Welcome */}
        <div className="mb-8 fade-up">
          <h2 className="text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>
            Good to see you, <span style={{ color: 'var(--accent-cyan)' }}>{user?.name?.split(' ')[0]}</span>
          </h2>
        </div>
        {/* Table card */}
        <div className="rounded-2xl overflow-hidden card-glow fade-up" style={{ background: 'var(--bg-card)' }}>
          {/* Table header */}
          <div className="px-6 py-5 flex items-center justify-center border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <div>
              <h3 className="font-bold text-base" style={{ fontFamily: 'Syne, sans-serif' }}>User Management</h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{TABLE_DATA.length} total records</p>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  {['#', 'Name', 'Date Created', 'Role', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--text-muted)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageData.map((row, idx) => (
                  <tr
                    key={row.id}
                    className="table-row-hover transition-colors"
                    style={{
                      borderBottom: idx < pageData.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                      opacity: 0, animation: `fadeUp 0.3s ease ${idx * 0.05}s both`
                    }}
                  >
                    <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-muted)' }}>{row.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ background: `${row.color}22`, color: row.color, border: `1px solid ${row.color}44` }}>
                          {row.avatar}
                        </div>
                        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{row.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-muted)' }}>{row.dateCreated}</td>
                    <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-primary)' }}>{row.role}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig[row.status].cls}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {statusConfig[row.status].label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                          style={{ background: 'rgba(0,229,255,0.1)', color: 'var(--accent-cyan)' }}
                          title="Settings">
                          <Settings size={13} />
                        </button>
                        <button
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                          style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}
                          title="Remove"
                          onClick={() => { toast('Action noted (demo mode — read only)', { icon: 'ℹ️' }); }}
                        >
                          <X size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 flex items-center justify-between border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, TABLE_DATA.length)} of {TABLE_DATA.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                style={{ background: 'var(--bg-input)', color: 'var(--text-primary)' }}
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className="w-8 h-8 rounded-lg text-xs font-semibold transition-all"
                  style={n === page
                    ? { background: 'var(--accent-cyan)', color: '#060b14' }
                    : { background: 'var(--bg-input)', color: 'var(--text-muted)' }}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                style={{ background: 'var(--bg-input)', color: 'var(--text-primary)' }}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Session info card */}
        <div className="mt-6 rounded-xl p-5 fade-up" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
            Your Session
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Name', value: user?.name },
              { label: 'Email', value: user?.email },
              { label: 'Date of Birth', value: user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : '—' },
              { label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
                <p className="text-sm font-medium mt-0.5 truncate" style={{ color: 'var(--text-primary)' }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
