import { useState, useEffect } from 'react';
import { getAccounts, withdrawMoney } from '../services/api';
import { toast } from 'react-toastify';

const Withdraw = () => {
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({ accountId: '', amount: '', description: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const { data } = await getAccounts();
        setAccounts(data.data.accounts);
        if (data.data.accounts.length > 0) {
          setFormData(prev => ({ ...prev, accountId: data.data.accounts[0]._id }));
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
      const { data } = await withdrawMoney(formData);
      toast.success(data.message);
      setFormData(prev => ({ ...prev, amount: '', description: '' }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Withdrawal failed');
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="page-header">
        <h1>🏧 Withdraw Money</h1>
        <p>Withdraw funds from your Great Vaishu Bank account</p>
      </div>

      <div className="card" style={{ maxWidth: '500px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Account</label>
            <select name="accountId" value={formData.accountId} onChange={(e) => setFormData({ ...formData, accountId: e.target.value })} required>
              {accounts.map(acc => (
                <option key={acc._id} value={acc._id}>
                  {acc.accountNumber} ({acc.accountType}) — ${acc.balance.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Amount ($)</label>
            <input type="number" step="0.01" min="0.01" placeholder="Enter amount" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
          </div>

          <div className="form-group">
            <label>Description (optional)</label>
            <input type="text" placeholder="e.g., ATM, Bill payment" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>

          <button type="submit" className="btn btn-danger" disabled={loading}>
            {loading ? 'Processing...' : '🏧 Withdraw Now'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Withdraw;