import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="logo">🏦</span>
        <h1>Great <span>Vaishu</span> Bank</h1>
      </Link>

      <div className="nav-links">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
            <Link to="/deposit" className={isActive('/deposit')}>Deposit</Link>
            <Link to="/withdraw" className={isActive('/withdraw')}>Withdraw</Link>
            <Link to="/transfer" className={isActive('/transfer')}>Transfer</Link>
            <Link to="/transactions" className={isActive('/transactions')}>History</Link>
            <button onClick={handleLogout} className="btn-logout">
              Logout ({user?.fullName?.split(' ')[0]})
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={isActive('/login')}>Login</Link>
            <Link to="/register" className={isActive('/register')}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;