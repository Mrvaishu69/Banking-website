import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getHistory } from '../services/api';
import TransactionCard from '../components/TransactionCard';

const History = () => {
  const { accounts } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchHistory();
  }, [filter, page]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (filter) params.type = filter;
      const res = await getHistory(params);
      setTransactions(res.data.transactions);
      setTotalPages(res.data.pages);
    } catch (error) {
      console.error('Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📜 Transaction History</h1>
        <p>View all your past transactions</p>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === '' ? 'active' : ''}`}
          onClick={() => handleFilterChange('')}
        >
          All
        </button>
        <button
          className={`filter-tab ${filter === 'deposit' ? 'active' : ''}`}
          onClick={() => handleFilterChange('deposit')}
        >
          💰 Deposits
        </button>
        <button
          className={`filter-tab ${filter === 'withdrawal' ? 'active' : ''}`}
          onClick={() => handleFilterChange('withdrawal')}
        >
          💳 Withdrawals
        </button>
        <button
          className={`filter-tab ${filter === 'transfer' ? 'active' : ''}`}
          onClick={() => handleFilterChange('transfer')}
        >
          🔄 Transfers
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading"><div className="spinner"></div></div>
        ) : transactions.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📭</div>
            <p>No transactions found{filter ? ` for "${filter}"` : ''}</p>
          </div>
        ) : (
          <>
            {transactions.map((txn) => (
              <TransactionCard
                key={txn._id}
                transaction={txn}
                userAccountIds={accounts.map(a => a._id)}
              />
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
                <button
                  className="btn btn-outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  ← Previous
                </button>
                <span style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', fontWeight: 600 }}>
                  Page {page} of {totalPages}
                </span>
                <button
                  className="btn btn-outline"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default History;