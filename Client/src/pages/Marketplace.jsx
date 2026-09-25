import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFoodItems } from '../api/foodItems';
import FoodItemCard from '../components/FoodItemCard';
import FilterBar from '../components/FilterBar';

const Marketplace = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filters, setFilters] = useState({ diet: '', freeOnly: false });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getFoodItems();
        console.log('MongoDB Food Items Data:', response);
        setItems(response.data || []);
      } catch (err) {
        console.error('Error fetching food items:', err);
        setError('Failed to fetch marketplace data');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Safe client-side multi-field filter evaluation
  const filteredItems = items.filter((item) => {
    // 1. Search filter (title or description)
    const matchesSearch =
      !searchTerm ||
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Status filter button bar
    const matchesStatus =
      statusFilter === 'all' || item.status === statusFilter;

    // 3. FilterBar diet dropdown (checks category_tags array OR diet_type field safely)
    const matchesDiet =
      !filters.diet ||
      item.category_tags?.some((tag) =>
        tag.toLowerCase().includes(filters.diet.toLowerCase())
      ) ||
      item.diet_type?.toLowerCase().includes(filters.diet.toLowerCase());

    // 4. FilterBar freeOnly toggle (checks status OR zero current price)
    const matchesFreeOnly =
      !filters.freeOnly ||
      item.status === 'pivoted_to_ngo' ||
      item.current_price === 0 ||
      item.is_free === true;

    return matchesSearch && matchesStatus && matchesDiet && matchesFreeOnly;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 font-heading">Marketplace</h1>
        <p className="text-gray-600 mt-1">Browse surplus food available for purchase or NGO donation.</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search items by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm"
        />

        {/* Status Filter Buttons */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => setStatusFilter('listed')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              statusFilter === 'listed'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Available
          </button>
          <button
            onClick={() => setStatusFilter('pivoted_to_ngo')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              statusFilter === 'pivoted_to_ngo'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Free for NGOs
          </button>
        </div>
      </div>

      {/* Modular Dietary & Free-Only FilterBar */}
      <FilterBar filters={filters} setFilters={setFilters} />

      {loading && <p className="text-gray-500">Loading food items...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && filteredItems.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-8">
          <p className="text-gray-500 font-medium">No food items found matching your filters.</p>
        </div>
      )}

      {!loading && !error && filteredItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <FoodItemCard
              key={item.item_id || item._id}
              item={item}
              onClick={() => navigate(`/item/${item.item_id || item._id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;