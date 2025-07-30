import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Search, Eye, Trash2, User, Mail, Calendar, ShieldCheck } from "lucide-react"
import toast from "react-hot-toast"

const Users = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")
    const [selectedUser, setSelectedUser] = useState(null)
    const [showModal, setShowModal] = useState(false)

    const queryClient = useQueryClient()

    // Fetch users
    const { data: users = [], isLoading } = useQuery({
        queryKey: ["users"],
        // queryFn: async () => {
        //     const response = await fetch("http://localhost:5006/api/users", {
        //         headers: {
        //             Authorization: `Bearer ${localStorage.getItem("token")}`,
        //         },
        //     });
        //     if (!response.ok) throw new Error("Failed to fetch users");
        //     console.log(response.json);


        //     return response.json();
        // },

        queryFn: async () => {
            const response = await fetch("http://localhost:5006/api/users", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) throw new Error("Failed to fetch users");

            const data = await response.json();

            return data.users || data; // return the array
        }

    });


    // Update user role mutation
    const updateRoleMutation = useMutation({
        mutationFn: async ({ userId, role }) => {
            const response = await fetch(`http://localhost:5006/api/users/${userId}/role`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ role }),
            });

            if (!response.ok) throw new Error("Failed to update user role");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("User role updated!");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });


    // Delete user mutation
    const deleteMutation = useMutation({
        mutationFn: async (userId) => {
            const response = await fetch(`http://localhost:5006/api/users/${userId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) throw new Error("Failed to delete user");

            return response.json(); // ✅ Return response if your backend sends one
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("User deleted!");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });



    const handleRoleChange = (userId, newRole) => {
        updateRoleMutation.mutate({ userId, role: newRole })
    }

    const handleDelete = (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            deleteMutation.mutate(userId)
        }
    }

    const handleViewUser = (user) => {
        setSelectedUser(user)
        setShowModal(true)
    }

    const getRoleIcon = (role) => {
        return role === "admin" ? (
            <ShieldCheck className="h-4 w-4 text-red-500" />
        ) : (
            <User className="h-4 w-4 text-blue-500" />
        )
    }

    const getRoleColor = (role) => {
        return role === "admin" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
    }

    const filteredUsers = Array.isArray(users)
        ? users.filter((user) => {
            const matchesSearch =
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = roleFilter === "all" || user.role === roleFilter;
            return matchesSearch && matchesRole;
        })
        : [];


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
                    <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
                    <p className="mt-2 text-sm text-gray-700">Manage user accounts and permissions</p>
                </div>
            </div>

            {/* Filters */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500"
                        />
                    </div>
                </div>
                <div>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                    >
                        <option value="all">All Roles</option>
                        <option value="user">Users</option>
                        <option value="admin">Admins</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                                            Joined
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredUsers.map((user) => (
                                        <motion.tr
                                            key={user._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                            <User className="h-5 w-5 text-gray-500" />
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-gray-900">
                                                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                                    {user.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {getRoleIcon(user.role)}
                                                    <span
                                                        className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}
                                                    >
                                                        {user.role}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Calendar className="h-4 w-4 mr-2" />
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                <button onClick={() => handleViewUser(user)} className="text-red-600 hover:text-red-900">
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                    className="text-xs border border-gray-300 rounded px-2 py-1"
                                                >
                                                    <option value="user">User</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                                <button onClick={() => handleDelete(user._id)} className="text-red-600 hover:text-red-900">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* User Detail Modal */}
            {showModal && selectedUser && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">User Details</h3>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                                        <User className="h-6 w-6 text-gray-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">{selectedUser.name}</h4>
                                        <p className="text-sm text-gray-500">{selectedUser.email}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Role</label>
                                        <div className="flex items-center mt-1">
                                            {getRoleIcon(selectedUser.role)}
                                            <span
                                                className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(selectedUser.role)}`}
                                            >
                                                {selectedUser.role}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Joined</label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {new Date(selectedUser.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                {selectedUser.phone && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                                        <p className="mt-1 text-sm text-gray-900">{selectedUser.phone}</p>
                                    </div>
                                )}

                                {selectedUser.address && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Address</label>
                                        <div className="mt-1 text-sm text-gray-900">
                                            <p>{selectedUser.address.street}</p>
                                            <p>
                                                {selectedUser.address.city}, {selectedUser.address.state} {selectedUser.address.zipCode}
                                            </p>
                                            <p>{selectedUser.address.country}</p>
                                        </div>
                                    </div>
                                )}
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

export default Users
