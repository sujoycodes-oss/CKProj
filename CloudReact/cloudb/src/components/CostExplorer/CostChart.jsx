import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import { useEffect, useState } from 'react';
import ReactFC from 'react-fusioncharts';
import '../../styles/CostChart.css';

// Register FusionCharts modules
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const CostChart = ({ data, selectedGroupBy = 'Service', columnMapping, displayColumnName }) => {
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    if (data && data.length > 0) {
      const total = calculateTotalCost(data);
      setTotalCost(total);
    }
  }, [data, selectedGroupBy, columnMapping, displayColumnName]);

  const getGroupByKey = (data) => {
    // Try to infer the correct column name for grouping
    if (!data || data.length === 0) return 'SERVICE_NAME';
    
    const firstRow = data[0];
    const keys = Object.keys(firstRow);

    // Try to find the column that corresponds to the selected groupBy
    if (displayColumnName && keys.includes(displayColumnName)) {
      return displayColumnName;
    }
    
    // Common fallback keys
    const possibleKeys = [
      'SERVICE_NAME',
      'MYCLOUD_REGIONNAME',
      'REGION',
      'LINEITEM_OPERATION',
      'OPERATION',
      'PRODUCT_PRODUCTNAME',
      'RESOURCE_TAGS_USER_NAME',
      'AVAILABILITY_ZONE'
    ];
    
    for (const key of possibleKeys) {
      if (keys.includes(key)) {
        return key;
      }
    }
    
    // Default to the first non-cost column if nothing else matches
    return keys.find(k => k !== 'TOTAL_USAGE_COST') || keys[0];
  };

  const calculateTotalCost = (data) => {
    return data.reduce((acc, curr) => 
      acc + (curr.TOTAL_USAGE_COST ? parseFloat(curr.TOTAL_USAGE_COST) : 0), 0);
  };
  
  const formatMonthLabel = (monthStr) => {
    if (!monthStr || typeof monthStr !== 'string') return 'Unknown';
    
    const [year, month] = monthStr.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  if (!data || data.length === 0) {
    return (
      <div className="no-data-chart">
        <p>No data available for the selected parameters</p>
      </div>
    );
  }

  // Define color palette 
  const colorPalette = [
    '#1E88E5', // Blue
    '#43A047', // Green
    '#FB8C00', // Orange
    '#8E24AA', // Purple
    '#00ACC1', // Teal
    '#FDD835'  // Yellow (for Others)
  ];

  // Monthly trends chart configuration
  const monthlyChartConfig = {
    type: 'mscolumn2d',
    width: '100%',
    height: '400',
    dataFormat: 'json',
    dataSource: {
      chart: {
        // caption: `Monthly Cost Distribution by ${selectedGroupBy}`,
        // subCaption: `Total: ${totalCost.toFixed(2)}`,
        xAxisName: 'Month',
        yAxisName: 'Cost ($)',
        theme: 'fusion',
        decimals: 2,
        formatNumberScale: 0,
        showValues: '1',
        valueFontSize: '12',
        rotateValues: '1',
        placeValuesInside: '0',
        valuePosition: 'auto',
        showHoverEffect: '1',
        paletteColors: colorPalette.join(','),
        bgColor: '#ffffff',
        showBorder: '0',
        showCanvasBorder: '0',
        plotBorderAlpha: '10',
        showAlternateVGridColor: '0',
        showLegend: '1',
        legendBgColor: '#ffffff',
        legendBorderAlpha: '0',
        legendShadow: '0',
        legendItemFontSize: '10',
        legendItemFontColor: '#666666',
        exportEnabled: '1',
        exportFileName: 'monthly_cost_distribution',
        labelDisplay: 'rotate',
        slantLabel: '1',
        labelFontSize: '10'
      },
      categories: [
        {
          category: data
            .filter((item, index, self) => 
              self.findIndex(i => i.USAGE_MONTH === item.USAGE_MONTH) === index)
            .sort((a, b) => a.USAGE_MONTH.localeCompare(b.USAGE_MONTH))
            .map(item => ({
              label: formatMonthLabel(item.USAGE_MONTH)
            }))
        }
      ],
      dataset: getServiceDatasets(data)
    }
  };

  function getServiceDatasets(data) {
    // Group data by service first
    const serviceData = {};
    const groupByKey = getGroupByKey(data);
    
    // Get unique months and sort them
    const months = [...new Set(data.map(item => item.USAGE_MONTH))].sort();
    
    // Group all services
    data.forEach(item => {
      const service = item[groupByKey] || 'Unknown';
      const month = item.USAGE_MONTH;
      const cost = item.TOTAL_USAGE_COST ? parseFloat(item.TOTAL_USAGE_COST) : 0;
      
      if (!serviceData[service]) {
        serviceData[service] = {
          seriesname: service,
          data: months.map(() => ({ value: '0' }))
        };
      }
      
      const monthIndex = months.indexOf(month);
      if (monthIndex !== -1) {
        // Add cost to existing value
        const existingValue = parseFloat(serviceData[service].data[monthIndex].value);
        serviceData[service].data[monthIndex].value = (existingValue + cost).toFixed(2);
      }
    });
    
    // Convert to array and sort by total value
    let services = Object.values(serviceData).map(service => {
      const totalValue = service.data.reduce((sum, item) => sum + parseFloat(item.value), 0);
      return { ...service, totalValue };
    }).sort((a, b) => b.totalValue - a.totalValue);
    
    // Take top 5 services
    const topServices = services.slice(0, 5);
    
    // Combine the rest as "Others"
    if (services.length > 5) {
      const otherServices = services.slice(5);
      
      const othersData = {
        seriesname: 'Others',
        data: months.map((_, index) => {
          const value = otherServices.reduce((sum, service) => 
            sum + parseFloat(service.data[index].value), 0);
          return { value: value.toFixed(2) };
        })
      };
      
      services = [...topServices, othersData];
    } else {
      services = topServices;
    }
    
    return services;
  }

  return (
    <div className="cost-chart-container">
      <ReactFC {...monthlyChartConfig} className="fusion-chart" />
    </div>
  );
};

export default CostChart;