import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAccounts, getTransactionHistory } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [accRes, txnRes] = await Promise.all([
        getAccounts(),
        getTransactionHistory({ limit: 5 })
      ]);
      setAccounts(accRes.data.data.accounts);
      setTotalBalance(accRes.data.data.totalBalance);
      setRecentTransactions(txnRes.data.data.transactions);
    } catch (error) {
      console.error('Failed to load dashboard data');
    }
    setLoading(false);
  };

  if (loading) return <div className="loading-screen"><div><div className="spinner"></div>Loading your dashboard...</div></div>;

  return (
    <div>
      {/* Welcome Banner */}
      <div className="dashboard-welcome">
        <h1>Welcome back, {user?.fullName?.split(' ')[0]}! 👋</h1>
        <p>Here's an overview of your Great Vaishu Bank accounts.</p>
      </div>

      {/* Stats */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon balance">💰</div>
          <div className="stat-info">
            <h3>Total Balance</h3>
            <p>${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon account">🏧</div>
          <div className="stat-info">
            <h3>Accounts</h3>
            <p>{accounts.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon transactions">📊</div>
          <div className="stat-info">
            <h3>Recent Transactions</h3>
            <p>{recentTransactions.length}</p>
          </div>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h2>Your Accounts</h2>
        </div>
        <table className="accounts-table">
          <thead>
            <tr>
              <th>Account Number</th>
              <th>Type</th>
              <th>Balance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map(acc => (
              <tr key={acc._id}>
                <td className="account-number">{acc.accountNumber}</td>
                <td><span className={`badge badge-${acc.accountType}`}>{acc.accountType}</span></td>
                <td><strong>${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></td>
                <td><span className="badge badge-savings">{acc.isActive ? 'Active' : 'Inactive'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h2>Quick Actions</h2>
        </div>
        <div className="quick-actions">
          <Link to="/deposit" className="quick-action-btn">
            <span className="icon">💵</span>
            <span className="label">Deposit</span>
          </Link>
          <Link to="/withdraw" className="quick-action-btn">
            <span className="icon">🏧</span>
            <span className="label">Withdraw</span>
          </Link>
          <Link to="/transfer" className="quick-action-btn">
            <span className="icon">🔄</span>
            <span className="label">Transfer</span>
          </Link>
          <Link to="/transactions" className="quick-action-btn">
            <span className="icon">📜</span>
            <span className="label">History</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;