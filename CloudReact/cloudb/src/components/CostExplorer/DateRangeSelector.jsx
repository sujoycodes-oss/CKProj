// DateRangeSelector.jsx
import React, { useState } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';

const DateRangeSelector = ({ onDateChange }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartDateChange = (date) => {
    setStartDate(date);
    onDateChange(
      date ? format(date, 'yyyy-MM-dd') : null,
      endDate ? format(endDate, 'yyyy-MM-dd') : null
    );
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    onDateChange(
      startDate ? format(startDate, 'yyyy-MM-dd') : null,
      date ? format(date, 'yyyy-MM-dd') : null
    );
  };

  return (
    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
      <Typography variant="subtitle1">Date Range:</Typography>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={handleStartDateChange}
          renderInput={(params) => <TextField size="small" {...params} />}
        />
        <Typography sx={{ mx: 1 }}>to</Typography>
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={handleEndDateChange}
          renderInput={(params) => <TextField size="small" {...params} />}
        />
      </LocalizationProvider>
    </Box>
  );
};

export default DateRangeSelector;