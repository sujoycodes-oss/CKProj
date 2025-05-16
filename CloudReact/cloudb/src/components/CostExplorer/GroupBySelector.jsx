// GroupBySelector.jsx
import React from 'react';
import { Box, Button, Typography, ButtonGroup } from '@mui/material';

const GroupBySelector = ({ columns, selectedGroupBy, onSelectGroupBy }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>Group By:</Typography>
      <ButtonGroup variant="outlined" sx={{ flexWrap: 'wrap', gap: 1 }}>
        {columns.map((column) => (
          <Button
            key={column}
            onClick={() => onSelectGroupBy(column)}
            color={selectedGroupBy === column ? "primary" : "inherit"}
            variant={selectedGroupBy === column ? "contained" : "outlined"}
          >
            {column}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
};

export default GroupBySelector;