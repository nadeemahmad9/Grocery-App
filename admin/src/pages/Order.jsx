import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Search, Eye, Package, Truck, CheckCircle, XCircle, Clock, DollarSign } from "lucide-react"
import toast from "react-hot-toast"

const Orders = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [showModal, setShowModal] = useState(false)

    const queryClient = useQueryClient()



    const { data, isLoading } = useQuery({
        queryKey: ["orders"],
        queryFn: async () => {
            const response = await fetch("http://localhost:5006/api/orders", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (!response.ok) throw new Error("Failed to fetch orders");
            return response.json(); // returns full object: { orders, totalPages, ... }
        },
    });

    const orders = data?.orders || [];
    console.log("Fetched orders:", orders);



    const updateStatusMutation = useMutation({
        mutationFn: async ({ orderId, orderStatus, paymentStatus }) => {
            const response = await fetch(`http://localhost:5006/api/orders/${orderId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ orderStatus, paymentStatus }),
            })
            if (!response.ok) throw new Error("Failed to update order status")
            return response.json()
        },

        // onSuccess: () => {
        //     queryClient.invalidateQueries({ queryKey: ["orders"] })
        //     toast.success("Order status updated!")
        // },

        onSuccess: (updatedOrder) => {
            queryClient.setQueryData(["orders"], (oldData) => {
                if (!oldData) return oldData;

                return {
                    ...oldData,
                    orders: oldData.orders.map((order) =>
                        order._id === updatedOrder._id ? updatedOrder : order
                    ),
                };
            });

            toast.success("Order status updated!");
        },

        onError: (error) => {
            toast.error(error.message)
        },
    })

    const updatePaymentStatusMutation = useMutation({
        mutationFn: async ({ orderId, paymentStatus }) => {
            const response = await fetch(`http://localhost:5006/api/orders/${orderId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ paymentStatus }),
            })
            if (!response.ok) throw new Error("Failed to update payment status")
            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] })
            queryClient.invalidateQueries({ queryKey: ["user-orders"] })
            toast.success("Payment status updated!")
        },
        onError: (error) => {
            toast.error(error.message)
        },
    })


    const getStatusIcon = (orderstatus) => {
        switch (orderstatus) {
            case "pending":
                return <Clock className="h-4 w-4 text-yellow-500" />
            case "processing":
                return <Package className="h-4 w-4 text-blue-500" />
            case "shipped":
                return <Truck className="h-4 w-4 text-purple-500" />
            case "delivered":
                return <CheckCircle className="h-4 w-4 text-green-500" />
            case "cancelled":
                return <XCircle className="h-4 w-4 text-red-500" />
            default:
                return <Clock className="h-4 w-4 text-gray-500" />
        }
    }

    const getStatusColor = (orderstatus) => {
        switch (orderstatus) {
            case "pending":
                return "bg-yellow-100 text-yellow-800"
            case "processing":
                return "bg-blue-100 text-blue-800"
            case "shipped":
                return "bg-purple-100 text-purple-800"
            case "delivered":
                return "bg-green-100 text-green-800"
            case "cancelled":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const handleStatusChange = (orderId, newStatus, paymentStatus) => {
        updateStatusMutation.mutate({ orderId, orderStatus: newStatus, paymentStatus })
    }


    const handlePaymentStatusChange = (orderId, newStatus) => {
        updatePaymentStatusMutation.mutate({ orderId, paymentStatus: newStatus })
    }

    const handleViewOrder = (order) => {
        setSelectedOrder(order)
        setShowModal(true)
    }

    // const filteredOrders = orders.filter((order) => {
    //     const matchesSearch =
    //         order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    //     const matchesStatus = statusFilter === "all" || order.status === statusFilter
    //     return matchesSearch && matchesStatus
    // })

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "all" || order.orderstatus === statusFilter


        return matchesSearch && matchesStatus
    })


    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        )
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
                    <p className="mt-2 text-sm text-gray-700">Manage and track all customer orders</p>
                </div>
            </div>

            {/* Filters */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500"
                        />
                    </div>
                </div>
                <div>


                    {/* <select
                        value={orders.orderstatus}
                        onChange={(e) =>
                            updateStatusMutation.mutate({
                                orderId: orders._id,
                                orderStatus: e.target.value,
                                paymentStatus: order.paymentstatus,
                            })
                        }
                    >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select> */}

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                </div>
            </div>

            {/* Orders Table */}
            <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide ">
                                            Order ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">
                                            Customer
                                        </th>
                                        <th className="px-11 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">
                                            Total
                                        </th>
                                        <th className="px-10 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">
                                            Status
                                        </th>


                                        <th className="px-10 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">
                                            Date
                                        </th>
                                        <th className="px-10 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">
                                            Actions
                                        </th>
                                        <th className="px-10 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">
                                            Payment
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredOrders.map((order) => (
                                        <motion.tr
                                            key={order._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                #{order._id.slice(-8)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{order.user?.name || "N/A"}</div>
                                                <div className="text-sm text-gray-500">{order.user?.email || "N/A"}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-gray-900">
                                                    <span className="h-4 w-4 " />
                                                    ₹{order.total?.toFixed(2) || "0.00"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {getStatusIcon(order.orderstatus)}
                                                    <span
                                                        className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.orderstatus)}`}
                                                    >
                                                        {order.orderstatus}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                <button onClick={() => handleViewOrder(order)} className="text-red-600 hover:text-red-900">
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <select
                                                    value={order.orderstatus}
                                                    onChange={(e) => handleStatusChange(order._id, e.target.value, order.paymentStatus)}
                                                    className="text-xs border border-gray-300 rounded px-2 py-1"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <select
                                                    value={order.paymentStatus}
                                                    onChange={(e) =>
                                                        handlePaymentStatusChange(order._id, e.target.value)
                                                    }
                                                    className="text-xs border border-gray-300 rounded px-2 py-1"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="paid">Paid</option>
                                                    <option value="failed">Failed</option>
                                                    <option value="refunded">Refunded</option>
                                                </select>
                                            </td>

                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Detail Modal */}
            {showModal && selectedOrder && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Details - #{selectedOrder._id.slice(-8)}</h3>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-medium text-gray-900">Customer Information</h4>
                                        <p className="text-sm text-gray-600">{selectedOrder.user?.name}</p>
                                        <p className="text-sm text-gray-600">{selectedOrder.user?.email}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Order Status</h4>
                                        <div className="flex items-center mt-1">
                                            {getStatusIcon(selectedOrder.orderstatus)}
                                            <span
                                                className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.orderstatus)}`}
                                            >
                                                {selectedOrder.orderstatus}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium text-gray-900">Shipping Address</h4>
                                    <div className="text-sm text-gray-600">
                                        <p>{selectedOrder.shippingAddress?.street}</p>
                                        <p>
                                            {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}{" "}
                                            {selectedOrder.shippingAddress?.zipCode}
                                        </p>
                                        <p>{selectedOrder.shippingAddress?.country}</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium text-gray-900">Order Items</h4>
                                    <div className="mt-2 space-y-2">
                                        {selectedOrder.items?.map((item, index) => (
                                            <div key={index} className="flex justify-between items-center py-2 border-b">
                                                <div>
                                                    <p className="text-sm font-medium">{item.product?.name || "Product"}</p>
                                                    <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                                                </div>
                                                <p className="text-sm font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-gray-900">Total Amount:</span>
                                        <span className="font-bold text-lg">₹{selectedOrder.total?.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Orders


// import { useState } from "react"
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
// import toast from "react-hot-toast"

// const Orders = () => {
//     const [selectedOrder, setSelectedOrder] = useState(null)
//     const [showModal, setShowModal] = useState(false)
//     const queryClient = useQueryClient()

//     const { data: orders = [] } = useQuery({
//         queryKey: ["orders"],
//         queryFn: async () => {
//             const response = await fetch("http://localhost:5006/api/orders", {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 },
//             })
//             return response.json()
//         },
//     })

//     const updateStatusMutation = useMutation({
//         mutationFn: async ({ orderId, status }) => {
//             const response = await fetch(`http://localhost:5006/api/orders/${orderId}/status`, {
//                 method: "PUT",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 },
//                 body: JSON.stringify({ status }),
//             })
//             if (!response.ok) throw new Error("Failed to update status")
//             return response.json()
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["orders"] })
//             toast.success("Order status updated!")
//         },
//         onError: (error) => {
//             toast.error(error.message)
//         },
//     })

//     const updatePaymentStatusMutation = useMutation({
//         mutationFn: async ({ orderId, paymentStatus }) => {
//             const response = await fetch(`http://localhost:5006/api/orders/${orderId}/payment-status`, {
//                 method: "PUT",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 },
//                 body: JSON.stringify({ paymentStatus }),
//             })
//             if (!response.ok) throw new Error("Failed to update payment status")
//             return response.json()
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["orders"] })
//             toast.success("Payment status updated!")
//         },
//         onError: (error) => {
//             toast.error(error.message)
//         },
//     })

//     const handleStatusChange = (orderId, newStatus) => {
//         updateStatusMutation.mutate({ orderId, status: newStatus })
//     }

//     const handlePaymentStatusChange = (orderId, newStatus) => {
//         updatePaymentStatusMutation.mutate({ orderId, paymentStatus: newStatus })
//     }

//     return (
//         <div className="px-6 py-8">
//             <h1 className="text-2xl font-bold mb-6">Orders</h1>
//             <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200 bg-white shadow-sm">
//                     <thead className="bg-gray-100">
//                         <tr>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destination</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                         {Array.isArray(orders) && orders.map((order) => (
//                             <tr key={order._id}>
//                                 <td className="px-6 py-4 text-sm text-gray-900">{order.name}</td>
//                                 <td className="px-6 py-4 text-sm text-gray-900">{order.email}</td>
//                                 <td className="px-6 py-4 text-sm text-gray-900">{order.destination}</td>
//                                 <td className="px-6 py-4 text-sm text-gray-900">{order.date}</td>
//                                 <td className="px-6 py-4 text-sm text-gray-900">
//                                     <select
//                                         value={order.status}
//                                         onChange={(e) => handleStatusChange(order._id, e.target.value)}
//                                         className="text-xs border border-gray-300 rounded px-2 py-1"
//                                     >
//                                         <option value="pending">Pending</option>
//                                         <option value="approved">Approved</option>
//                                         <option value="cancelled">Cancelled</option>
//                                     </select>
//                                 </td>
//                                 <td className="px-6 py-4 text-sm text-gray-900">
//                                     <select
//                                         value={order.paymentStatus}
//                                         onChange={(e) => handlePaymentStatusChange(order._id, e.target.value)}
//                                         className="text-xs border border-gray-300 rounded px-2 py-1"
//                                     >
//                                         <option value="pending">Pending</option>
//                                         <option value="paid">Paid</option>
//                                         <option value="failed">Failed</option>
//                                         <option value="refunded">Refunded</option>
//                                     </select>
//                                 </td>
//                                 <td className="px-6 py-4 text-sm text-blue-600 cursor-pointer">
//                                     <button
//                                         onClick={() => {
//                                             setSelectedOrder(order)
//                                             setShowModal(true)
//                                         }}
//                                         className="hover:underline"
//                                     >
//                                         View
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}

//                     </tbody>
//                 </table>
//             </div>

//             {showModal && selectedOrder && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
//                     <div className="bg-white p-6 rounded-lg max-w-md w-full">
//                         <h3 className="text-xl font-semibold mb-4">Order Details</h3>
//                         <p><strong>Name:</strong> {selectedOrder.name}</p>
//                         <p><strong>Email:</strong> {selectedOrder.email}</p>
//                         <p><strong>Destination:</strong> {selectedOrder.destination}</p>
//                         <p><strong>Date:</strong> {selectedOrder.date}</p>
//                         <div className="mt-4">
//                             <label className="block text-sm font-medium text-gray-700">Order Status</label>
//                             <select
//                                 value={selectedOrder.status}
//                                 onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
//                                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm text-sm px-2 py-1"
//                             >
//                                 <option value="pending">Pending</option>
//                                 <option value="approved">Approved</option>
//                                 <option value="cancelled">Cancelled</option>
//                             </select>
//                         </div>
//                         <div className="mt-4">
//                             <label className="block text-sm font-medium text-gray-700">Payment Status</label>
//                             <select
//                                 value={selectedOrder.paymentStatus}
//                                 onChange={(e) => handlePaymentStatusChange(selectedOrder._id, e.target.value)}
//                                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm text-sm px-2 py-1"
//                             >
//                                 <option value="pending">Pending</option>
//                                 <option value="paid">Paid</option>
//                                 <option value="failed">Failed</option>
//                                 <option value="refunded">Refunded</option>
//                             </select>
//                         </div>
//                         <button
//                             onClick={() => setShowModal(false)}
//                             className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//                         >
//                             Close
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     )
// }

// export default Orders
