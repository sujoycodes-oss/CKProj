import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { MdArrowForwardIos, MdOutlineArrowBackIosNew } from "react-icons/md";
import "../../../styles/CloudAccountSelector.css";

const CloudAccountSelector = ({ onAccountsSelected, selectedRole }) => {
  const [availableAccounts, setAvailableAccounts] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get token from Redux store
  const authData = useSelector(state => state.auth);

  useEffect(() => {
    // Reset selected accounts when role changes away from customer
    if (selectedRole.toLowerCase() !== 'customer') {
      setSelectedAccounts([]);
      onAccountsSelected([]);
    }
  }, [selectedRole, onAccountsSelected]);

  useEffect(() => {
    // Only fetch accounts when the role is customer
    if (selectedRole.toLowerCase() === 'customer') {
      fetchCloudAccounts();
    }
  }, [selectedRole, authData.token]);

  const fetchCloudAccounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8080/auth/admin/cloudAccounts', {
        headers: {
          'Authorization': `Bearer ${authData.token}`
        }
      });
      setAvailableAccounts(response.data || []);
    } catch (err) {
      console.error('Error fetching cloud accounts:', err);
      setError('Failed to load cloud accounts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredAccounts = availableAccounts.filter(account =>
    account.cloudAccountName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.cloudAccountId?.toString().includes(searchTerm)
  );

  const handleAccountSelect = (accountId) => {
    const newSelected = selectedAccounts.includes(accountId)
      ? selectedAccounts.filter(id => id !== accountId)
      : [...selectedAccounts, accountId];
    
    setSelectedAccounts(newSelected);
    onAccountsSelected(newSelected);
  };

  const handleMoveAll = (direction) => {
    if (direction === 'right') {
      const newSelected = [...new Set([...selectedAccounts, ...filteredAccounts.map(a => a.id)])];
      setSelectedAccounts(newSelected);
      onAccountsSelected(newSelected);
    } else {
      setSelectedAccounts([]);
      onAccountsSelected([]);
    }
  };

  // Don't render anything if role is not customer
  if (selectedRole.toLowerCase() !== 'customer') {
    return null;
  }

  return (
    <div className="account-selector">
      <h3>Manage Account ID(s)</h3>
      {loading && <p className="loading-text">Loading accounts...</p>}
      {error && <p className="error-text">{error}</p>}
      
      {!loading && !error && (
        <div className="account-container">
          <div className="account-section">
            <div className="search-section">
              <h4>Choose Account IDs to Associate</h4>
              <input
                type="text"
                placeholder="Search accounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="accounts-list">
              {filteredAccounts.length === 0 ? (
                <p className="no-accounts">No accounts found</p>
              ) : (
                filteredAccounts.map(account => (
                  <div
                    key={account.id}
                    className="account-item"
                    onClick={() => handleAccountSelect(account.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedAccounts.includes(account.id)}
                      onChange={() => handleAccountSelect(account.id)}
                    />
                    <span>{account.cloudAccountName} ({account.cloudAccountId})</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="transfer-buttons">
            <button onClick={() => handleMoveAll('right')} type="button">
              <MdArrowForwardIos />
            </button>
            <button onClick={() => handleMoveAll('left')} type="button">
              <MdOutlineArrowBackIosNew />
            </button>
          </div>

          <div className="account-section">
            <h4>Associated Account IDs</h4>
            <div className="accounts-list">
              {selectedAccounts.length === 0 ? (
                <div className="no-accounts">
                  <p>No Account IDs Added</p>
                  <p>Selected Account IDs will be shown here.</p>
                </div>
              ) : (
                availableAccounts
                  .filter(account => selectedAccounts.includes(account.id))
                  .map(account => (
                    <div key={account.id} className="account-item">
                      <span>{account.cloudAccountName} ({account.cloudAccountId})</span>
                      <button
                        onClick={() => handleAccountSelect(account.id)}
                        className="remove-button"
                        type="button"
                      >
                        <MdOutlineArrowBackIosNew />
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CloudAccountSelector;