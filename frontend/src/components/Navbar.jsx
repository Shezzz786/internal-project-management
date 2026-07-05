import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, LayoutDashboard } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="glass-panel flex-between" style={{ padding: '1rem 2rem', marginBottom: '2rem', borderRadius: '0 0 16px 16px', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
      <div className="flex-center" style={{ gap: '0.5rem' }}>
        <LayoutDashboard color="var(--primary-color)" />
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>ProjectManager</Link>
        </h2>
      </div>
      <div className="flex-center" style={{ gap: '1.5rem' }}>
        <span style={{ color: 'var(--text-muted)' }}>Welcome, {user.username}</span>
        <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
          <LogOut size={18} /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
