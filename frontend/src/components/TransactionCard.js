import React from 'react';

const TransactionCard = ({ transaction, userAccountIds = [] }) => {
  const { type, amount, description, createdAt, status } = transaction;

  const isCredit = type === 'deposit' ||
    (type === 'transfer' && transaction.toAccount &&
      userAccountIds.includes(transaction.toAccount._id || transaction.toAccount));

  const iconMap = {
    deposit: '⬇️',
    withdrawal: '⬆️',
    transfer: '🔄'
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="transaction-item">
      <div className={`transaction-icon ${type}`}>
        {iconMap[type] || '💵'}
      </div>
      <div className="transaction-details">
        <div className="txn-type">{type}</div>
        <div className="txn-desc">{description}</div>
        <div className="txn-date">{formatDate(createdAt)} • {status}</div>
      </div>
      <div className={`transaction-amount ${isCredit ? 'positive' : 'negative'}`}>
        {isCredit ? '+' : '-'}${amount.toFixed(2)}
      </div>
    </div>
  );
};

export default TransactionCard;