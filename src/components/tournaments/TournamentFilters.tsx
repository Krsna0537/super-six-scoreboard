
import React, { useState } from 'react';

interface TournamentFiltersProps {
  onFilter: (filters: any) => void;
}

const TournamentFilters = ({ onFilter }: TournamentFiltersProps) => {
  const [status, setStatus] = useState('all');
  const [format, setFormat] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilter = () => {
    onFilter({
      status: status === 'all' ? null : status,
      format: format === 'all' ? null : format,
      searchTerm: searchTerm.trim() || null,
    });
  };

  const handleReset = () => {
    setStatus('all');
    setFormat('all');
    setSearchTerm('');
    onFilter({});
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Filter Tournaments</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="cricket-input"
          >
            <option value="all">All Statuses</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="registration">Registration Open</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="format" className="block text-sm font-medium text-gray-700 mb-1">Format</label>
          <select
            id="format"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="cricket-input"
          >
            <option value="all">All Formats</option>
            <option value="t20">T20</option>
            <option value="odi">ODI</option>
            <option value="test">Test</option>
            <option value="t10">T10</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            type="text"
            id="search"
            placeholder="Search tournaments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="cricket-input"
          />
        </div>
      </div>
      
      <div className="mt-6 flex justify-end space-x-4">
        <button 
          onClick={handleReset}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Reset
        </button>
        <button 
          onClick={handleFilter}
          className="cricket-button-primary px-4 py-2"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default TournamentFilters;
