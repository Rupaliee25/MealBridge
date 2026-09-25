import React from 'react';

export default function FilterBar({ filters, setFilters }) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <select
        value={filters.diet || ''}
        onChange={(e) => setFilters({ ...filters, diet: e.target.value })}
        className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
      >
        <option value="">All types</option>
        <option value="veg">Veg</option>
        <option value="non-veg">Non-veg</option>
      </select>

      <button
        onClick={() => setFilters({ ...filters, freeOnly: !filters.freeOnly })}
        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors cursor-pointer ${
          filters.freeOnly
            ? 'bg-emerald-600 text-white border-emerald-600'
            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
        }`}
      >
        Free for NGOs only
      </button>
    </div>
  );
}