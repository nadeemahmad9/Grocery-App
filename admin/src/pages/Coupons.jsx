import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2, Search, Ticket, Calendar, Percent, DollarSign } from "lucide-react"
import toast from "react-hot-toast"

const Coupons = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [editingCoupon, setEditingCoupon] = useState(null)
    const [formData, setFormData] = useState({
        code: "",
        description: "",
        discountType: "percentage",
        discountValue: "",
        minimumAmount: "",
        maxDiscount: "",
        expiryDate: "",
        usageLimit: "",
        isActive: true,
    })

    const queryClient = useQueryClient()

    // Fetch coupons
    const { data: coupons = [], isLoading } = useQuery({
        queryKey: ["coupons"],
        queryFn: async () => {
            const response = await fetch("http://localhost:5006/api/coupons", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            if (!response.ok) throw new Error("Failed to fetch coupons")
            return response.json()
        },
    })


    // Create/Update coupon mutation
    const couponMutation = useMutation({
        mutationFn: async (couponData) => {
            const url = editingCoupon
                ? `http://localhost:5006/api/coupons/${editingCoupon._id}`
                : "http://localhost:5006/api/coupons";

            const response = await fetch(url, {
                method: editingCoupon ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(couponData),
            });

            if (!response.ok) throw new Error("Failed to save coupon");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["coupons"] }); // Updated format
            toast.success(editingCoupon ? "Coupon updated!" : "Coupon created!");
            handleCloseModal();
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });


    // Delete coupon mutation
    const deleteMutation = useMutation({
        mutationFn: async (couponId) => {
            const response = await fetch(`http://localhost:5006/api/coupons/${couponId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (!response.ok) throw new Error("Failed to delete coupon");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["coupons"] });
            toast.success("Coupon deleted!");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });


    const handleSubmit = (e) => {
        e.preventDefault()
        const couponData = {
            ...formData,
            discountValue: Number.parseFloat(formData.discountValue),
            minimumAmount: formData.minimumAmount ? Number.parseFloat(formData.minimumAmount) : 0,
            maxDiscount: formData.maxDiscount ? Number.parseFloat(formData.maxDiscount) : null,
            usageLimit: formData.usageLimit ? Number.parseInt(formData.usageLimit) : null,
        }
        couponMutation.mutate(couponData)
    }

    const handleEdit = (coupon) => {
        setEditingCoupon(coupon)
        setFormData({
            code: coupon.code,
            description: coupon.description,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue ? coupon.discountValue.toString() : "",
            minimumAmount: coupon.minimumAmount?.toString() || "",
            maxDiscount: coupon.maxDiscount?.toString() || "",
            expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split("T")[0] : "",
            usageLimit: coupon.usageLimit?.toString() || "",
            isActive: coupon.isActive,
        })
        setShowModal(true)
    }

    const handleDelete = (couponId) => {
        if (window.confirm("Are you sure you want to delete this coupon?")) {
            deleteMutation.mutate(couponId)
        }
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setEditingCoupon(null)
        setFormData({
            code: "",
            description: "",
            discountType: "percentage",
            discountValue: "",
            minimumAmount: "",
            maxDiscount: "",
            expiryDate: "",
            usageLimit: "",
            isActive: true,
        })
    }

    const isExpired = (expiryDate) => {
        return expiryDate && new Date(expiryDate) < new Date()
    }

    const filteredCoupons = coupons.filter(
        (coupon) =>
            coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            coupon.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )

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
                    <h1 className="text-2xl font-semibold text-gray-900">Coupons</h1>
                    <p className="mt-2 text-sm text-gray-700">Manage discount coupons and promotional codes</p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Coupon
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="mt-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search coupons..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    />
                </div>
            </div>

            {/* Coupons Table */}
            <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                                            Code
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                                            Description
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                                            Discount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                                            Expiry
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredCoupons.map((coupon) => (
                                        <motion.tr
                                            key={coupon._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Ticket className="h-5 w-5 text-red-500 mr-2" />
                                                    <span className="text-sm font-medium text-gray-900">{coupon.code}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">{coupon.description}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-gray-900">
                                                    {coupon.discountType === "percentage" ? (
                                                        <>
                                                            <Percent className="h-4 w-4 mr-1" />
                                                            {coupon.discountValue}%
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="h-4 w-4 mr-1" />
                                                            ₹ {coupon.discountValue || "00.0"}
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Calendar className="h-4 w-4 mr-2" />
                                                    {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : "No expiry"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${!coupon.isActive
                                                        ? "bg-gray-100 text-gray-800"
                                                        : isExpired(coupon.expiryDate)
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-green-100 text-green-800"
                                                        }`}
                                                >
                                                    {!coupon.isActive ? "Inactive" : isExpired(coupon.expiryDate) ? "Expired" : "Active"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                <button onClick={() => handleEdit(coupon)} className="text-red-600 hover:text-red-900">
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => handleDelete(coupon._id)} className="text-red-600 hover:text-red-900">
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

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-md shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {editingCoupon ? "Edit Coupon" : "Add New Coupon"}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Coupon Code</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={2}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Discount Type</label>
                                        <select
                                            value={formData.discountType}
                                            onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"
                                        >
                                            <option value="percentage">Percentage</option>
                                            <option value="fixed">Fixed Amount</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Discount Value</label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            step="0.01"
                                            value={formData.discountValue}
                                            onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Minimum Amount</label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={formData.minimumAmount}
                                            onChange={(e) => setFormData({ ...formData, minimumAmount: e.target.value })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Max Discount</label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={formData.maxDiscount}
                                            onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                                        <input
                                            type="date"
                                            value={formData.expiryDate}
                                            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Usage Limit</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.usageLimit}
                                            onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                                        Active
                                    </label>
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={couponMutation.isLoading}
                                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50"
                                    >
                                        {couponMutation.isLoading ? "Saving..." : "Save"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Coupons