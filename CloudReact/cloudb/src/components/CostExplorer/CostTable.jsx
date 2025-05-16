import React from 'react';

const CostTable = ({ data, groupByKey }) => (
  <table className="cost-table">
    <thead>
      <tr>
        <th>{groupByKey.replace(/_/g, ' ')}</th>
        <th>Total Cost</th>
      </tr>
    </thead>
    <tbody>
      {data.map((row, i) => (
        <tr key={i}>
          <td>{row[groupByKey]}</td>
          <td>${row.total_cost.toFixed(2)}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default CostTable;