// import { useState } from "react"
// import { Link, useNavigate } from "react-router-dom"
// import { motion } from "framer-motion"
// import { Search, MapPin, User, ShoppingCart, Menu, X, LogOut, Package } from "lucide-react"
// import { useAuth } from "../contexts/AuthContext"
// import { useCart } from "../contexts/CartContext"

// const Layout = ({ children }) => {
//     const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
//     const [searchTerm, setSearchTerm] = useState("")
//     const { user, logout } = useAuth()
//     const { getCartItemsCount, getCartTotal } = useCart()
//     const navigate = useNavigate()

//     const handleLogout = () => {
//         logout()
//         navigate("/")
//     }

//     const handleSearch = (e) => {
//         e.preventDefault()
//         if (searchTerm.trim()) {
//             navigate(`/products?search=${encodeURIComponent(searchTerm)}`)
//         }
//     }

//     return (
//         <div className="min-h-screen bg-white">
//             {/* Header */}
//             <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="flex items-center justify-between h-16">
//                         {/* Logo */}
//                         <div className="flex items-center">
//                             <Link to="/" className="flex items-center">
//                                 <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
//                                     <ShoppingCart className="w-5 h-5 text-white" />
//                                 </div>
//                                 <span className="ml-2 text-xl font-bold text-gray-900">Zesto</span>
//                             </Link>
//                         </div>

//                         {/* Delivery Location */}
//                         <div className="hidden md:flex items-center text-sm">
//                             <MapPin className="w-4 h-4 text-red-500 mr-1" />
//                             <div>
//                                 <div className="font-medium">Delivery in 16 minutes</div>
//                                 <div className="text-gray-500">Your Address </div>
//                             </div>
//                         </div>

//                         {/* Search Bar */}
//                         <div className="flex-1 max-w-lg mx-8">
//                             <form onSubmit={handleSearch} className="relative">
//                                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                                 <input
//                                     type="text"
//                                     placeholder="Search items"
//                                     value={searchTerm}
//                                     onChange={(e) => setSearchTerm(e.target.value)}
//                                     className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
//                                 />
//                             </form>
//                         </div>

//                         {/* User Account & Cart */}
//                         <div className="flex items-center space-x-4">
//                             {user ? (
//                                 <div className="relative group">
//                                     <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">

//                                         {user.profileImage ? (
//                                             <img
//                                                 src={user.profileImage}
//                                                 alt="Profile"
//                                                 className="w-8 h-8 rounded-full object-cover border border-gray-300"
//                                             />
//                                         ) : (
//                                             <User className="w-5 h-5 text-red-500" />
//                                         )}
//                                         <div className="hidden md:block text-left">
//                                             <div className="text-sm font-medium">Hello, {user.name}</div>
//                                             <div className="text-xs text-gray-500">My Account</div>
//                                         </div>
//                                     </button>

//                                     {/* Dropdown Menu */}
//                                     <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
//                                         <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                                             Profile
//                                         </Link>
//                                         <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                                             <Package className="w-4 h-4 inline mr-2" />
//                                             My Orders
//                                         </Link>
//                                         <button
//                                             onClick={handleLogout}
//                                             className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                                         >
//                                             <LogOut className="w-4 h-4 inline mr-2" />
//                                             Logout
//                                         </button>
//                                     </div>
//                                 </div>
//                             ) : (
//                                 <Link to="/login" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
//                                     <User className="w-5 h-5 text-red-500" />
//                                     <div className="hidden md:block text-left">
//                                         <div className="text-sm font-medium">Hello, Sign in</div>
//                                         <div className="text-xs text-gray-500">My Account</div>
//                                     </div>
//                                 </Link>
//                             )}

//                             <Link to="/cart" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 relative">
//                                 <ShoppingCart className="w-5 h-5 text-red-500" />
//                                 {getCartItemsCount() > 0 && (
//                                     <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                                         {getCartItemsCount()}
//                                     </span>
//                                 )}
//                                 <div className="hidden md:block text-left">
//                                     <div className="text-sm font-medium">{getCartItemsCount()} items</div>
//                                     <div className="text-xs text-gray-500">${getCartTotal().toFixed(2)}</div>
//                                 </div>
//                             </Link>

//                             {/* Mobile menu button */}
//                             <button
//                                 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//                                 className="md:hidden p-2 rounded-lg hover:bg-gray-100"
//                             >
//                                 {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Mobile Menu */}
//                 {mobileMenuOpen && (
//                     <motion.div
//                         initial={{ opacity: 0, y: -10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className="md:hidden bg-white border-t border-gray-200"
//                     >
//                         <div className="px-4 py-2 space-y-2">
//                             <Link
//                                 to="/products"
//                                 className="block py-2 text-gray-700 hover:text-red-500"
//                                 onClick={() => setMobileMenuOpen(false)}
//                             >
//                                 All Products
//                             </Link>


