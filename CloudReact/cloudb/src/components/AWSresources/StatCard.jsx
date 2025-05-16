// src/components/common/StatCard.js
import React from 'react';

export const StatCard = ({ title, value }) => (
  <div className="stat-card">
    <h3>{title}</h3>
    <p>{value}</p>
  </div>
);
