import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Package, Users, ShoppingCart, DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import axios from "axios"

const Dashboard = () => {
    // const { data: stats, isLoading } = useQuery("dashboard-stats", async () => {
    //     const [products, users, orders] = await Promise.all([
    //         axios.get("/api/products"),
    //         axios.get("/api/users"),
    //         axios.get("/api/orders"),
    //     ])

    //     const totalRevenue = orders.data.orders.reduce((sum, order) => sum + order.total, 0)

    //     return {
    //         totalProducts: products.data.total,
    //         totalUsers: users.data.total,
    //         totalOrders: orders.data.total,
    //         totalRevenue,
    //         recentOrders: orders.data.orders.slice(0, 5),
    //     }
    // })

    const { data: stats, isLoading } = useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: async () => {
            const [products, users, orders] = await Promise.all([
                axios.get("/api/products"),
                axios.get("/api/users"),
                axios.get("/api/orders"),
            ])

            const totalRevenue = orders.data.orders.reduce((sum, order) => sum + order.total, 0)

            return {
                totalProducts: products.data.total,
                totalUsers: users.data.total,
                totalOrders: orders.data.total,
                totalRevenue,
                recentOrders: orders.data.orders.slice(0, 5),
            }
        }
    })


    const salesData = [
        { name: "Jan", sales: 4000, orders: 240 },
        { name: "Feb", sales: 3000, orders: 139 },
        { name: "Mar", sales: 2000, orders: 980 },
        { name: "Apr", sales: 2780, orders: 390 },
        { name: "May", sales: 1890, orders: 480 },
        { name: "Jun", sales: 2390, orders: 380 },
    ]

    const statsCards = [
        {
            title: "Total Products",
            value: stats?.totalProducts || 0,
            icon: Package,
            color: "bg-blue-500",
            change: "+12%",
            trend: "up",
        },
        {
            title: "Total Users",
            value: stats?.totalUsers || 0,
            icon: Users,
            color: "bg-green-500",
            change: "+8%",
            trend: "up",
        },
        {
            title: "Total Orders",
            value: stats?.totalOrders || 0,
            icon: ShoppingCart,
            color: "bg-yellow-500",
            change: "+15%",
            trend: "up",
        },
        {
            title: "Total Revenue",
            value: `₹${stats?.totalRevenue || 0}`,
            icon: DollarSign,
            color: "bg-red-500",
            change: "+23%",
            trend: "up",
        },
    ]

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
        )
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsCards.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-lg shadow p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                <div className="flex items-center mt-2">
                                    {stat.trend === "up" ? (
                                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                    ) : (
                                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                                    )}
                                    <span className={`text-sm ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                                        {stat.change}
                                    </span>
                                </div>
                            </div>
                            <div className={`p-3 rounded-full ${stat.color}`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-lg shadow p-6"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Overview</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="sales" fill="#ef4444" />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-lg shadow p-6"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="orders" stroke="#ef4444" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Recent Orders */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {stats?.recentOrders?.map((order) => (
                                <tr key={order._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.user?.name || "N/A"}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${order.orderstatus === "delivered"
                                                ? "bg-green-100 text-green-800"
                                                : order.orderstatus === "pending"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-blue-100 text-blue-800"
                                                }`}
                                        >
                                            {order.orderstatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{order.total}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    )
}

export default Dashboard