//                             {user && (
//                                 <>
//                                     <Link
//                                         to="/orders"
//                                         className="block py-2 text-gray-700 hover:text-red-500"
//                                         onClick={() => setMobileMenuOpen(false)}
//                                     >
//                                         My Orders
//                                     </Link>
//                                     <Link
//                                         to="/profile"
//                                         className="block py-2 text-gray-700 hover:text-red-500"
//                                         onClick={() => setMobileMenuOpen(false)}
//                                     >
//                                         Profile
//                                     </Link>
//                                 </>
//                             )}
//                         </div>
//                     </motion.div>
//                 )}
//             </header>

//             {/* Main Content */}
//             <main className="flex-1">{children}</main>

//             {/* Footer */}
//             <footer className="bg-white border-t border-gray-200 py-12">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
//                         <div className="text-center">
//                             <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
//                                 <span className="text-white text-xl">⏰</span>
//                             </div>
//                             <h3 className="font-bold text-lg mb-2">10 minute grocery now</h3>
//                             <p className="text-sm text-gray-600">
//                                 Get your order delivered to your doorstep at the earliest from Grosery pickup stores near you.
//                             </p>
//                         </div>

//                         <div className="text-center">
//                             <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
//                                 <span className="text-white text-xl">🎁</span>
//                             </div>
//                             <h3 className="font-bold text-lg mb-2">Best Prices & Offers</h3>
//                             <p className="text-sm text-gray-600">
//                                 Cheaper prices than your local supermarket, great cashback offers to top it off.
//                             </p>
//                         </div>

//                         <div className="text-center">
//                             <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
//                                 <ShoppingCart className="text-white w-6 h-6" />
//                             </div>
//                             <h3 className="font-bold text-lg mb-2">Wide Assortment</h3>
//                             <p className="text-sm text-gray-600">
//                                 Choose from 5000+ products across food, personal care, household & other categories.
//                             </p>
//                         </div>

//                         <div className="text-center">
//                             <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
//                                 <span className="text-white text-xl">↩</span>
//                             </div>
//                             <h3 className="font-bold text-lg mb-2">Easy Returns</h3>
//                             <p className="text-sm text-gray-600">
//                                 Not satisfied with a product? Return it at the doorstep & get a refund within hours.
//                             </p>
//                         </div>
//                     </div>

//                     <div className="border-t border-gray-200 pt-8">
//                         <div className="flex flex-col md:flex-row justify-between items-center">
//                             <p className="text-sm text-gray-600">© Copyright 2025 Zesto. All rights reserved.</p>
//                             <div className="flex items-center space-x-4 mt-4 md:mt-0">
//                                 <span className="text-sm text-gray-600">Follow us</span>
//                                 <div className="flex space-x-2">
//                                     <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
//                                     <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
//                                     <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </footer>
//         </div>
//     )
// }

// export default Layout




import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Search,
    MapPin,
    User,
    ShoppingCart,
    Menu,
    X,
    LogOut,
    Package,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";


