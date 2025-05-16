import React from 'react';

const FilterValuesPanel = ({
  column,
  values,
  type,
  selected,
  onToggleType,
  onToggleValue,
  onClose,
  onApply
}) => (
  <div className="filter-values-panel">
    <h4>{column.replace(/_/g, ' ')}</h4>
    <div className="toggle-group">
      <button
        className={type === 'INCLUDE' ? 'active' : ''}
        onClick={() => onToggleType('INCLUDE')}
      >Include Only</button>
      <button
        className={type === 'EXCLUDE' ? 'active' : ''}
        onClick={() => onToggleType('EXCLUDE')}
      >Exclude Only</button>
    </div>
    <div className="values-list">
      {values.map(val => (
        <label key={val}>
          <input
            type="checkbox"
            checked={selected.includes(val)}
            onChange={() => onToggleValue(val)}
          /> {val}
        </label>
      ))}
    </div>
    <div className="panel-actions">
      <button onClick={onClose}>Close</button>
      <button onClick={onApply}>Apply</button>
    </div>
  </div>
);

export default FilterValuesPanel;