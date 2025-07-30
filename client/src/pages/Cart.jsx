import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react"
import { useCart } from "../contexts/CartContext"
import { useAuth } from "../contexts/AuthContext"

const Cart = () => {
    const { cart, updateCartItem, removeFromCart, getCartTotal, getCartItemsCount } = useCart()
    const { user } = useAuth()

    const deliveryFee = getCartTotal() > 500 ? 0 : 50
    const total = getCartTotal() + deliveryFee

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="flex items-center mb-6">
                        <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Continue Shopping
                        </Link>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                        <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-600 mb-6">Add some products to get started</p>
                        <Link
                            to="/products"
                            className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
                        >
                            Shop Now
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center mb-6">
                    <Link to="/products" className="flex items-center text-gray-600 hover:text-gray-900">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Continue Shopping
                    </Link>
                </div>

                <h1 className="text-2xl font-bold mb-6">My Cart ({getCartItemsCount()} items)</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow">
                            <div className="p-6">
                                <h2 className="text-lg font-semibold mb-4">Cart Items</h2>
                                <div className="space-y-4">

                                    {cart.map((item, index) => (
                                        <motion.div
                                            key={item.product._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-center space-x-4 p-4 border rounded-lg"
                                        >
                                            <img
                                                src={item.product.images}
                                                alt={item.product.name}
                                                className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border"
                                            />

                                            <div className="flex-1">
                                                <h3 className="font-medium">{item.product.name}</h3>
                                                <p className="text-sm text-gray-500">{item.product.weight}</p>
                                                <p className="font-bold text-lg">₹{item.product.price}</p>
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    // onClick={() => updateCartItem(item.product._id, item.quantity - 1)}
                                                    onClick={() => {
                                                        if (item.quantity - 1 <= 0) {
                                                            removeFromCart(item.product._id);
                                                        } else {
                                                            updateCartItem(item.product._id, item.quantity - 1);
                                                        }
                                                    }}

                                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateCartItem(item.product._id, item.quantity + 1)}
                                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(item.product._id)}
                                                className="text-red-500 hover:text-red-600 p-2"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </motion.div>
                                    ))}

                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold mb-4">Delivery Address</h3>
                            {user ? (
                                <div>
                                    <p className="text-sm text-gray-600">
                                        {user.addresses && user.addresses.length > 0
                                            ? user.addresses.find((addr) => addr.isDefault)?.address || user.addresses[0].address
                                            : "No address added"}
                                    </p>
                                    <Link to="/profile" className="text-red-500 text-sm hover:text-red-600">
                                        Change Address
                                    </Link>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Please login to set delivery address</p>
                                    <Link to="/login" className="text-red-500 text-sm hover:text-red-600">
                                        Login
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span>Subtotal ({getCartItemsCount()} items)</span>
                                    <span>₹{getCartTotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery Fee</span>
                                    <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
                                </div>
                                {deliveryFee === 0 && <p className="text-sm text-green-600">Free delivery on orders over ₹500!</p>}
                                <div className="border-t pt-3">
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>₹{total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {user ? (
                                <Link
                                    to="/checkout"
                                    className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium mt-6 block text-center transition-colors"
                                >
                                    Proceed to Checkout
                                </Link>
                            ) : (
                                <div className="mt-6">
                                    <Link
                                        to="/login"
                                        className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium block text-center transition-colors"
                                    >
                                        Login to Checkout
                                    </Link>
                                    <p className="text-sm text-gray-600 text-center mt-2">
                                        New customer?{" "}
                                        <Link to="/register" className="text-red-500 hover:text-red-600">
                                            Create account
                                        </Link>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart
