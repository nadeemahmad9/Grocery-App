import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2, Search, FolderOpen } from "lucide-react"
import toast from "react-hot-toast"




const getImageUrl = (images) => {
    const img = Array.isArray(images) ? images[0] : images;
    if (!img) return "http://localhost:5173/images/fallback.png";

    // If it's already a full URL
    if (img.startsWith("http")) return img;

    // If it's already starting with /images/, use as is
    if (img.startsWith("/images")) {
        return `http://localhost:5173${img}`;
    }

    // Else, build the full image path
    return `http://localhost:5173/images/categories/${img}`;
};


const Categories = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [editingCategory, setEditingCategory] = useState(null)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        image: "",
    })

    const queryClient = useQueryClient()

    // Fetch categories
    const { data: categories = [], isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const response = await fetch("http://localhost:5006/api/categories", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (!response.ok) throw new Error("Failed to fetch categories");
            return response.json();
        },
    });





    const categoryMutation = useMutation({
        mutationFn: async (categoryData) => {
            const url = editingCategory
                ? `http://localhost:5006/api/categories/${editingCategory._id}`
                : "http://localhost:5006/api/categories";

            const response = await fetch(url, {
                method: editingCategory ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(categoryData),
            });

            if (!response.ok) throw new Error("Failed to save category");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast.success(editingCategory ? "Category updated!" : "Category created!");
            handleCloseModal();
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    // Delete category mutation
    const deleteMutation = useMutation({
        mutationFn: async (categoryId) => {
            const response = await fetch(`http://localhost:5006/api/categories/${categoryId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) throw new Error("Failed to delete category");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast.success("Category deleted!");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });


    const handleSubmit = (e) => {
        e.preventDefault()
        categoryMutation.mutate(formData)
    }

    const handleEdit = (category) => {
        setEditingCategory(category)
        setFormData({
            name: category.name,
            description: category.description,
            image: category.image || "",
        })
        setShowModal(true)
    }

    const handleDelete = (categoryId) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            deleteMutation.mutate(categoryId)
        }
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setEditingCategory(null)
        setFormData({ name: "", description: "", image: "" })
    }

    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()),
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
                    <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
                    <p className="mt-2 text-sm text-gray-700">Manage product categories for your grocery store</p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Category
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="mt-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    />
                </div>
            </div>

            {/* Categories Grid */}
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredCategories.map((category) => (
                    <motion.div
                        key={category._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white overflow-hidden shadow rounded-lg"
                    >
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    {category.image ? (
                                        <img
                                            className="h-12 w-12 rounded-lg object-cover"
                                            src={getImageUrl(category.image)}
                                            alt={category.name}
                                        />
                                    ) : (
                                        <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                            <FolderOpen className="h-6 w-6 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">{category.name}</dt>
                                        <dd className="text-sm text-gray-900">{category.description || "No description"}</dd>
                                    </dl>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end space-x-2">
                                <button
                                    onClick={() => handleEdit(category)}
                                    className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    <Edit className="h-3 w-3 mr-1" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(category._id)}
                                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    <Trash2 className="h-3 w-3 mr-1" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
                    <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">

                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {editingCategory ? "Edit Category" : "Add New Category"}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Category Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Image URL</label>
                                    <input
                                        type="url"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"
                                    />
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
                                        disabled={categoryMutation.isLoading}
                                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50"
                                    >
                                        {categoryMutation.isLoading ? "Saving..." : "Save"}
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

export default Categories