import { EmptyMessage } from '../EmptyMessage';
import { LoadingMessage } from '../LoadingMessage';
import { StatusBadge } from '../StatusBadge';

const RDSTable = ({ loading, instances, selectedAccount }) => {
    return (
      <table className="resource-table">
        <thead>
          <tr>
            <th>Resource Name</th>
            <th>Resource ID</th>
            <th>Engine</th>
            <th>Region</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <LoadingMessage resourceType="RDS" colSpan={5} />
          ) : instances.length > 0 ? (
            instances.map(instance => (
              <tr key={instance.resourceId}>
                <td>{instance.resourceName}</td>
                <td className="resource-id">{instance.resourceId}</td>
                <td>{instance.engine}</td>
                <td>{instance.region}</td>
                <td>
                  <StatusBadge status={instance.status} resourceType="rds" />
                </td>
              </tr>
            ))
          ) : (
            <EmptyMessage resourceType="RDS" colSpan={5} selectedAccount={selectedAccount} />
          )}
        </tbody>
      </table>
    );
  };
  
  export default RDSTable;