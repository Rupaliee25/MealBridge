import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, role, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between font-sans">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold font-heading text-primary flex items-center gap-2">
        🥗 MealBridge
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-6 text-gray-700 font-medium">
        <Link to="/marketplace" className="hover:text-primary transition-colors">Marketplace</Link>
        <Link to="/impact" className="hover:text-primary transition-colors">Impact</Link>
        
        {/* Orders link visible when authenticated */}
        {isAuthenticated && (
          <Link to="/orders" className="hover:text-primary transition-colors">Orders</Link>
        )}

        {/* Dynamic Role Dashboard Links */}
        {isAuthenticated && role === 'vendor' && (
          <Link to="/vendor/dashboard" className="text-primary font-semibold hover:underline">
            Vendor Dashboard
          </Link>
        )}
        {isAuthenticated && role === 'ngo' && (
          <Link to="/ngo/dashboard" className="text-primary font-semibold hover:underline">
            NGO Dashboard
          </Link>
        )}
        {isAuthenticated && role === 'scrap' && (
          <Link to="/scrap/dashboard" className="text-amber-600 font-semibold hover:underline">
            Scrap Dashboard
          </Link>
        )}
        {isAuthenticated && role === 'admin' && (
          <Link to="/admin" className="text-purple-600 font-semibold hover:underline">
            Admin Portal
          </Link>
        )}
      </div>

      {/* Dynamic Auth Actions */}
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium text-sm">
              Hi, <strong className="text-gray-900">{user?.name || 'User'}</strong>
              {role && (
                <span className="ml-2 text-xs px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-semibold capitalize">
                  {role}
                </span>
              )}
            </span>
            <button
              onClick={handleLogout}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold text-sm transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Log In
            </Link>
            <Link 
              to="/signup" 
              className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;