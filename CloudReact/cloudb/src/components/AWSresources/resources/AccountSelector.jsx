import React from 'react';

const AccountSelector = ({ cloudAccounts, selectedAccount, setSelectedAccount }) => {
  return (
    <div className="account-selector">
      <label>Cloud Account:</label>
      <select
        value={selectedAccount?.id || ''}
        onChange={(e) => {
          const accountId = e.target.value;
          const account = cloudAccounts.find(acc => acc.id.toString() === accountId);
          setSelectedAccount(account);
        }}
      >
        <option value="">Select an account</option>
        {cloudAccounts.map(account => (
          <option key={account.id} value={account.id}>
            {account.cloudAccountName} ({account.cloudAccountId})
          </option>
        ))}
      </select>
    </div>
  );
};

export default AccountSelector;