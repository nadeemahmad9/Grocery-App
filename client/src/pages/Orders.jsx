// import { useQuery } from "@tanstack/react-query"
// import { motion } from "framer-motion"
// import { Package, Clock, CheckCircle, XCircle } from "lucide-react"
// import axios from "axios"
// import { useAuth } from "../contexts/AuthContext"

// const Orders = () => {
//     const { user } = useAuth()

//     const { data: ordersData, isLoading } = useQuery(
//         "my-orders",
//         async () => {
//             const response = await axios.get("/api/orders/my-orders")
//             return response.data
//         },
//         {
//             enabled: !!user,
//         },
//     )

//     const getStatusIcon = (status) => {
//         switch (status) {
//             case "delivered":
//                 return <CheckCircle className="w-5 h-5 text-green-500" />
//             case "cancelled":
//                 return <XCircle className="w-5 h-5 text-red-500" />
//             case "pending":
//                 return <Clock className="w-5 h-5 text-yellow-500" />
//             default:
//                 return <Package className="w-5 h-5 text-blue-500" />
//         }
//     }

//     const getStatusColor = (status) => {
//         switch (status) {
//             case "delivered":
//                 return "bg-green-100 text-green-800"
//             case "cancelled":
//                 return "bg-red-100 text-red-800"
//             case "pending":
//                 return "bg-yellow-100 text-yellow-800"
//             case "confirmed":
//                 return "bg-blue-100 text-blue-800"
//             case "processing":
//                 return "bg-purple-100 text-purple-800"
//             case "shipped":
//                 return "bg-indigo-100 text-indigo-800"
//             default:
//                 return "bg-gray-100 text-gray-800"
//         }
//     }

//     if (isLoading) {
//         return (
//             <div className="min-h-screen bg-gray-50">
//                 <div className="max-w-4xl mx-auto px-4 py-8">
//                     <div className="animate-pulse space-y-4">
//                         {[...Array(3)].map((_, i) => (
//                             <div key={i} className="bg-white rounded-lg p-6">
//                                 <div className="bg-gray-200 h-6 w-1/4 mb-4"></div>
//                                 <div className="bg-gray-200 h-4 w-1/2 mb-2"></div>
//                                 <div className="bg-gray-200 h-4 w-1/3"></div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         )
//     }

//     return (
//         <div className="min-h-screen bg-gray-50">
//             <div className="max-w-4xl mx-auto px-4 py-8">
//                 <div className="mb-8">
//                     <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
//                     <p className="text-gray-600">Track and manage your orders</p>
//                 </div>

//                 {!ordersData?.orders || ordersData.orders.length === 0 ? (
//                     <div className="bg-white rounded-lg shadow-lg p-8 text-center">
//                         <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                         <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
//                         <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
//                         <a
//                             href="/products"
//                             className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
//                         >
//                             Start Shopping
//                         </a>
//                     </div>
//                 ) : (
//                     <div className="space-y-6">
//                         {ordersData.orders.map((order, index) => (
//                             <motion.div
//                                 key={order._id}
//                                 initial={{ opacity: 0, y: 20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 transition={{ delay: index * 0.1 }}
//                                 className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
//                             >
//                                 <div className="p-6">
//                                     <div className="flex justify-between items-start mb-4">
//                                         <div>
//                                             <h3 className="text-lg font-semibold text-gray-900">Order #{order.orderNumber}</h3>
//                                             <p className="text-sm text-gray-600">
//                                                 Placed on {new Date(order.createdAt).toLocaleDateString()}
//                                             </p>
//                                         </div>
//                                         <div className="flex items-center space-x-2">
//                                             {getStatusIcon(order.orderStatus)}
//                                             <span
//                                                 className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}
//                                             >
//                                                 {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
//                                             </span>
//                                         </div>
//                                     </div>

//                                     <div className="border-t border-gray-200 pt-4">
//                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                                             <div>
//                                                 <h4 className="font-medium text-gray-900 mb-2">Items ({order.items.length})</h4>
//                                                 <div className="space-y-2">
//                                                     {order.items.slice(0, 2).map((item) => (
//                                                         <div key={item._id} className="flex items-center space-x-3">
//                                                             <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
//                                                             <div className="flex-1">
//                                                                 <p className="text-sm font-medium">{item.product?.name}</p>
//                                                                 <p className="text-xs text-gray-500">
//                                                                     Qty: {item.quantity} × ${item.price}
//                                                                 </p>
//                                                             </div>
//                                                         </div>
//                                                     ))}
//                                                     {order.items.length > 2 && (
//                                                         <p className="text-sm text-gray-500">+{order.items.length - 2} more items</p>
//                                                     )}
//                                                 </div>
//                                             </div>

