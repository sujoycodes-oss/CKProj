import React from 'react';

export const LoadingMessage = ({ resourceType, colSpan }) => (
  <tr>
    <td colSpan={colSpan} className="loading-message">Loading {resourceType} instances...</td>
  </tr>
);