import { Link } from 'react-router-dom';

const Navbar = () => {
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
        <Link to="/orders" className="hover:text-primary transition-colors">Orders</Link>
      </div>

      {/* Auth Buttons */}
      <div className="flex items-center gap-4">
        <Link to="/login" className="text-primary font-semibold hover:underline">
          Log In
        </Link>
        <Link 
          to="/signup" 
          className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;