//                                             <div>
//                                                 <h4 className="font-medium text-gray-900 mb-2">Delivery Address</h4>
//                                                 <div className="text-sm text-gray-600">
//                                                     <p>{order.shippingAddress.name}</p>
//                                                     <p>{order.shippingAddress.phone}</p>
//                                                     <p>{order.shippingAddress.address}</p>
//                                                     {order.shippingAddress.city && (
//                                                         <p>
//                                                             {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
//                                                             {order.shippingAddress.zipCode}
//                                                         </p>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         <div className="flex justify-between items-center pt-4 border-t border-gray-200">
//                                             <div className="text-sm text-gray-600">
//                                                 <p>Payment: {order.paymentMethod.toUpperCase()}</p>
//                                                 <p>
//                                                     Status:{" "}
//                                                     <span
//                                                         className={`font-medium ${order.paymentStatus === "paid"
//                                                             ? "text-green-600"
//                                                             : order.paymentStatus === "failed"
//                                                                 ? "text-red-600"
//                                                                 : "text-yellow-600"
//                                                             }`}
//                                                     >
//                                                         {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
//                                                     </span>
//                                                 </p>
//                                             </div>
//                                             <div className="text-right">
//                                                 <p className="text-lg font-bold text-gray-900">${order.total.toFixed(2)}</p>
//                                                 <p className="text-sm text-gray-600">
//                                                     {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </motion.div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     )
// }

// export default Orders



import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Package, Clock, CheckCircle, XCircle } from "lucide-react"
import axios from "axios"
import { useAuth } from "../contexts/AuthContext"

const Orders = () => {
    const { user } = useAuth()

    const { data: ordersData, isLoading } = useQuery({
        queryKey: ["my-orders"],
        queryFn: async () => {
            const response = await axios.get("/api/orders/my-orders")
            return response.data
        },
        enabled: !!user,
    })

    const getStatusIcon = (orderstatus) => {
        switch (orderstatus) {
            case "delivered":
                return <CheckCircle className="w-5 h-5 text-green-500" />
            case "cancelled":
                return <XCircle className="w-5 h-5 text-red-500" />
            case "pending":
                return <Clock className="w-5 h-5 text-yellow-500" />
            default:
                return <Package className="w-5 h-5 text-blue-500" />
        }
    }

    const getStatusColor = (orderstatus) => {
        switch (orderstatus) {
            case "delivered":
                return "bg-green-100 text-green-800"
            case "cancelled":
                return "bg-red-100 text-red-800"
            case "pending":
                return "bg-yellow-100 text-yellow-800"
            case "confirmed":
                return "bg-blue-100 text-blue-800"
            case "processing":
                return "bg-purple-100 text-purple-800"
            case "shipped":
                return "bg-indigo-100 text-indigo-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="animate-pulse space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white rounded-lg p-6">
                                <div className="bg-gray-200 h-6 w-1/4 mb-4"></div>
                                <div className="bg-gray-200 h-4 w-1/2 mb-2"></div>
                                <div className="bg-gray-200 h-4 w-1/3"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
                    <p className="text-gray-600">Track and manage your orders</p>
                </div>

                {!ordersData?.orders || ordersData.orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
                        <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
                        <a
                            href="/products"
                            className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
                        >
                            Start Shopping
                        </a>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {ordersData.orders.map((order, index) => (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">Order #{order.orderNumber}</h3>
                                            <p className="text-sm text-gray-600">
                                                Placed on {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {getStatusIcon(order.orderstatus)}
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}
                                            >
                                                {order.orderStatus
                                                    ? order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)
                                                    : "Unknown"}
                                            </span>

                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2">Items ({order.items.length})</h4>
                                                <div className="space-y-2">
                                                    {order.items.slice(0, 2).map((item) => (
                                                        <div key={item._id} className="flex items-center space-x-3">
                                                            <div className="w-10 h-10  rounded-lg">
                                                                <img src={item.product.images} alt={item.name} />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-sm font-medium">{item.product?.name}</p>
                                                                <p className="text-xs text-gray-500">
                                                                    Qty: {item.quantity} × ₹{item.price}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {order.items.length > 2 && (
                                                        <p className="text-sm text-gray-500">+{order.items.length - 2} more items</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2">Delivery Address</h4>
                                                <div className="text-sm text-gray-600">
                                                    <p>{order.shippingAddress.name}</p>
                                                    <p>{order.shippingAddress.phone}</p>
                                                    <p>{order.shippingAddress.address}</p>
                                                    {order.shippingAddress.city && (
                                                        <p>
                                                            {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                                                            {order.shippingAddress.zipCode}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                            <div className="text-sm text-gray-600">
                                                <p>Payment: {order.paymentMethod.toUpperCase()}</p>
                                                {/* <p>
                                                    Status:{" "}
                                                    <span
                                                        className={`font-medium ${order.paymentStatus === "paid"
                                                            ? "text-green-600"
                                                            : order.paymentStatus === "failed"
                                                                ? "text-red-600"
                                                                : "text-yellow-600"
                                                            }`}
                                                    >
                                                        {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                                                    </span>
                                                </p> */}

                                                <p>
                                                    Status:{" "}
                                                    <span className={`font-medium ${order.paymentStatus === "paid"
                                                        ? "text-green-600"
                                                        : order.paymentStatus === "failed"
                                                            ? "text-red-600"
                                                            : "text-yellow-600"
                                                        }`}>
                                                        {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                                                    </span>
                                                </p>

                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-gray-900">₹{order.total.toFixed(2)}</p>
                                                <p className="text-sm text-gray-600">
                                                    {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Orders
