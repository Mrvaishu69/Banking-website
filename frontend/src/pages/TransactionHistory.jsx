import { useState, useEffect } from 'react';
import { getTransactionHistory } from '../services/api';
import { toast } from 'react-toastify';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTransactions();
  }, [filter, page]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const { data } = await getTransactionHistory({ type: filter, page, limit: 15 });
      setTransactions(data.data.transactions);
      setTotalPages(data.data.totalPages);
    } catch (error) {
      toast.error('Failed to load transactions');
    }
    setLoading(false);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getIcon = (type) => {
    switch(type) {
      case 'deposit': return '💵';
      case 'withdrawal': return '🏧';
      case 'transfer': return '🔄';
      default: return '💳';
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>📜 Transaction History</h1>
        <p>View all your past transactions</p>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        {['all', 'deposit', 'withdrawal', 'transfer'].map(f => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => { setFilter(f); setPage(1); }}
          >
            {f === 'all' ? '📋 All' : f === 'deposit' ? '💵 Deposits' : f === 'withdrawal' ? '🏧 Withdrawals' : '🔄 Transfers'}
          </button>
        ))}
      </div>

      <div className="card">
        {loading ? (
          <div className="loading-screen"><div className="spinner"></div></div>
        ) : transactions.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📭</div>
            <h3>No transactions found</h3>
            <p>Your transaction history will appear here.</p>
          </div>
        ) : (
          <>
            <ul className="transaction-list">
              {transactions.map(txn => (
                <li key={txn._id} className="transaction-item">
                  <div className="transaction-left">
                    <div className={`txn-icon ${txn.type}`}>{getIcon(txn.type)}</div>
                    <div className="txn-details">
                      <h4>{txn.description || txn.type.charAt(0).toUpperCase() + txn.type.slice(1)}</h4>
                      <p>{formatDate(txn.createdAt)} • Ref: {txn.referenceId}</p>
                    </div>
                  </div>
                  <div className={`txn-amount ${txn.type === 'deposit' ? 'positive' : 'negative'}`}>
                    {txn.type === 'deposit' ? '+' : '-'}${txn.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </li>
              ))}
            </ul>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
                <button className="filter-btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>← Previous</button>
                <span style={{ padding: '0.5rem 1rem', fontWeight: 600 }}>Page {page} of {totalPages}</span>
                <button className="filter-btn" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;