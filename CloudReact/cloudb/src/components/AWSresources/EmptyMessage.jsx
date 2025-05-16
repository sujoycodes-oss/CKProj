// src/components/common/EmptyMessage.js
import React from 'react';

export const EmptyMessage = ({ resourceType, colSpan }) => (
  <tr>
    <td colSpan={colSpan} className="empty-message">
      No {resourceType} instances found. { 'Try changing your filters.'}
    </td>
  </tr>
);