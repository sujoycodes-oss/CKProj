import { EmptyMessage } from '../EmptyMessage';
import { LoadingMessage } from '../LoadingMessage';
import { StatusBadge } from '../StatusBadge';

const EC2Table = ({ loading, instances, selectedAccount }) => {
    return (
      <table className="resource-table">
        <thead>
          <tr>
            <th>Resource Name</th>
            <th>Resource ID</th>
            <th>Region</th>
            <th>State</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <LoadingMessage resourceType="EC2" colSpan={4} />
          ) : instances.length > 0 ? (
            instances.map(instance => (
              <tr key={instance.resourceId}>
                <td>{instance.resourceName}</td>
                <td className="resource-id">{instance.resourceId}</td>
                <td>{instance.region}</td>
                <td>
                  <StatusBadge status={instance.state} resourceType="ec2" />
                </td>
              </tr>
            ))
          ) : (
            <EmptyMessage resourceType="EC2" colSpan={4} selectedAccount={selectedAccount} />
          )}
        </tbody>
      </table>
    );
  };
  
  export default EC2Table;