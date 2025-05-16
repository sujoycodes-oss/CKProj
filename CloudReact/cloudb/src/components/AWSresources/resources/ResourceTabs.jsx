// src/components/resources/ResourceTabs.js
import React from 'react';

const ResourceTabs = ({ selectedResourceType, setSelectedResourceType }) => {
  return (
    <div className="resource-tabs">
      <button 
        className={`resource-tab ${selectedResourceType === 'rds' ? 'active' : ''}`} 
        onClick={() => setSelectedResourceType('rds')}
      >
        RDS
      </button>
      <button 
        className={`resource-tab ${selectedResourceType === 'ec2' ? 'active' : ''}`} 
        onClick={() => setSelectedResourceType('ec2')}
      >
        EC2
      </button>
      <button 
        className={`resource-tab ${selectedResourceType === 'asg' ? 'active' : ''}`}
        onClick={() => setSelectedResourceType('asg')}
      >
        ASG
      </button>
    </div>
  );
};

export default ResourceTabs;