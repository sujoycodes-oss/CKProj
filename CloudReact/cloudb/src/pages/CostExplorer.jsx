import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import * as XLSX from 'xlsx';
import AccountDropdown from '../components/CostExplorer/AccountDropdown';
import CostChart from '../components/CostExplorer/CostChart';
import '../styles/CostExplorer.css';

const CostExplorer = () => {
  const [groupByColumns, setGroupByColumns] = useState({ main: [], more: [] });
  const [columnMapping, setColumnMapping] = useState({
    displayToEnum: {},
    enumToDb: {},
    displayToDb: {}
  });
  const [selectedGroupBy, setSelectedGroupBy] = useState('');
  const [startDate, setStartDate] = useState('2025-04-01');
  const [endDate, setEndDate] = useState('2025-04-30');
  const [filters, setFilters] = useState({});
  const [chartData, setChartData] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filterColumns, setFilterColumns] = useState([]);
  const [columnValues, setColumnValues] = useState({});
  const [selectedColumn, setSelectedColumn] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [displayColumnName, setDisplayColumnName] = useState('');

  const authData = useSelector(state => state.auth);
  const selectedAccount = authData.selectedAccount;
  const token = authData.token;

  useEffect(() => {
    if (token) {
      fetchGroupByColumns();
    }
  }, [token]);

  useEffect(() => {
    if (selectedAccount && selectedGroupBy && startDate && endDate) {
      fetchChartData();
    }
  }, [selectedAccount, selectedGroupBy, startDate, endDate]);

  const transformColumnForDisplay = (col) => {
    const formatted = col.toLowerCase().replace(/_/g, ' ');
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  const getDbColumnName = (enumName) => {
    // Special cases first
    if (enumName === 'USAGE_START_DATE') return 'USAGE_MONTH';
    if (enumName === 'ACCOUNT_ID') return 'LINKEDACCOUNTID';

    const mappings = {
      ACCOUNT_ID: 'LINKEDACCOUNTID',
      OPERATION: 'LINEITEM_OPERATION',
      USAGE_TYPE: 'LINEITEM_USAGETYPE',
      INSTANCE_TYPE: 'MYCLOUD_INSTANCETYPE',
      OPERATING_SYSTEM: 'MYCLOUD_OPERATINGSYSTEM',
      PRICING_TYPE: 'MYCLOUD_PRICINGTYPE',
      REGION: 'MYCLOUD_REGIONNAME',
      USAGE_START_DATE: 'USAGESTARTDATE',
      DATABASE_ENGINE: 'PRODUCT_DATABASEENGINE',
      SERVICES: 'PRODUCT_PRODUCTNAME',
      UNBLENDED_COST: 'LINEITEM_UNBLENDEDCOST',
      USAGE_AMOUNT: 'LINEITEM_USAGEAMOUNT',
      COST_EXPLORER_USAGE_GROUP_TYPE: 'MYCLOUD_COST_EXPLORER_USAGE_GROUP_TYPE',
      PRICING_UNIT: 'PRICING_UNIT',
      CHARGE_TYPE: 'CHARGE_TYPE',
      AVAILABILITY_ZONE: 'AVAILABILITYZONE',
      TENANCY: 'TENANCY'
    };

    return mappings[enumName] || enumName;
  };

  const fetchGroupByColumns = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:8080/api/snowflake/columns', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const allColumns = response.data || [];
      setFilterColumns(allColumns);

      // Create comprehensive mapping
      const newMapping = {
        displayToEnum: {},
        enumToDb: {},
        displayToDb: {}
      };

      allColumns.forEach(enumName => {
        const displayName = transformColumnForDisplay(enumName);
        const dbColumn = getDbColumnName(enumName);

        newMapping.displayToEnum[displayName] = enumName;
        newMapping.enumToDb[enumName] = dbColumn;
        newMapping.displayToDb[displayName] = dbColumn;
      });

      setColumnMapping(newMapping);

      // Group columns for display
      const displayColumns = allColumns.map(transformColumnForDisplay);
      setGroupByColumns({
        main: displayColumns.slice(0, 7),
        more: displayColumns.slice(7)
      });

      if (displayColumns.length > 0) {
        setSelectedGroupBy(displayColumns[0]);
      }
    } catch (error) {
      console.error('Error fetching groupable columns:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchColumnValues = async (column) => {
    try {
      setIsLoading(true);
      const enumName = columnMapping.displayToEnum[column];
      const response = await axios.get(
        `http://localhost:8080/api/snowflake/column-values?column=${enumName || column}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      setColumnValues(prev => ({
        ...prev,
        [column]: response.data || []
      }));
    } catch (error) {
      console.error(`Error fetching values for column ${column}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatFiltersForBackend = (frontendFilters) => {
    const backendFilters = {};
    Object.entries(frontendFilters).forEach(([displayName, values]) => {
      const enumName = columnMapping.displayToEnum[displayName];
      if (enumName) {
        backendFilters[enumName] = values;
      }
    });
    return backendFilters;
  };

  const fetchChartData = async () => {
    try {
      setIsLoading(true);
      const formattedFilters = formatFiltersForBackend(filters);
      const enumName = columnMapping.displayToEnum[selectedGroupBy];

      if (!enumName) {
        console.error('No enum mapping found for:', selectedGroupBy);
        setIsLoading(false);
        return;
      }

      const payload = {
        filters: formattedFilters,
        groupBy: enumName,
        startDate,
        endDate
      };

      console.log('Sending payload to API:', payload);

      const response = await axios.post(
        `http://localhost:8080/api/snowflake/query/${selectedAccount}`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('API response:', response.data);
      if (response.data && response.data.length > 0) {
        setChartData(response.data);
        setDisplayColumnName(columnMapping.displayToDb[selectedGroupBy]);
      } else {
        setChartData([]);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
      setChartData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatValue = (value, column) => {
    if (value === null || value === undefined) return 'N/A';

    if (column === 'USAGE_MONTH' && typeof value === 'string') {
      const [year, month] = value.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${monthNames[parseInt(month) - 1]} ${year}`;
    }

    return value;
  };

  const getGroupByValue = (row) => {
    const dbColumn = columnMapping.displayToDb[selectedGroupBy];
    if (dbColumn && row[dbColumn] !== undefined) {
      return formatValue(row[dbColumn], dbColumn);
    }

    // Fallback to check all possible column variations
    const possibleColumns = [
      displayColumnName,
      dbColumn,
      selectedGroupBy.toUpperCase().replace(/ /g, '_'),
      columnMapping.displayToEnum[selectedGroupBy]
    ];

    for (const col of possibleColumns) {
      if (col && row[col] !== undefined) {
        return formatValue(row[col], col);
      }
    }

    return 'N/A';
  };

  const handleGroupByClick = (column) => {
    setSelectedGroupBy(column);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
    if (!showFilters && filterColumns.length > 0) {
      setSelectedColumn(filterColumns[0]);
      fetchColumnValues(filterColumns[0]);
    }
  };

  const handleResetFilters = () => {
    setFilters({});
    if (selectedAccount && selectedGroupBy) {
      fetchChartData();
    }
  };

  const handleColumnSelect = (column) => {
    setSelectedColumn(column);
    if (!columnValues[column]) {
      fetchColumnValues(column);
    }
  };

  const handleFilterValueChange = (column, value, checked) => {
    const displayColumn = transformColumnForDisplay(column);
    const currentValues = filters[displayColumn] || [];
    let newValues;

    if (checked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter(v => v !== value);
    }

    const newFilters = { ...filters };
    if (newValues.length > 0) {
      newFilters[displayColumn] = newValues;
    } else {
      delete newFilters[displayColumn];
    }

    setFilters(newFilters);
  };


  const handleApplyFilters = () => {
    fetchChartData();
    setShowFilters(false);
  };

  // Generate more comprehensive date options for date range selection
  const getDateOptions = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const options = [];

    // Add the past 12 months as options
    for (let i = 0; i < 12; i++) {
      const date = new Date(today);
      date.setMonth(today.getMonth() - i);
      date.setDate(1); // First day of month

      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      
      // Create a unique key that includes the index to avoid duplicates
      const uniqueKey = `date-${formattedDate}-${i}`;

      options.push({
        value: formattedDate,
        label: `${monthNames[date.getMonth()]} ${date.getDate()}, ${year}`,
        key: uniqueKey
      });
    }

    return options;
  };

  // Generate end date options based on the selected start date
  const getEndDateOptions = () => {
    if (!startDate) return [];

    const startDateObj = new Date(startDate);
    const options = [];

    // Add end of month option for the selected start date month
    const endOfMonth = new Date(startDateObj.getFullYear(), startDateObj.getMonth() + 1, 0);

    const year = endOfMonth.getFullYear();
    const month = endOfMonth.getMonth() + 1;
    const day = endOfMonth.getDate();

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    options.push({
      value: formattedDate,
      label: `${monthNames[endOfMonth.getMonth()]} ${day}, ${year}`,
      key: `end-month-${formattedDate}`
    });

    // Add today as an option if it's in the same month
    const today = new Date();
    if (today.getMonth() === startDateObj.getMonth() && today.getFullYear() === startDateObj.getFullYear()) {
      const todayFormatted = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

      options.push({
        value: todayFormatted,
        label: `${monthNames[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`,
        key: `today-${todayFormatted}`
      });
    }

    return options;
  };

  const getActiveFiltersCount = () => {
    return Object.keys(filters).reduce((count, key) => {
      return count + (filters[key] && filters[key].length > 0 ? 1 : 0);
    }, 0);
  };

  const handleDownloadExcel = () => {
    if (!chartData || chartData.length === 0) return;
    
    // Format data for Excel export
    const exportData = chartData.map(row => ({
      [selectedGroupBy]: getGroupByValue(row),
      'Cost ($)': row.TOTAL_USAGE_COST ? parseFloat(row.TOTAL_USAGE_COST).toFixed(2) : '0.00'
    }));
    
    // Create worksheet and workbook
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Cost Data');
    
    // Generate filename with date
    const today = new Date();
    const formattedDate = today.toISOString().slice(0, 10);
    const fileName = `cost_explorer_${formattedDate}.xlsx`;
    
    // Save file
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="cost-explorer-container">
      <div className="cost-explorer-header">
        <div className="header-title">
          <h1>Cost Explorer</h1>
          <p>How to always be aware of cost changes and history.</p>
        </div>
        <div className="account-section">
          <AccountDropdown />
        </div>
      </div>

      <div className="cost-explorer-controls">
        <div className="group-by-section">
          <span className="label">Group By:</span>
          <div className="group-by-buttons">
            {groupByColumns.main.map(column => (
              <button
                key={column}
                className={`group-by-btn ${selectedGroupBy === column ? 'active' : ''}`}
                onClick={() => handleGroupByClick(column)}
              >
                {column}
              </button>
            ))}
            {groupByColumns.more.length > 0 && (
              <div className="group-by-dropdown">
                <select value={selectedGroupBy} onChange={(e) => handleGroupByClick(e.target.value)}>
                  <option value="">More...</option>
                  {groupByColumns.more.map(column => (
                    <option key={column} value={column}>
                      {column}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="date-and-view-controls">
        <div className="date-range-section">
          <div className="date-range-dropdowns">
            <select
              className="date-dropdown"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            >
              {getDateOptions().map(opt => (
                <option key={opt.key} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <span>-</span>
            <select
              className="date-dropdown"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            >
              {getEndDateOptions().map(opt => (
                <option key={opt.key} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="filter-toggle">
          <button className="filter-btn" onClick={toggleFilters}>
            <span className="filter-icon">≡</span>
            {getActiveFiltersCount() > 0 && (
              <span className="filter-badge">{getActiveFiltersCount()}</span>
            )}
          </button>
        </div>
      </div>

      <div className="cost-explorer-content">
        <div className="chart-container">
          {isLoading ? (
            <div className="loading">Loading chart data...</div>
          ) : chartData.length > 0 ? (
            <CostChart
              data={chartData}
              selectedGroupBy={selectedGroupBy}
              columnMapping={columnMapping}
              displayColumnName={displayColumnName}
            />  
          ) : (
            <div className="no-data">
              <p>Select an account and parameters to view data</p>
            </div>
          )}
        </div>

        {showFilters && (
          <div className="filter-panel">
            <div className="filter-header">
              <h3>Filters</h3>
              <button className="reset-btn" onClick={handleResetFilters}>Reset All</button>
            </div>

            <div className="filter-column-selector">
              <label>Select Column:</label>
              <select
                value={selectedColumn}
                onChange={(e) => handleColumnSelect(e.target.value)}
              >
                {filterColumns.map(column => (
                  <option key={column} value={column}>
                    {column}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-options">
              {selectedColumn && columnValues[selectedColumn] && columnValues[selectedColumn].map((value, index) => (
                <div className="filter-option" key={`${selectedColumn}-${value}-${index}`}>
                  <input
                    type="checkbox"
                    id={`${selectedColumn}-${value}-${index}`}
                    checked={(filters[transformColumnForDisplay(selectedColumn)] || []).includes(value)}
                    onChange={(e) => handleFilterValueChange(selectedColumn, value, e.target.checked)}
                  />
                  <label htmlFor={`${selectedColumn}-${value}-${index}`}>{value}</label>
                </div>
              ))}
            </div>

            <div className="filter-actions">
              <button className="apply-btn" onClick={handleApplyFilters}>Apply</button>
              <button className="close-btn" onClick={toggleFilters}>Close</button>
            </div>
          </div>
        )}
      </div>

      <div className="cost-table-container">
        {chartData.length > 0 && (
          <>
            <div className="table-header">
              <h3>Cost Details</h3>
              <button 
                className="download-excel-btn"
                onClick={handleDownloadExcel}
              >
                Download Excel
              </button>
            </div>
            <table className="cost-table">
              <thead>
                <tr>
                  <th>{selectedGroupBy}</th>
                  <th>Cost ($)</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((row, index) => (
                  <tr key={`row-${index}`}>
                    <td>{getGroupByValue(row)}</td>
                    <td>${row.TOTAL_USAGE_COST ? parseFloat(row.TOTAL_USAGE_COST).toFixed(2) : '0.00'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default CostExplorer;