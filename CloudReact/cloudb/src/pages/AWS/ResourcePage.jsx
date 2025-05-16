import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import apiService from '../../services/apiService';
import ResourceFilters from '../../components/AWSresources/filters/ResourceFilters';
import ResourceStats from '../../components/AWSresources/resources/ResourceStats';
import ResourceTabs from '../../components/AWSresources/resources/ResourceTabs';
import AccountSelector from '../../components/AWSresources/resources/AccountSelector';
import SearchBar from '../../components/AWSresources/resources/SearchBar';
import ASGTable from '../../components/AWSresources/Tables/ASGTable';
import EC2Table from '../../components/AWSresources/Tables/EC2Table';
import RDSTable from '../../components/AWSresources/Tables/RDSTable';
import '../../styles/ResourcePage.css';



const ResourcesPage = () => {
    // eslint-disable-next-line no-unused-vars
    const [cloudAccounts, setCloudAccounts] = useState([]);
    const { token, role, cloudAccountIds } = useSelector(state => state.auth);
    const [filteredCloudAccounts, setFilteredCloudAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedResourceType, setSelectedResourceType] = useState('asg');

    // Resource states
    const [asgInstances, setAsgInstances] = useState([]);
    const [ec2Instances, setEC2Instances] = useState([]);
    const [rdsInstances, setRDSInstances] = useState([]);

    // Filters
    const [filters, setFilters] = useState({
        status: 'all',
        region: 'all',
        engine: 'all'
    });

    // Fetch cloud accounts on component mount
    useEffect(() => {
        if (!token) return;

        const fetchCloudAccounts = async () => {
            try {
                const accounts = await apiService.getCloudAccounts(token);
                setCloudAccounts(accounts);
                
                // Filter accounts based on user role
                if (role === 'ADMIN' || role === 'READ_ONLY') {
                    setFilteredCloudAccounts(accounts); // Show all accounts
                } else if (role === 'CUSTOMER' && cloudAccountIds) {
                    // Show only assigned accounts
                    const assignedAccounts = accounts.filter(account => 
                        cloudAccountIds.includes(account.id)
                    );
                    setFilteredCloudAccounts(assignedAccounts);
                    
                    // Auto-select first assigned account if none selected
                    if (assignedAccounts.length > 0 && !selectedAccount) {
                        setSelectedAccount(assignedAccounts[0]);
                    }
                }
            } catch (error) {
                toast.error(`Error fetching cloud accounts: ${error.message}`);
            }
        };

        fetchCloudAccounts();
    }, [token, role, cloudAccountIds, selectedAccount]);

    // Fetch ASG instances
    const fetchASGInstances = React.useCallback(async (cloudAccountId) => {
        setLoading(true);
        try {
            const instances = await apiService.getASGInstances(cloudAccountId, token);
            setAsgInstances(instances);
        } catch (error) {
            toast.error(`Error fetching ASG instances: ${error.response?.status === 500 ? 'Server error' : error.message}`);
            setAsgInstances([]);
        } finally {
            setLoading(false);
        }
    }, [token]);

    // Fetch EC2 instances
    const fetchEC2Instances = React.useCallback(async (cloudAccountId) => {
        setLoading(true);
        try {
            const instances = await apiService.getEC2Instances(cloudAccountId, token);
            setEC2Instances(instances);
        } catch (error) {
            toast.error(`Error fetching EC2 instances: ${error.response?.status === 500 ? 'Server error' : error.message}`);
            setEC2Instances([]);
        } finally {
            setLoading(false);
        }
    }, [token]);

    // Fetch RDS instances
    const fetchRDSInstances = React.useCallback(async (cloudAccountId) => {
        setLoading(true);
        try {
            const instances = await apiService.getRDSInstances(cloudAccountId, token);
            setRDSInstances(instances);
        } catch (error) {
            toast.error(`Error fetching RDS instances: ${error.response?.status === 500 ? 'Server error' : error.message}`);
            setRDSInstances([]);
        } finally {
            setLoading(false);
        }
    }, [token]);

    // Fetch instances when account or resource type changes
    useEffect(() => {
        if (selectedAccount) {
            if (selectedResourceType === 'asg' || selectedResourceType === 'all') {
                fetchASGInstances(selectedAccount.cloudAccountId);
            }
            if (selectedResourceType === 'ec2' || selectedResourceType === 'all') {
                fetchEC2Instances(selectedAccount.cloudAccountId);
            }
            if (selectedResourceType === 'rds' || selectedResourceType === 'all') {
                fetchRDSInstances(selectedAccount.cloudAccountId);
            }
        }
    }, [selectedAccount, selectedResourceType, fetchASGInstances, fetchEC2Instances, fetchRDSInstances]);

    // Handle refresh button click
    const handleRefresh = () => {
        if (selectedAccount) {
            if (selectedResourceType === 'asg' || selectedResourceType === 'all') {
                fetchASGInstances(selectedAccount.cloudAccountId);
            }
            if (selectedResourceType === 'ec2' || selectedResourceType === 'all') {
                fetchEC2Instances(selectedAccount.cloudAccountId);
            }
            if (selectedResourceType === 'rds' || selectedResourceType === 'all') {
                fetchRDSInstances(selectedAccount.cloudAccountId);
            }
        }
    };

    // Get unique regions for filtering
    const getUniqueRegions = useMemo(() => {
        let instances = [];
        
        if (selectedResourceType === 'asg') {
            instances = asgInstances;
        } else if (selectedResourceType === 'ec2') {
            instances = ec2Instances;
        } else if (selectedResourceType === 'rds') {
            instances = rdsInstances;
        }
        
        if (!Array.isArray(instances) || instances.length === 0) return [];
        return [...new Set(instances.map(instance => instance.region))];
    }, [asgInstances, ec2Instances, rdsInstances, selectedResourceType]);

    // Get unique engines for RDS filtering
    const getUniqueEngines = useMemo(() => {
        if (!Array.isArray(rdsInstances) || rdsInstances.length === 0) return [];
        return [...new Set(rdsInstances.map(instance => instance.engine))];
    }, [rdsInstances]);

    // Filter instances based on resource type and filters
    const filterInstances = useMemo(() => {
        let instances = [];
        
        if (selectedResourceType === 'asg') {
            instances = asgInstances;
        } else if (selectedResourceType === 'ec2') {
            instances = ec2Instances;
        } else if (selectedResourceType === 'rds') {
            instances = rdsInstances;
        }
        
        if (!Array.isArray(instances) || instances.length === 0) return [];

        return instances.filter(instance => {
            const matchesSearch = searchTerm === '' ||
                instance.resourceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                instance.resourceId.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesRegion = filters.region === 'all' || instance.region === filters.region;

            let matchesStatus = true;
            let matchesEngine = true;

            if (selectedResourceType === 'asg') {
                matchesStatus = filters.status === 'all' || instance.status === filters.status;
            } else if (selectedResourceType === 'ec2') {
                matchesStatus = filters.status === 'all' || instance.state === filters.status;
            } else if (selectedResourceType === 'rds') {
                matchesStatus = filters.status === 'all' || instance.status === filters.status;
                matchesEngine = filters.engine === 'all' || instance.engine === filters.engine;
            }

            return matchesSearch && matchesStatus && matchesRegion && matchesEngine;
        });
    }, [asgInstances, ec2Instances, rdsInstances, selectedResourceType, searchTerm, filters]);

    // Render appropriate table based on resource type
    const renderTable = () => {
        if (selectedResourceType === 'asg') {
            return <ASGTable loading={loading} instances={filterInstances} selectedAccount={selectedAccount} />;
        } else if (selectedResourceType === 'ec2') {
            return <EC2Table loading={loading} instances={filterInstances} selectedAccount={selectedAccount} />;
        } else if (selectedResourceType === 'rds') {
            return <RDSTable loading={loading} instances={filterInstances} selectedAccount={selectedAccount} />;
        }
    };

    return (
        <div className="resources-container">
            {/* Header with tabs and account selector */}
            <div className="resources-header">
                <ResourceTabs 
                    selectedResourceType={selectedResourceType} 
                    setSelectedResourceType={setSelectedResourceType} 
                />
                <AccountSelector 
                    cloudAccounts={filteredCloudAccounts} 
                    selectedAccount={selectedAccount} 
                    setSelectedAccount={setSelectedAccount} 
                    disabled={role === 'CUSTOMER' && filteredCloudAccounts.length === 1}
                />
            </div>

            {/* Stats cards */}
            <ResourceStats 
                instances={filterInstances} 
                selectedResourceType={selectedResourceType} 
            />

            {/* Search and filters */}
            <div className="resource-controls">
                <SearchBar 
                    searchTerm={searchTerm} 
                    setSearchTerm={setSearchTerm} 
                    resourceType={selectedResourceType} 
                />
                <ResourceFilters 
                    selectedResourceType={selectedResourceType}
                    filters={filters}
                    setFilters={setFilters}
                    uniqueRegions={getUniqueRegions}
                    uniqueEngines={getUniqueEngines}
                    handleRefresh={handleRefresh}
                />
            </div>

            <div className="resource-table-container">
                {renderTable()}
            </div>
        </div>
    );
};

export default ResourcesPage;