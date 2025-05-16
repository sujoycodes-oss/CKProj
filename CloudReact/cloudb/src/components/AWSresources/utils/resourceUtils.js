export const getStatusClass = (status, resourceType) => {
    if (resourceType === 'ec2') {
        switch (status?.toLowerCase()) {
            case 'running': return 'active';
            case 'stopped': return 'stopped';
            case 'pending': return 'pending';
            case 'terminated': return 'terminated';
            default: return '';
        }
    } else if (resourceType === 'rds') {
        switch (status?.toLowerCase()) {
            case 'available': return 'active';
            case 'stopped': return 'stopped';
            case 'creating': return 'pending';
            case 'deleting': return 'terminated';
            default: return '';
        }
    } else { // ASG
        switch (status?.toLowerCase()) {
            case 'active': return 'active';
            case 'running': return 'running';
            case 'empty': return 'empty';
            default: return '';
        }
    }
};

// Calculate instance counts for stats display
export const calculateInstanceCounts = (filterInstances, selectedResourceType) => {
    if (selectedResourceType === 'asg') {
        return {
            total: filterInstances.length,
            active: filterInstances.filter(i => i.status === 'Active').length,
            running: filterInstances.filter(i => i.status === 'RUNNING').length,
            empty: filterInstances.filter(i => i.status === 'Empty').length
        };
    } else if (selectedResourceType === 'ec2') {
        return {
            total: filterInstances.length,
            running: filterInstances.filter(i => i.state?.toLowerCase() === 'running').length,
            stopped: filterInstances.filter(i => i.state?.toLowerCase() === 'stopped').length,
            other: filterInstances.filter(i => !['running', 'stopped'].includes(i.state?.toLowerCase())).length
        };
    } else if (selectedResourceType === 'rds') {
        return {
            total: filterInstances.length,
            available: filterInstances.filter(i => i.status?.toLowerCase() === 'available').length,
            stopped: filterInstances.filter(i => i.status?.toLowerCase() === 'stopped').length,
            other: filterInstances.filter(i => !['available', 'stopped'].includes(i.status?.toLowerCase())).length
        };
    }
    return { total: 0 };
};