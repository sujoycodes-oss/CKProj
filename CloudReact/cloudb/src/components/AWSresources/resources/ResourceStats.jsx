import React from 'react';
import { StatCard } from '../StatCard';
import { calculateInstanceCounts } from '../utils/resourceUtils';

const ResourceStats = ({ instances, selectedResourceType }) => {
    const counts = calculateInstanceCounts(instances, selectedResourceType);

    if (selectedResourceType === 'asg') {
        return (
            <div className="resource-stats">
                <StatCard title="Total ASGs" value={counts.total} />
                <StatCard title="Active" value={counts.active} />
                <StatCard title="Running" value={counts.running} />
                <StatCard title="Empty" value={counts.empty} />
            </div>
        );
    } else if (selectedResourceType === 'ec2') {
        return (
            <div className="resource-stats">
                <StatCard title="Total Instances" value={counts.total} />
                <StatCard title="Running" value={counts.running} />
                <StatCard title="Stopped" value={counts.stopped} />
                <StatCard title="Other States" value={counts.other} />
            </div>
        );
    } else if (selectedResourceType === 'rds') {
        return (
            <div className="resource-stats">
                <StatCard title="Total Instances" value={counts.total} />
                <StatCard title="Available" value={counts.available} />
                <StatCard title="Stopped" value={counts.stopped} />
                <StatCard title="Other States" value={counts.other} />
            </div>
        );
    }

    return null;
};

export default ResourceStats;