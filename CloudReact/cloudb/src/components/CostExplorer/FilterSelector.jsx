// FilterSelector.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  FormControl, 
  FormGroup, 
  FormControlLabel, 
  Checkbox, 
  Typography, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  CircularProgress,
  Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import { fetchColumnValues } from '../../services/snowflakeApi';

const FilterSelector = ({ columns, selectedFilters, onApplyFilters, token }) => {
  const [open, setOpen] = useState(false);
  const [loadingColumn, setLoadingColumn] = useState(null);
  const [columnValues, setColumnValues] = useState({});
  const [tempFilters, setTempFilters] = useState({});

  useEffect(() => {
    setTempFilters(selectedFilters);
  }, [selectedFilters]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleApply = () => {
    onApplyFilters(tempFilters);
    setOpen(false);
  };

  const loadColumnValues = async (column) => {
    if (columnValues[column] && columnValues[column].length > 0) return;
    
    setLoadingColumn(column);
    try {
      const values = await fetchColumnValues(column, token);
      setColumnValues(prev => ({
        ...prev,
        [column]: values
      }));
    } catch (error) {
      console.error(`Error loading values for column ${column}:`, error);
    } finally {
      setLoadingColumn(null);
    }
  };

  const handleFilterChange = (column, value) => {
    setTempFilters(prev => {
      const currentValues = prev[column] || [];
      const updatedValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return {
        ...prev,
        [column]: updatedValues.length > 0 ? updatedValues : undefined
      };
    });
  };

  const getActiveFilterCount = () => {
    return Object.values(selectedFilters)
      .filter(values => values && values.length > 0)
      .length;
  };

  return (
    <Box>
      <Button 
        variant="outlined" 
        startIcon={<FilterListIcon />} 
        onClick={handleOpen}
        sx={{ mb: 3 }}
      >
        Filters
        {getActiveFilterCount() > 0 && (
          <Chip 
            label={getActiveFilterCount()} 
            color="primary" 
            size="small" 
            sx={{ ml: 1 }} 
          />
        )}
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Select Filters</DialogTitle>
        <DialogContent>
          {columns.map(column => (
            <Accordion key={column} onChange={() => loadColumnValues(column)}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{column}</Typography>
                {selectedFilters[column] && selectedFilters[column].length > 0 && (
                  <Chip 
                    label={selectedFilters[column].length} 
                    color="primary" 
                    size="small" 
                    sx={{ ml: 1 }} 
                  />
                )}
              </AccordionSummary>
              <AccordionDetails>
                {loadingColumn === column ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : (
                  <FormControl component="fieldset" fullWidth>
                    <FormGroup>
                      {columnValues[column]?.map(value => (
                        <FormControlLabel
                          key={value}
                          control={
                            <Checkbox
                              checked={tempFilters[column]?.includes(value) || false}
                              onChange={() => handleFilterChange(column, value)}
                            />
                          }
                          label={value}
                        />
                      ))}
                    </FormGroup>
                  </FormControl>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleApply} variant="contained" color="primary">
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FilterSelector;