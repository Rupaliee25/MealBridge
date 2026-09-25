import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../api/client';
import { createOrder } from '../api/orders';
import CountdownRing from '../components/CountdownRing';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await client.get(`/food-items/${id}`);
        setItem(response.data.data || response.data);
      } catch (err) {
        console.error('Error fetching item details:', err);
        setError('Failed to load item details');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchItem();
  }, [id]);

  const handleClaim = async () => {
    setClaiming(true);
    try {
      const result = await createOrder(item.item_id || item._id);
      navigate(`/orders?qr=${result.data.pickup_qr_code}`);
    } catch (err) {
      console.error('Order claim error:', err);
      alert(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setClaiming(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Loading item details...</div>;
  if (error || !item) return (
    <div className="p-8 text-center max-w-md mx-auto my-12 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
      <p className="text-red-500 font-semibold mb-4">{error || 'Item not found'}</p>
      <button 
        onClick={() => navigate('/marketplace')} 
        className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition cursor-pointer"
      >
        Back to Marketplace
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-8 font-sans">
      <button
        onClick={() => navigate('/marketplace')}
        className="mb-6 text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-2 cursor-pointer"
      >
        ← Back to Marketplace
      </button>

      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full capitalize">
              {item.status?.replace('_', ' ') || 'Available'}
            </span>
            {item.category_tags?.map((tag, idx) => (
              <span key={idx} className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
          <p className="text-gray-600 leading-relaxed">{item.description || 'No description provided.'}</p>

          <div className="pt-6 border-t border-gray-100 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400 text-xs font-medium">Original Quantity</p>
              <p className="font-semibold text-gray-800 mt-1">{item.quantity_servings || item.quantity || 10} Servings</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-medium">Pickup Location</p>
              <p className="font-semibold text-gray-800 mt-1">{item.pickup_location || 'Vendor Location'}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between bg-gray-50 p-6 rounded-xl border border-gray-100">
          <div className="text-center space-y-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Time Remaining</p>
            <div className="flex justify-center">
              <CountdownRing expiryTimer={item.expiry_timer} size={84} />
            </div>

            <div className="pt-4">
              <p className="text-xs text-gray-400">Current Price</p>
              <p className="text-3xl font-extrabold text-emerald-600 mt-1">
                {item.current_price === 0 || item.status === 'pivoted_to_ngo' ? 'FREE' : `₹${item.current_price}`}
              </p>
              {item.original_price > item.current_price && (
                <p className="text-xs text-gray-400 line-through mt-0.5">₹{item.original_price}</p>
              )}
            </div>
          </div>

          <button
            onClick={handleClaim}
            disabled={claiming || item.status === 'reserved'}
            className="w-full mt-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {claiming 
              ? 'Placing order...' 
              : item.status === 'reserved'
              ? 'Item Reserved'
              : item.status === 'pivoted_to_ngo' 
              ? 'Claim as NGO' 
              : 'Order Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;