const Layout = ({ children }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const { user, logout } = useAuth();
    const { getCartItemsCount, getCartTotal } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-red-900 border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center">
                            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                                <ShoppingCart className="w-5 h-5 text-red-900" />
                            </div>
                            <span className="ml-2 text-xl font-bold text-yellow-400">Zesto</span>
                        </Link>

                        {/* Search Bar */}
                        <div className="flex-1 max-w-lg mx-4">
                            <form onSubmit={handleSearch} className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search items"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-full  rounded-lg focus:outline-none bg-gray-100 "
                                />
                            </form>
                        </div>




                        {/* Desktop: User & Cart */}
                        <div className="hidden md:flex items-center space-x-4">
                            {user ? (
                                <div className="relative group">
                                    <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-zinc-900">
                                        {user.profileImage ? (
                                            <img
                                                src={user.profileImage}
                                                alt="Profile"
                                                className="w-8 h-8 rounded-full object-cover border border-zinc-900"
                                            />
                                        ) : (
                                            <User className="w-5 h-5 text-red-500" />
                                        )}
                                        <div className="text-left">
                                            <div className="text-sm font-medium text-gray-50">Hello, {user.name}</div>
                                            <div className="text-xs text-gray-100">My Account</div>
                                        </div>
                                    </button>
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Profile
                                        </Link>
                                        <Link
                                            to="/orders"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <Package className="w-4 h-4 inline mr-2" />
                                            My Orders
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <LogOut className="w-4 h-4 inline mr-2" />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-zinc-900"
                                >
                                    <User className="w-5 h-5 text-red-500" />
                                    <div className="text-left">
                                        <div className="text-sm font-medium text-gray-50">Hello, Sign in</div>
                                        <div className="text-xs text-gray-100">My Account</div>
                                    </div>
                                </Link>
                            )}

                            <Link
                                to="/cart"
                                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-zinc-900 relative"
                            >
                                <ShoppingCart className="w-5 h-5 text-red-500" />
                                {getCartItemsCount() > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {getCartItemsCount()}
                                    </span>
                                )}
                                <div className="text-left">
                                    <div className="text-sm font-medium text-gray-50">{getCartItemsCount()} items</div>
                                    <div className="text-xs text-gray-100">
                                        ₹{getCartTotal().toFixed(2)}
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* Hamburger Button (Mobile only) */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-zinc-800"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5 text-gray-50" /> : <Menu className="w-5 h-5 text-gray-50" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:hidden bg-white border-t border-gray-200"
                    >
                        <div className="px-4 py-2 space-y-2">
                            <Link
                                to="/products"
                                className="block py-2 font-bold text-zinc-700 hover:text-red-500"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                All Products
                            </Link>

                            <Link
                                to="/cart"
                                className="block py-2 font-bold text-gray-700 hover:text-red-500"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Cart ({getCartItemsCount()}) - ₹{getCartTotal().toFixed(2)}
                            </Link>

                            {user ? (
                                <>
                                    <Link
                                        to="/orders"
                                        className="block py-2 text-gray-700 hover:text-red-500"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        My Orders
                                    </Link>
                                    <Link
                                        to="/profile"
                                        className="block py-2 text-gray-700 hover:text-red-500"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left py-2 text-gray-700 hover:text-red-500"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    className="block py-2 font-bold text-gray-700 hover:text-red-500"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Icons Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        {/* Icon Box 1 */}
                        <div className="text-center">
                            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-white text-xl">⏰</span>
                            </div>
                            <h3 className="font-bold text-lg mb-2">10 minute grocery now</h3>
                            <p className="text-sm text-gray-600">
                                Get your order delivered to your doorstep at the earliest from Zesto stores near you.
                            </p>
                        </div>

                        {/* Icon Box 2 */}
                        <div className="text-center">
                            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-white text-xl">🎁</span>
                            </div>
                            <h3 className="font-bold text-lg mb-2">Best Prices & Offers</h3>
                            <p className="text-sm text-gray-600">
                                Cheaper prices than your local supermarket, great cashback offers to top it off.
                            </p>
                        </div>

                        {/* Icon Box 3 */}
                        <div className="text-center">
                            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShoppingCart className="text-white w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Wide Assortment</h3>
                            <p className="text-sm text-gray-600">
                                Choose from 5000+ products across food, personal care, household & more.
                            </p>
                        </div>

                        {/* Icon Box 4 */}
                        <div className="text-center">
                            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-white text-xl">↩</span>
                            </div>
                            <h3 className="font-bold text-lg mb-2">Easy Returns</h3>
                            <p className="text-sm text-gray-600">
                                Not satisfied with a product? Return it at the doorstep & get a refund within hours.
                            </p>
                        </div>
                    </div>

                    {/* Bottom Footer */}
                    <div className="border-t border-gray-200 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <p className="text-sm font-bold text-blue-800">
                                © Copyright 2025 Zesto. All rights reserved.
                            </p>

                            <div className="flex items-center space-x-4 mt-4 md:mt-0">
                                <span className="text-sm text-gray-800 font-bold">Follow us:</span>
                                <div className="flex space-x-3 ">
                                    {/* Facebook */}
                                    <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center text-gray-50">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                            viewBox="0 0 24 24">
                                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                        </svg>
                                    </div>

                                    {/* Twitter */}
                                    <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center text-gray-50">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                            viewBox="0 0 24 24">
                                            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                                        </svg>
                                    </div>

                                    {/* Instagram */}
                                    {/* <div className="w-8 h-8 bg-pink-700 rounded-full flex items-center justify-center text-gray-50">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                            viewBox="0 0 24 24">
                                            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                            <circle cx="17.5" cy="6.5" r="1" />
                                        </svg>
                                    </div> */}
                                    <div className="w-8 h-8 bg-pink-700 rounded-full flex items-center justify-center text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            className="w-4 h-4"
                                        >
                                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                            <circle cx="17.5" cy="6.5" r="1" />
                                        </svg>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
