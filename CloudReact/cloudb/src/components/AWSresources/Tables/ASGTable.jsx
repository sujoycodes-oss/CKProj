import React from 'react';
import { LoadingMessage } from '../LoadingMessage';
import { EmptyMessage } from '../EmptyMessage';
import { StatusBadge } from '../StatusBadge';

const ASGTable = ({ loading, instances, selectedAccount }) => {
    return (
      <table className="resource-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Resource ID</th>
            <th>Region</th>
            <th>Status</th>
            <th>Min Size</th>
            <th>Max Size</th>
            <th>Desired Capacity</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <LoadingMessage resourceType="ASG" colSpan={7} />
          ) : instances.length > 0 ? (
            instances.map(instance => (
              <tr key={instance.resourceId} className={`status-${instance.status?.toLowerCase()}`}>
                <td>{instance.resourceName}</td>
                <td className="resource-id">{instance.resourceId}</td>
                <td>{instance.region}</td>
                <td>
                  <StatusBadge status={instance.status} resourceType="asg" />
                </td>
                <td>{instance.minSize}</td>
                <td>{instance.maxSize}</td>
                <td>{instance.desiredCapacity}</td>
              </tr>
            ))
          ) : (
            <EmptyMessage resourceType="ASG" colSpan={7} selectedAccount={selectedAccount} />
          )}
        </tbody>
      </table>
    );
  };
  
  export default ASGTable;