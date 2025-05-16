// src/components/common/StatusBadge.js
import { getStatusClass } from './utils/resourceUtils';

export const StatusBadge = ({ status, resourceType }) => (
  <span className={`status-badge ${getStatusClass(status, resourceType)}`}>
    {status}
  </span>
);