import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip
} from '@mui/material';
import { PersonAdd, ExitToApp, Person } from '@mui/icons-material';
import axios from 'axios';
import { setAuthData } from '../../../redux/actions/authActions'; // Adjust path as needed

export default function ImpersonationControls() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const isAdmin = user?.role === 'ADMIN';
  const isImpersonating = user?.impersonating === true;

  // Filter customers based on search term
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === '') {
      setFilteredCustomers([]);
      return;
    }
    
    // Filter from Redux store
    const filtered = user?.customers?.filter(customer => 
      customer.email.toLowerCase().includes(term.toLowerCase()) || 
      `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(term.toLowerCase())
    ) || [];
    
    setFilteredCustomers(filtered);
  };

  // Start impersonation
  const startImpersonation = async (targetEmail) => {
    try {
      const response = await axios.post('http://localhost:8080/auth/impersonate', null, {
        params: { targetEmail },
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      // Update Redux with impersonated user data
      dispatch(setAuthData({
        ...response.data,
        impersonating: true,
        impersonatedBy: user.email,
        actualRole: user.role
      }));
      
      setOpen(false);
    } catch (error) {
      console.error('Impersonation failed:', error);
    }
  };

  // Stop impersonation
  const stopImpersonation = async () => {
    try {
      const response = await axios.post('http://localhost:8080/auth/stop-impersonation', null, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      // Update Redux with original admin data
      dispatch(setAuthData(response.data));
    } catch (error) {
      console.error('Stop impersonation failed:', error);
    }
  };

  if (!isAdmin && !isImpersonating) {
    return null; // Don't show anything for regular customers
  }

  return (
    <>
      {/* Impersonation indicator and controls */}
      {isImpersonating ? (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Chip
            icon={<Person sx={{ color: 'orange' }} />}
            label="Impersonating User"
            color="warning"
            size="small"
            sx={{ mr: 1 }}
          />
          <Tooltip title="Stop Impersonation">
            <IconButton onClick={stopImpersonation} size="small" color="warning">
              <ExitToApp />
            </IconButton>
          </Tooltip>
        </Box>
      ) : isAdmin && (
        <Tooltip title="Impersonate User">
          <IconButton onClick={() => setOpen(true)} color="primary" size="small">
            <PersonAdd />
          </IconButton>
        </Tooltip>
      )}

      {/* Customer Selection Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Impersonate Customer</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Search by name or email"
            type="text"
            fullWidth
            variant="outlined"
            value={searchTerm}
            onChange={handleSearch}
            sx={{ mb: 2 }}
          />
          
          {filteredCustomers.length > 0 ? (
            <List sx={{ maxHeight: '300px', overflow: 'auto' }}>
              {filteredCustomers.map((customer) => (
                <ListItem key={customer.email} disablePadding>
                  <ListItemButton onClick={() => startImpersonation(customer.email)}>
                    <ListItemText 
                      primary={`${customer.firstName} ${customer.lastName}`} 
                      secondary={customer.email} 
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          ) : searchTerm ? (
            <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
              No customers found
            </Typography>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}