import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom"
import { Search, Filter, Grid, List } from "lucide-react"
import axios from "axios"
import ProductCard from "../components/ProductCard"

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "")
    const [sortBy, setSortBy] = useState("createdAt")
    const [sortOrder, setSortOrder] = useState("desc")
    const [currentPage, setCurrentPage] = useState(1)
    const [viewMode, setViewMode] = useState("grid")

    // const { data: productsData = [], isLoading } = useQuery({
    //     queryKey: ["products", currentPage, searchTerm, selectedCategory, sortBy, sortOrder],
    //     queryFn: async () => {
    //         const params = new URLSearchParams({
    //             page: currentPage,
    //             limit: 12,
    //             sortBy,
    //             sortOrder,
    //             ...(searchTerm && { search: searchTerm }),
    //             ...(selectedCategory && { category: selectedCategory }),
    //         })
    //         const response = await axios.get(`/api/products?${params}`)
    //         return response.data
    //     },
    // })

    const { data: productsData = [], isLoading } = useQuery({
        queryKey: ["products", currentPage, searchTerm, selectedCategory, sortBy, sortOrder],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: currentPage,
                limit: 12,
                sortBy,
                sortOrder,
                ...(searchTerm && { search: searchTerm }),
                ...(selectedCategory && { category: selectedCategory }),
            })

            const response = await axios.get(`/api/products?${params}`)
            return response.data;
        }
    })


    // const { data: categories } = useQuery("categories", async () => {
    //     const response = await axios.get("/api/categories")
    //     return response.data
    // })


    const { data: categories = [], } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const response = await axios.get("/api/categories");
            return response.data;
        }
    });


    useEffect(() => {
        const params = new URLSearchParams()
        if (searchTerm) params.set("search", searchTerm)
        if (selectedCategory) params.set("category", selectedCategory)
        setSearchParams(params)
    }, [searchTerm, selectedCategory, setSearchParams])

    const handleSearch = (e) => {
        e.preventDefault()
        setCurrentPage(1)
    }

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId)
        setCurrentPage(1)
    }

    const handleSortChange = (newSortBy) => {
        if (sortBy === newSortBy) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
        } else {
            setSortBy(newSortBy)
            setSortOrder("asc")
        }
        setCurrentPage(1)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
                    <p className="text-gray-600">Discover fresh groceries and daily essentials</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow mb-6 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                            <form onSubmit={handleSearch} className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                />
                            </form>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => handleCategoryChange(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                >
                                    <option value="">All Categories</option>
                                    {/* {categories?.map((category) => (
                                        <option key={category._id} value={category._id}>
                                            {category.name}
                                        </option>
                                    ))} */}

                                    {categories.map((category) => (
                                        <option key={category._id} value={category._id}>
                                            {category.name}
                                        </option>
                                    ))}

                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                            <select
                                value={`${sortBy}-${sortOrder}`}
                                onChange={(e) => {
                                    const [newSortBy, newSortOrder] = e.target.value.split("-")
                                    setSortBy(newSortBy)
                                    setSortOrder(newSortOrder)
                                    setCurrentPage(1)
                                }}
                                className="py-2 px-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            >
                                <option value="createdAt-desc">Newest First</option>
                                <option value="createdAt-asc">Oldest First</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="name-asc">Name: A to Z</option>
                                <option value="name-desc">Name: Z to A</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">View</label>
                            <div className="flex border border-gray-300 rounded-md">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 ${viewMode === "grid" ? "bg-red-500 text-white" : "bg-white text-gray-700"}`}
                                >
                                    <Grid className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 ${viewMode === "list" ? "bg-red-500 text-white" : "bg-white text-gray-700"}`}
                                >
                                    <List className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-gray-200 rounded-lg h-48 mb-3"></div>
                                <div className="bg-gray-200 rounded h-4 mb-2"></div>
                                <div className="bg-gray-200 rounded h-4 mb-2"></div>
                                <div className="bg-gray-200 rounded h-8"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="mb-4 flex justify-between items-center">
                            <p className="text-gray-600">
                                Showing {productsData?.products?.length || 0} of {productsData?.total || 0} products
                            </p>
                        </div>

                        <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" : "space-y-4"}>
                            {productsData?.products?.map((product, index) => (
                                <ProductCard key={product._id} product={product} index={index} viewMode={viewMode} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {productsData?.totalPages > 1 && (
                            <div className="mt-8 flex justify-center">
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Previous
                                    </button>

                                    {Array.from({ length: productsData.totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === currentPage
                                                ? "z-10 bg-red-50 border-red-500 text-red-600"
                                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setCurrentPage(Math.min(productsData.totalPages, currentPage + 1))}
                                        disabled={currentPage === productsData.totalPages}
                                        className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </nav>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default Products