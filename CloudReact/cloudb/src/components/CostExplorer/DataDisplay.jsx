// DataDisplay.jsx
import React, { useMemo } from 'react';
import { 
  Box, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Typography,
  Card,
  CardContent
} from '@mui/material';

const DataDisplay = ({ data, groupBy }) => {
  const totalCost = useMemo(() => {
    return data.reduce((sum, item) => sum + Number(item.TOTAL_USAGE_COST), 0).toFixed(2);
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body1">No data available. Please select filters and apply.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" component="div">
            Total Cost: ${totalCost}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Grouped by {groupBy}
          </Typography>
        </CardContent>
      </Card>

      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>Cost Data</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Month</TableCell>
                <TableCell>{groupBy}</TableCell>
                <TableCell align="right">Cost ($)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.USAGE_MONTH}</TableCell>
                  <TableCell>{row[groupBy] || 'Unknown'}</TableCell>
                  <TableCell align="right">${Number(row.TOTAL_USAGE_COST).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default DataDisplay;