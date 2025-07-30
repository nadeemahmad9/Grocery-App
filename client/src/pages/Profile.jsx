import { useState } from "react"
import { motion } from "framer-motion"
import { User, Phone, Mail, MapPin, Edit, Save, X } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import toast from "react-hot-toast"
import { useAuth } from "../contexts/AuthContext"

const Profile = () => {
    const { user } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        name: user?.name || "",
        phone: user?.phone || "",
        addresses: user?.addresses || [],
    })

    const queryClient = useQueryClient()

    // const updateProfileMutation = useMutation((profileData) => axios.put("/api/users/profile", profileData), {
    //     onSuccess: () => {
    //         queryClient.invalidateQueries("auth")
    //         toast.success("Profile updated successfully")
    //         setIsEditing(false)
    //     },
    //     onError: (error) => {
    //         toast.error(error.response?.data?.message || "Failed to update profile")
    //     },
    // })

    const updateProfileMutation = useMutation({
        mutationFn: (profileData) => axios.put("/api/users/profile", profileData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["auth"] })
            toast.success("Profile updated successfully")
            setIsEditing(false)
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update profile")
        }
    })

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleAddressChange = (index, field, value) => {
        const newAddresses = [...formData.addresses]
        newAddresses[index] = {
            ...newAddresses[index],
            [field]: value,
        }
        setFormData({
            ...formData,
            addresses: newAddresses,
        })
    }

    const addAddress = () => {
        setFormData({
            ...formData,
            addresses: [
                ...formData.addresses,
                {
                    type: "home",
                    address: "",
                    city: "",
                    state: "",
                    zipCode: "",
                    isDefault: formData.addresses.length === 0,
                },
            ],
        })
    }

    const removeAddress = (index) => {
        const newAddresses = formData.addresses.filter((_, i) => i !== index)
        setFormData({
            ...formData,
            addresses: newAddresses,
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        updateProfileMutation.mutate(formData)
    }

    const handleCancel = () => {
        setFormData({
            name: user?.name || "",
            phone: user?.phone || "",
            addresses: user?.addresses || [],
        })
        setIsEditing(false)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
                    <p className="text-gray-600">Manage your account information and addresses</p>
                </div>

                {user?.profileImage && (
                    <div className="mb-8 flex justify-center">
                        <img
                            src={user.profileImage}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover border-4 border-red-500 shadow-md"
                        />
                    </div>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Info */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold">Personal Information</h2>
                                    {!isEditing ? (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center space-x-2 text-red-500 hover:text-red-600"
                                        >
                                            <Edit className="w-4 h-4" />
                                            <span>Edit</span>
                                        </button>
                                    ) : (
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={handleCancel}
                                                className="flex items-center space-x-2 text-gray-500 hover:text-gray-600"
                                            >
                                                <X className="w-4 h-4" />
                                                <span>Cancel</span>
                                            </button>
                                            <button
                                                onClick={handleSubmit}
                                                disabled={updateProfileMutation.isLoading}
                                                className="flex items-center space-x-2 text-green-500 hover:text-green-600"
                                            >
                                                <Save className="w-4 h-4" />
                                                <span>Save</span>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <User className="w-4 h-4 inline mr-2" />
                                                Full Name
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                                />
                                            ) : (
                                                <p className="text-gray-900 py-2">{user?.name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Mail className="w-4 h-4 inline mr-2" />
                                                Email Address
                                            </label>
                                            <p className="text-gray-900 py-2">{user?.email}</p>
                                            <p className="text-xs text-gray-500">Email cannot be changed</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Phone className="w-4 h-4 inline mr-2" />
                                                Phone Number
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                                />
                                            ) : (
                                                <p className="text-gray-900 py-2">{user?.phone || "Not provided"}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Addresses */}
                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-medium text-gray-900">
                                                <MapPin className="w-5 h-5 inline mr-2" />
                                                Delivery Addresses
                                            </h3>
                                            {isEditing && (
                                                <button
                                                    type="button"
                                                    onClick={addAddress}
                                                    className="text-red-500 hover:text-red-600 text-sm font-medium"
                                                >
                                                    + Add Address
                                                </button>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            {formData.addresses.map((address, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="border border-gray-200 rounded-lg p-4"
                                                >
                                                    {isEditing ? (
                                                        <div className="space-y-3">
                                                            <div className="flex justify-between items-center">
                                                                <select
                                                                    value={address.type}
                                                                    onChange={(e) => handleAddressChange(index, "type", e.target.value)}
                                                                    className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                                                                >
                                                                    <option value="home">Home</option>
                                                                    <option value="work">Work</option>
                                                                    <option value="other">Other</option>
                                                                </select>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeAddress(index)}
                                                                    className="text-red-500 hover:text-red-600 text-sm"
                                                                >
                                                                    Remove
                                                                </button>
                                                            </div>
                                                            <textarea
                                                                value={address.address}
                                                                onChange={(e) => handleAddressChange(index, "address", e.target.value)}
                                                                placeholder="Street address"
                                                                rows={2}
                                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                                            />
                                                            <div className="grid grid-cols-3 gap-3">
                                                                <input
                                                                    type="text"
                                                                    value={address.city}
                                                                    onChange={(e) => handleAddressChange(index, "city", e.target.value)}
                                                                    placeholder="City"
                                                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    value={address.state}
                                                                    onChange={(e) => handleAddressChange(index, "state", e.target.value)}
                                                                    placeholder="State"
                                                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    value={address.zipCode}
                                                                    onChange={(e) => handleAddressChange(index, "zipCode", e.target.value)}
                                                                    placeholder="ZIP Code"
                                                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                                                />
                                                            </div>
                                                            <label className="flex items-center">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={address.isDefault}
                                                                    onChange={(e) => handleAddressChange(index, "isDefault", e.target.checked)}
                                                                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                                                                />
                                                                <span className="ml-2 text-sm text-gray-700">Set as default address</span>
                                                            </label>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <div className="flex justify-between items-start mb-2">
                                                                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                                                                    {address.type.charAt(0).toUpperCase() + address.type.slice(1)}
                                                                </span>
                                                                {address.isDefault && (
                                                                    <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                                                                        Default
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-gray-900">{address.address}</p>
                                                            {(address.city || address.state || address.zipCode) && (
                                                                <p className="text-gray-600 text-sm">
                                                                    {[address.city, address.state, address.zipCode].filter(Boolean).join(", ")}
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}
                                                </motion.div>
                                            ))}

                                            {formData.addresses.length === 0 && (
                                                <p className="text-gray-500 text-center py-4">No addresses added yet</p>
                                            )}
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Account Summary */}
                    <div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold mb-4">Account Summary</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Member since</span>
                                    <span className="font-medium">{new Date(user?.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Account type</span>
                                    <span className="font-medium capitalize">{user?.role}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total addresses</span>
                                    <span className="font-medium">{user?.addresses?.length || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile