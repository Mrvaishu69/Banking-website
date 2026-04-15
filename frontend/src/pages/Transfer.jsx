import { useState, useEffect } from 'react';
import { getAccounts, transferMoney } from '../services/api';
import { toast } from 'react-toastify';

const Transfer = () => {
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({
    fromAccountId: '', toAccountNumber: '', amount: '', description: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const { data } = await getAccounts();
        setAccounts(data.data.accounts);
        if (data.data.accounts.length > 0) {
          setFormData(prev => ({ ...prev, fromAccountId: data.data.accounts[0]._id }));
        }
      } catch (err) {
        toast.error('Failed to load accounts');
      }
    };
    fetchAccounts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await transferMoney(formData);
      toast.success(data.message);
      setFormData(prev => ({ ...prev, toAccountNumber: '', amount: '', description: '' }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Transfer failed');
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="page-header">
        <h1>🔄 Transfer Money</h1>
        <p>Send money to another Great Vaishu Bank account</p>
      </div>

      <div className="card" style={{ maxWidth: '500px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>From Account</label>
            <select value={formData.fromAccountId} onChange={(e) => setFormData({ ...formData, fromAccountId: e.target.value })} required>
              {accounts.map(acc => (
                <option key={acc._id} value={acc._id}>
                  {acc.accountNumber} ({acc.accountType}) — ${acc.balance.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Recipient Account Number</label>
            <input type="text" placeholder="e.g., GV123456781234" value={formData.toAccountNumber} onChange={(e) => setFormData({ ...formData, toAccountNumber: e.target.value })} required />
          </div>

          <div className="form-group">
            <label>Amount ($)</label>
            <input type="number" step="0.01" min="0.01" placeholder="Enter amount" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
          </div>

          <div className="form-group">
            <label>Description (optional)</label>
            <input type="text" placeholder="e.g., Rent, Dinner split" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Transferring...' : '🔄 Transfer Now'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Transfer;