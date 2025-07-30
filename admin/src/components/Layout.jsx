import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { LayoutDashboard, Package, FolderOpen, ShoppingCart, Users, Ticket, Menu, X, LogOut, User } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const navigation = [
        { name: "Dashboard", href: "/", icon: LayoutDashboard },
        { name: "Products", href: "/products", icon: Package },
        { name: "Categories", href: "/categories", icon: FolderOpen },
        { name: "Orders", href: "/orders", icon: ShoppingCart },
        { name: "Users", href: "/users", icon: Users },
        { name: "Coupons", href: "/coupons", icon: Ticket },
    ]

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                <motion.div
                    initial={{ x: -300 }}
                    animate={{ x: 0 }}
                    exit={{ x: -300 }}
                    className="relative flex w-full max-w-xs flex-col bg-white"
                >
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                        <button
                            type="button"
                            className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X className="h-6 w-6 text-white" />
                        </button>
                    </div>
                    <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
                        <div className="flex flex-shrink-0 items-center px-4">
                            <h1 className="text-xl font-bold text-gray-900">Grocery Admin</h1>
                        </div>
                        <nav className="mt-5 space-y-1 px-2">
                            {navigation.map((item) => {
                                const isActive = location.pathname === item.href
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive ? "bg-red-100 text-red-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                            }`}
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <item.icon className="mr-4 h-6 w-6 flex-shrink-0" />
                                        {item.name}
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>
                </motion.div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200">
                    <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                        <div className="flex flex-shrink-0 items-center px-4">
                            <h1 className="text-xl font-bold text-gray-900">Grocery Admin</h1>
                        </div>
                        <nav className="mt-5 flex-1 space-y-1 px-2">
                            {navigation.map((item) => {
                                const isActive = location.pathname === item.href
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive ? "bg-red-100 text-red-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                            }`}
                                    >
                                        <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                                        {item.name}
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <div className="sticky top-0 z-10 bg-white border-b border-gray-200 pl-1 pt-1 sm:pl-3 sm:pt-3 lg:hidden">
                    <button
                        type="button"
                        className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>

                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-between items-center">
                            <div className="flex items-center">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    {navigation.find((item) => item.href === location.pathname)?.name || "Dashboard"}
                                </h2>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2 p-2 rounded  bg-green-800 hover:bg-green-700 cursor-[pointer]">
                                    <User className="h-5 w-5 text-gray-50" />
                                    <span className="text-sm text-gray-50">{user?.name}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-50 bg-red-700 p-2 font-bold hover:text-gray-50 hover:bg-red-500 rounded-md  cursor-[pointer]"
                                >
                                    <LogOut className="h-4 w-4 " />
                                    <span className=" ">Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main content */}
                <main className="flex-1">
                    <div className="py-6">{children}</div>
                </main>
            </div>
        </div>
    )
}

export default Layout