import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux'; 
import '../../styles/AccountDropdown.css'; 
import { useDispatch } from 'react-redux'; 
import { updateSelectedAccount } from '../../redux/actions/authActions'; 

const AccountDropdown = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const authData = useSelector(state => state.auth);
  const dispatch = useDispatch(); 

  useEffect(() => {
    if (authData.token) {
      fetchAccounts();
    }
  }, [authData.token]);

  const fetchAccounts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://localhost:8080/api/snowflake/column-values?column=account_id', {
        headers: {
          'Authorization': `Bearer ${authData.token}`
        }
      });
      setAccounts(response.data || []);
    } catch (err) {
      console.error('Error fetching accounts:', err);
      setError('Failed to load accounts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const accountId = e.target.value;
    setSelectedAccount(accountId);
    dispatch(updateSelectedAccount(accountId)); 
  };

  return (
    <div className="account-dropdown-container">
      {loading ? (
        <p>Loading accounts...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <select value={selectedAccount} onChange={handleChange} className="account-dropdown">
          <option value="">Select Account</option>
          {accounts.map((accountId) => (
            <option key={accountId} value={accountId}>
              {accountId}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default AccountDropdown;
