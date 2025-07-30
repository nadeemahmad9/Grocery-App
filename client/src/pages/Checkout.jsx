import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { CreditCard, Wallet, Smartphone, DollarSign, ArrowLeft } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import toast from "react-hot-toast"
import { useCart } from "../contexts/CartContext"
import { useAuth } from "../contexts/AuthContext"

const Checkout = () => {
    const [selectedMethod, setSelectedMethod] = useState("cash")
    const [shippingAddress, setShippingAddress] = useState({
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
    })

    const { cart, getCartTotal, clearCart } = useCart()
    const { user } = useAuth()
    const navigate = useNavigate()

    const paymentMethods = [
        { id: "cash", name: "Cash on Delivery", icon: DollarSign },
        { id: "card", name: "Credit/Debit Card", icon: CreditCard },
        { id: "upi", name: "UPI Payment", icon: Smartphone },
        { id: "wallet", name: "Digital Wallet", icon: Wallet },
    ]

    const subtotal = getCartTotal()
    const deliveryFee = subtotal > 500 ? 0 : 50
    const total = subtotal + deliveryFee

    // const createOrderMutation = useMutation((orderData) => axios.post("/api/orders", orderData), {
    //     onSuccess: (response) => {
    //         toast.success("Order placed successfully!")
    //         clearCart()
    //         navigate(`/orders`)
    //     },
    //     onError: (error) => {
    //         toast.error(error.response?.data?.message || "Failed to place order")
    //     },
    // })

    const createOrderMutation = useMutation({
        mutationFn: (orderData) => axios.post("/api/orders", orderData),
        onSuccess: (response) => {
            toast.success("Order placed successfully!")
            clearCart()
            navigate(`/orders`)
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to place order")
        },
    })

    const handleAddressChange = (e) => {
        setShippingAddress({
            ...shippingAddress,
            [e.target.name]: e.target.value,
        })
    }

    const handlePlaceOrder = (e) => {
        e.preventDefault()

        if (!shippingAddress.name || !shippingAddress.phone || !shippingAddress.address) {
            toast.error("Please fill in all required address fields")
            return
        }

        const orderData = {
            items: cart.map((item) => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price,
            })),
            shippingAddress,
            paymentMethod: selectedMethod,
            paymentStatus: selectedMethod === "cash" ? "Pending" : "Paid",
            subtotal,
            deliveryFee,
            total,
        }



        createOrderMutation.mutate(orderData)
    }

    if (!user) {
        navigate("/login")
        return null
    }

    if (cart.length === 0) {
        navigate("/cart")
        return null
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex items-center mb-6">
                    <button onClick={() => navigate("/cart")} className="flex items-center text-gray-600 hover:text-gray-900">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Cart
                    </button>
                </div>

                <h1 className="text-2xl font-bold mb-8">Checkout</h1>

                <form onSubmit={handlePlaceOrder}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Shipping & Payment */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Shipping Address */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={shippingAddress.name}
                                            onChange={handleAddressChange}
                                            required
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={shippingAddress.phone}
                                            onChange={handleAddressChange}
                                            required
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                                        <textarea
                                            name="address"
                                            value={shippingAddress.address}
                                            onChange={handleAddressChange}
                                            required
                                            rows={3}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={shippingAddress.city}
                                            onChange={handleAddressChange}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={shippingAddress.state}
                                            onChange={handleAddressChange}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                                        <input
                                            type="text"
                                            name="zipCode"
                                            value={shippingAddress.zipCode}
                                            onChange={handleAddressChange}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
                                <div className="space-y-3">
                                    {paymentMethods.map((method) => (
                                        <label
                                            key={method.id}
                                            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${selectedMethod === method.id
                                                ? "border-red-500 bg-red-50"
                                                : "border-gray-200 hover:border-gray-300"
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value={method.id}
                                                checked={selectedMethod === method.id}
                                                onChange={(e) => setSelectedMethod(e.target.value)}
                                                className="sr-only"
                                            />
                                            <method.icon className="w-6 h-6 text-red-500 mr-3" />
                                            <span className="font-medium">{method.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div>
                            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

                                <div className="space-y-3 mb-4">
                                    {cart.map((item) => (
                                        <div key={item.product._id} className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                                {item.quantity}
                                            </div>
                                            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-sm">{item.product.name}</h4>
                                                <p className="text-xs text-gray-500">{item.product.weight}</p>
                                                <p className="font-bold text-sm">${item.product.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t pt-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Subtotal</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Delivery Fee</span>
                                        <span>{deliveryFee === 0 ? "FREE" : `$${deliveryFee}`}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={createOrderMutation.isLoading}
                                    className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium mt-6 transition-colors disabled:opacity-50"
                                >
                                    {createOrderMutation.isLoading ? "Placing Order..." : "Place Order"}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Checkout