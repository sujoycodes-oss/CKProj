// src/components/resources/ResourceFilters.js
import React from 'react';
import { FaSyncAlt } from 'react-icons/fa';

const ResourceFilters = ({
    selectedResourceType,
    filters,
    setFilters,
    uniqueRegions,
    uniqueEngines,
    handleRefresh
}) => {
    return (
        <div className="filters">
            <div className="filter">
                <label>Status:</label>
                <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                    <option value="all">All States</option>
                    {selectedResourceType === 'asg' && (
                        <>
                            <option value="Active">Active</option>
                            <option value="RUNNING">Running</option>
                            <option value="Empty">Empty</option>
                        </>
                    )}
                    {selectedResourceType === 'ec2' && (
                        <>
                            <option value="running">Running</option>
                            <option value="stopped">Stopped</option>
                            <option value="pending">Pending</option>
                            <option value="terminated">Terminated</option>
                        </>
                    )}
                    {selectedResourceType === 'rds' && (
                        <>
                            <option value="available">Available</option>
                            <option value="stopped">Stopped</option>
                            <option value="creating">Creating</option>
                            <option value="deleting">Deleting</option>
                        </>
                    )}
                </select>
            </div>

            {selectedResourceType === 'rds' && (
                <div className="filter">
                    <label>Engine:</label>
                    <select
                        value={filters.engine}
                        onChange={(e) => setFilters({ ...filters, engine: e.target.value })}
                    >
                        <option value="all">All Engines</option>
                        {uniqueEngines.map(engine => (
                            <option key={engine} value={engine}>{engine}</option>
                        ))}
                    </select>
                </div>
            )}

            <div className="filter">
                <label>Region:</label>
                <select
                    value={filters.region}
                    onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                >
                    <option value="all">All Regions</option>
                    {uniqueRegions.map(region => (
                        <option key={region} value={region}>{region}</option>
                    ))}
                </select>
            </div>

            <button className="refresh-button" onClick={handleRefresh}>
                <FaSyncAlt /> Refresh
            </button>
        </div>
    );
};

export default ResourceFilters;