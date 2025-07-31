// import { useState, useEffect } from "react"
// import { useMutation, useQueryClient } from "@tanstack/react-query"
// import { X } from "lucide-react"
// import toast from "react-hot-toast"
// import axios from "axios"

// const ProductModal = ({ isOpen, onClose, product, categories }) => {
//     const [formData, setFormData] = useState({
//         name: "",
//         description: "",
//         category: "",
//         price: "",
//         originalPrice: "",
//         discount: 0,
//         weight: "",
//         stockQuantity: "",
//         inStock: true,
//         featured: false,
//         tags: "",
//         brand: "",
//         imagePreview: "",
//     })

//     const queryClient = useQueryClient()

//     useEffect(() => {
//         if (product) {
//             setFormData({
//                 name: product.name || "",
//                 description: product.description || "",
//                 category: product.category?._id || "",
//                 price: product.price || "",
//                 originalPrice: product.originalPrice || "",
//                 discount: product.discount || 0,
//                 weight: product.weight || "",
//                 stockQuantity: product.stockQuantity || "",
//                 inStock: product.inStock ?? true,
//                 featured: product.featured ?? false,
//                 tags: product.tags?.join(", ") || "",
//                 brand: product.brand || "",
//             })
//         } else {
//             setFormData({
//                 name: "",
//                 description: "",
//                 category: "",
//                 price: "",
//                 originalPrice: "",
//                 discount: 0,
//                 weight: "",
//                 stockQuantity: "",
//                 inStock: true,
//                 featured: false,
//                 tags: "",
//                 brand: "",
//             })
//         }
//     }, [product])

//     const createProductMutation = useMutation({
//         mutationFn: (productData) => axios.post("/api/products", productData),
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["products"] })
//             toast.success("Product created successfully")
//             onClose()
//         },
//         onError: (error) => {
//             toast.error(error.response?.data?.message || "Failed to create product")
//         },
//     })


//     const updateProductMutation = useMutation({
//         mutationFn: (productData) => axios.put(`/api/products/${product._id}`, productData),
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["products"] })
//             toast.success("Product updated successfully")
//             onClose()
//         },
//         onError: (error) => {
//             toast.error(error.response?.data?.message || "Failed to update product")
//         },
//     })


//     const handleSubmit = (e) => {
//         e.preventDefault()

//         const productData = {
//             ...formData,
//             price: Number(formData.price),
//             originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
//             discount: Number(formData.discount),
//             stockQuantity: Number(formData.stockQuantity),
//             tags: formData.tags
//                 .split(",")
//                 .map((tag) => tag.trim())
//                 .filter((tag) => tag),
//         }

//         if (product) {
//             updateProductMutation.mutate(productData)
//         } else {
//             createProductMutation.mutate(productData)
//         }
//     }

//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target
//         setFormData((prev) => ({
//             ...prev,
//             [name]: type === "checkbox" ? checked : value,
//         }))
//     }

//     if (!isOpen) return null

//     return (
//         <div className="fixed inset-0 z-50 overflow-y-auto">
//             <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//                 <div className="fixed inset-0 bg-opacity-75 transition-opacity" onClick={onClose}></div>

//                 <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
//                     <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//                         <div className="flex items-center justify-between mb-4">
//                             <h3 className="text-lg font-medium text-gray-900">{product ? "Edit Product" : "Add New Product"}</h3>
//                             <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
//                                 <X className="w-6 h-6" />
//                             </button>
//                         </div>

//                         <form onSubmit={handleSubmit} className="space-y-4">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Name</label>
//                                 <input
//                                     type="text"
//                                     name="name"
//                                     value={formData.name}
//                                     onChange={handleChange}
//                                     required
//                                     className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Description</label>
//                                 <textarea
//                                     name="description"
//                                     value={formData.description}
//                                     onChange={handleChange}
//                                     required
//                                     rows={3}
//                                     className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Category</label>
//                                 <select
//                                     name="category"
//                                     value={formData.category}
//                                     onChange={handleChange}
//                                     required
//                                     className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
//                                 >
//                                     <option value="">Select Category</option>
//                                     {categories?.map((category) => (
//                                         <option key={category._id} value={category._id}>
//                                             {category.name}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>

//                             <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700">Price</label>
//                                     <input
//                                         type="number"
//                                         name="price"
//                                         value={formData.price}
//                                         onChange={handleChange}
//                                         required
//                                         min="0"
//                                         step="0.01"
//                                         className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700">Original Price</label>
//                                     <input
//                                         type="number"
//                                         name="originalPrice"
//                                         value={formData.originalPrice}
//                                         onChange={handleChange}
//                                         min="0"
//                                         step="0.01"
//                                         className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
//                                     />
//                                 </div>
//                             </div>

//                             <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700">Weight</label>
//                                     <input
//                                         type="text"
//                                         name="weight"
//                                         value={formData.weight}
//                                         onChange={handleChange}
//                                         required
//                                         placeholder="e.g., 500g, 1L"
//                                         className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
//                                     <input
//                                         type="number"
//                                         name="stockQuantity"
//                                         value={formData.stockQuantity}
//                                         onChange={handleChange}
//                                         required
//                                         min="0"
//                                         className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
//                                     />
//                                 </div>
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Brand</label>
//                                 <input
//                                     type="text"
//                                     name="brand"
//                                     value={formData.brand}
//                                     onChange={handleChange}
//                                     className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
//                                 <input
//                                     type="text"
//                                     name="tags"
//                                     value={formData.tags}
//                                     onChange={handleChange}
//                                     placeholder="e.g., organic, fresh, healthy"
//                                     className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
//                                 />
//                             </div>

//                             <div className="flex items-center space-x-4">
//                                 <label className="flex items-center">
//                                     <input
//                                         type="checkbox"
//                                         name="inStock"
//                                         checked={formData.inStock}
//                                         onChange={handleChange}
//                                         className="rounded border-gray-300 text-red-600 focus:ring-red-500"
//                                     />
//                                     <span className="ml-2 text-sm text-gray-700">In Stock</span>
//                                 </label>
//                                 <label className="flex items-center">
//                                     <input
//                                         type="checkbox"
//                                         name="featured"
//                                         checked={formData.featured}
//                                         onChange={handleChange}
//                                         className="rounded border-gray-300 text-red-600 focus:ring-red-500"
//                                     />
//                                     <span className="ml-2 text-sm text-gray-700">Featured</span>
//                                 </label>
//                             </div>

//                             <div className="flex justify-end space-x-3 pt-4">
//                                 <button
//                                     type="button"
//                                     onClick={onClose}
//                                     className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     disabled={createProductMutation.isLoading || updateProductMutation.isLoading}
//                                     className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
//                                 >
//                                     {createProductMutation.isLoading || updateProductMutation.isLoading
//                                         ? "Saving..."
//                                         : product
//                                             ? "Update Product"
//                                             : "Create Product"}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default ProductModal


// import { useState, useEffect } from "react"
// import { useMutation, useQueryClient } from "@tanstack/react-query"
// import { X } from "lucide-react"
// import toast from "react-hot-toast"
// import axios from "axios"

// const ProductModal = ({ isOpen, onClose, product, categories }) => {
//     const [formData, setFormData] = useState({
//         name: "",
//         description: "",
//         category: "",
//         price: "",
//         originalPrice: "",
//         discount: 0,
//         weight: "",
//         stockQuantity: "",
//         inStock: true,
//         featured: false,
//         tags: "",
//         brand: "",
//         images: [],
//         imagePreview: []
//     })

//     const queryClient = useQueryClient()

//     useEffect(() => {
//         if (product) {
//             setFormData({
//                 name: product.name || "",
//                 description: product.description || "",
//                 category: product.category?._id || "",
//                 price: product.price || "",
//                 originalPrice: product.originalPrice || "",
//                 discount: product.discount || 0,
//                 weight: product.weight || "",
//                 stockQuantity: product.stockQuantity || "",
//                 inStock: product.inStock ?? true,
//                 featured: product.featured ?? false,
//                 tags: product.tags?.join(", ") || "",
//                 brand: product.brand || "",
//                 images: product.images || [],
//                 imagePreview: Array.isArray(product.images)
//                     ? product.images
//                     : product.images
//                         ? [product.images]
//                         : []
//             })
//         } else {
//             setFormData({
//                 name: "",
//                 description: "",
//                 category: "",
//                 price: "",
//                 originalPrice: "",
//                 discount: 0,
//                 weight: "",
//                 stockQuantity: "",
//                 inStock: true,
//                 featured: false,
//                 tags: "",
//                 brand: "",
//                 images: [],
//                 imagePreview: []
//             })
//         }
//     }, [product])

//     const createProductMutation = useMutation({
//         mutationFn: (productData) => axios.post("/api/products", productData),
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["products"] })
//             toast.success("Product created successfully")
//             onClose()
//         },
//         onError: (error) => {
//             toast.error(error.response?.data?.message || "Failed to create product")
//         },
//     })

//     const updateProductMutation = useMutation({
//         mutationFn: (productData) => axios.put(`/api/products/${product._id}`, productData),
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["products"] })
//             toast.success("Product updated successfully")
//             onClose()
//         },
//         onError: (error) => {
//             toast.error(error.response?.data?.message || "Failed to update product")
//         },
//     })

//     const handleSubmit = (e) => {
//         e.preventDefault()

//         const productData = {
//             ...formData,
//             price: Number(formData.price),
//             originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
//             discount: Number(formData.discount),
//             stockQuantity: Number(formData.stockQuantity),
//             tags: formData.tags
//                 .split(",")
//                 .map((tag) => tag.trim())
//                 .filter((tag) => tag),
//             images: formData.imagePreview // Only send URLs or base64 strings
//         }

//         if (product) {
//             updateProductMutation.mutate(productData)
//         } else {
//             createProductMutation.mutate(productData)
//         }
//     }

//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target
//         setFormData((prev) => ({
//             ...prev,
//             [name]: type === "checkbox" ? checked : value,
//         }))
//     }

//     const handleImageChange = (e) => {
//         const files = Array.from(e.target.files)
//         const previews = files.map((file) => URL.createObjectURL(file))
//         setFormData((prev) => ({
//             ...prev,
//             images: files,
//             imagePreview: previews,
//         }))
//     }

//     if (!isOpen) return null

//     return (
//         <div className="fixed inset-0 z-50 overflow-y-auto">
//             <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//                 <div className="fixed inset-0  bg-opacity-50 transition-opacity"></div>

//                 <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full z-50">
//                     <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//                         <div className="flex items-center justify-between mb-4">
//                             <h3 className="text-lg font-medium text-gray-900">{product ? "Edit Product" : "Add New Product"}</h3>
//                             <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
//                                 <X className="w-6 h-6" />
//                             </button>
//                         </div>


//                         <form onSubmit={handleSubmit} className="space-y-4">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Name</label>
//                                 <input
//                                     type="text"
//                                     name="name"
//                                     value={formData.name}
//                                     onChange={handleChange}
//                                     className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
//                                     required
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Description</label>
//                                 <textarea
//                                     name="description"
//                                     value={formData.description}
//                                     onChange={handleChange}
//                                     className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
//                                     required
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Category</label>
//                                 <select
//                                     name="category"
//                                     value={formData.category}
//                                     onChange={handleChange}
//                                     className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
//                                     required
//                                 >
//                                     <option value="">Select Category</option>
//                                     {categories?.map((cat) => (
//                                         <option key={cat._id} value={cat._id}>{cat.name}</option>
//                                     ))}
//                                 </select>
//                             </div>

//                             <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700">Price</label>
//                                     <input
//                                         type="number"
//                                         name="price"
//                                         value={formData.price}
//                                         onChange={handleChange}
//                                         className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
//                                         required
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700">Original Price</label>
//                                     <input
//                                         type="number"
//                                         name="originalPrice"
//                                         value={formData.originalPrice}
//                                         onChange={handleChange}
//                                         className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
//                                     />
//                                 </div>
//                             </div>

//                             <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
//                                     <input
//                                         type="number"
//                                         name="discount"
//                                         value={formData.discount}
//                                         onChange={handleChange}
//                                         className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
//                                     <input
//                                         type="number"
//                                         name="stockQuantity"
//                                         value={formData.stockQuantity}
//                                         onChange={handleChange}
//                                         className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
//                                     />
//                                 </div>
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Brand</label>
//                                 <input
//                                     type="text"
//                                     name="brand"
//                                     value={formData.brand}
//                                     onChange={handleChange}
//                                     className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
//                                 <input
//                                     type="text"
//                                     name="tags"
//                                     value={formData.tags}
//                                     onChange={handleChange}
//                                     className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
//                                 />
//                             </div>

//                             <div className="flex space-x-4">
//                                 <label className="flex items-center space-x-2">
//                                     <input
//                                         type="checkbox"
//                                         name="inStock"
//                                         checked={formData.inStock}
//                                         onChange={handleChange}
//                                     />
//                                     <span className="text-sm">In Stock</span>
//                                 </label>
//                                 <label className="flex items-center space-x-2">
//                                     <input
//                                         type="checkbox"
//                                         name="featured"
//                                         checked={formData.featured}
//                                         onChange={handleChange}
//                                     />
//                                     <span className="text-sm">Featured</span>
//                                 </label>
//                             </div>

//                             {/* Image Upload (already present) */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Product Image(s)</label>
//                                 <input
//                                     type="file"
//                                     accept="image/*"
//                                     multiple
//                                     onChange={handleImageChange}
//                                     className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
//                                 />
//                                 <div className="flex flex-wrap mt-2 gap-2">
//                                     {formData.imagePreview?.map((img, idx) => (
//                                         <img
//                                             key={idx}
//                                             src={img}
//                                             alt={`Preview ${idx}`}
//                                             className="w-16 h-16 object-cover rounded border"
//                                         />
//                                     ))}
//                                 </div>
//                             </div>

//                             {/* Buttons (already present) */}
//                             <div className="flex justify-end space-x-3 pt-4">
//                                 <button
//                                     type="button"
//                                     onClick={onClose}
//                                     className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     disabled={createProductMutation.isLoading || updateProductMutation.isLoading}
//                                     className="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
//                                 >
//                                     {createProductMutation.isLoading || updateProductMutation.isLoading
//                                         ? "Saving..."
//                                         : product
//                                             ? "Update Product"
//                                             : "Create Product"}
//                                 </button>
//                             </div>
//                         </form>

//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default ProductModal


// import { useState, useEffect } from "react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { X } from "lucide-react";
// import toast from "react-hot-toast";
// import axios from "axios";

// const ProductModal = ({ isOpen, onClose, product, categories }) => {
//     const [formData, setFormData] = useState({
//         name: "",
//         description: "",
//         category: "",
//         price: "",
//         originalPrice: "",
//         discount: 0,
//         weight: "",
//         stockQuantity: "",
//         inStock: true,
//         featured: false,
//         tags: "",
//         brand: "",
//         images: [],
//         imagePreview: [],
//     });

//     const queryClient = useQueryClient();

//     useEffect(() => {
//         if (product) {
//             setFormData({
//                 name: product.name || "",
//                 description: product.description || "",
//                 category: product.category?._id || "",
//                 price: product.price || "",
//                 originalPrice: product.originalPrice || "",
//                 discount: product.discount || 0,
//                 weight: product.weight || "",
//                 stockQuantity: product.stockQuantity || "",
//                 inStock: product.inStock ?? true,
//                 featured: product.featured ?? false,
//                 tags: product.tags?.join(", ") || "",
//                 brand: product.brand || "",
//                 images: product.images || [],
//                 imagePreview: Array.isArray(product.images)
//                     ? product.images
//                     : product.images
//                         ? [product.images]
//                         : [],
//             });
//         } else {
//             setFormData({
//                 name: "",
//                 description: "",
//                 category: "",
//                 price: "",
//                 originalPrice: "",
//                 discount: 0,
//                 weight: "",
//                 stockQuantity: "",
//                 inStock: true,
//                 featured: false,
//                 tags: "",
//                 brand: "",
//                 images: [],
//                 imagePreview: [],
//             });
//         }
//     }, [product]);

//     const createProductMutation = useMutation({
//         mutationFn: (productData) => axios.post("/api/products", productData),
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["products"] });
//             toast.success("Product created successfully");
//             onClose();
//         },
//         onError: (error) => {
//             toast.error(error.response?.data?.message || "Failed to create product");
//         },
//     });

//     const updateProductMutation = useMutation({
//         mutationFn: (productData) =>
//             axios.put(`/api/products/${product._id}`, productData),
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["products"] });
//             toast.success("Product updated successfully");
//             onClose();
//         },
//         onError: (error) => {
//             toast.error(error.response?.data?.message || "Failed to update product");
//         },
//     });

//     const handleSubmit = (e) => {
//         e.preventDefault();

//         const productData = {
//             ...formData,
//             price: Number(formData.price),
//             originalPrice: formData.originalPrice
//                 ? Number(formData.originalPrice)
//                 : undefined,
//             discount: Number(formData.discount),
//             stockQuantity: Number(formData.stockQuantity),
//             tags: formData.tags
//                 .split(",")
//                 .map((tag) => tag.trim())
//                 .filter((tag) => tag),
//             images: formData.imagePreview,
//         };

//         if (product) {
//             updateProductMutation.mutate(productData);
//         } else {
//             createProductMutation.mutate(productData);
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setFormData((prev) => ({
//             ...prev,
//             [name]: type === "checkbox" ? checked : value,
//         }));
//     };

//     const handleImageChange = (e) => {
//         const files = Array.from(e.target.files);
//         const previews = files.map((file) => URL.createObjectURL(file));
//         setFormData((prev) => ({
//             ...prev,
//             images: files,
//             imagePreview: previews,
//         }));
//     };

//     if (!isOpen) return null;

//     return (
//         <div
//             className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
//             onClick={onClose}
//         >
//             <div
//                 className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 z-50 relative"
//                 onClick={(e) => e.stopPropagation()}
//             >
//                 <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-lg font-semibold text-gray-900">
//                         {product ? "Edit Product" : "Add New Product"}
//                     </h3>
//                     <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//                         <X className="w-6 h-6" />
//                     </button>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     {/* Name */}
//                     <div>
//                         <label htmlFor="name" className="block text-sm font-medium">
//                             Product Name
//                         </label>
//                         <input
//                             id="name"
//                             name="name"
//                             autoComplete="off"
//                             value={formData.name}
//                             onChange={handleChange}
//                             required
//                             className="mt-1 block w-full border rounded px-3 py-2"
//                         />
//                     </div>

//                     {/* Description */}
//                     <div>
//                         <label htmlFor="description" className="block text-sm font-medium">
//                             Description
//                         </label>
//                         <textarea
//                             id="description"
//                             name="description"
//                             value={formData.description}
//                             onChange={handleChange}
//                             required
//                             className="mt-1 block w-full border rounded px-3 py-2"
//                         />
//                     </div>

//                     {/* Category */}
//                     <div>
//                         <label htmlFor="category" className="block text-sm font-medium">
//                             Category
//                         </label>
//                         <select
//                             id="category"
//                             name="category"
//                             value={formData.category}
//                             onChange={handleChange}
//                             required
//                             className="mt-1 block w-full border rounded px-3 py-2"
//                         >
//                             <option value="">Select category</option>
//                             {categories?.map((cat) => (
//                                 <option key={cat._id} value={cat._id}>
//                                     {cat.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     {/* Price and Original Price */}
//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                             <label htmlFor="price" className="block text-sm font-medium">
//                                 Price
//                             </label>
//                             <input
//                                 id="price"
//                                 name="price"
//                                 type="number"
//                                 value={formData.price}
//                                 onChange={handleChange}
//                                 required
//                                 className="mt-1 block w-full border rounded px-3 py-2"
//                             />
//                         </div>
//                         <div>
//                             <label htmlFor="originalPrice" className="block text-sm font-medium">
//                                 Original Price
//                             </label>
//                             <input
//                                 id="originalPrice"
//                                 name="originalPrice"
//                                 type="number"
//                                 value={formData.originalPrice}
//                                 onChange={handleChange}
//                                 className="mt-1 block w-full border rounded px-3 py-2"
//                             />
//                         </div>
//                     </div>

//                     {/* Image Upload */}
//                     <div>
//                         <label htmlFor="images" className="block text-sm font-medium">
//                             Product Images
//                         </label>
//                         <input
//                             id="images"
//                             type="file"
//                             multiple
//                             accept="image/*"
//                             onChange={handleImageChange}
//                             className="mt-1 block w-full border rounded px-3 py-2"
//                         />
//                         <div className="flex flex-wrap mt-2 gap-2">
//                             {formData.imagePreview?.map((img, idx) => (
//                                 <img
//                                     key={idx}
//                                     src={img}
//                                     alt={`Preview ${idx}`}
//                                     className="w-16 h-16 object-cover rounded border"
//                                 />
//                             ))}
//                         </div>
//                     </div>

//                     {/* Submit & Cancel */}
//                     <div className="flex justify-end space-x-2 pt-4">
//                         <button
//                             type="button"
//                             onClick={onClose}
//                             className="px-4 py-2 border border-gray-300 rounded text-sm"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             disabled={createProductMutation.isLoading || updateProductMutation.isLoading}
//                             className="px-4 py-2 bg-red-600 text-white rounded text-sm disabled:opacity-50"
//                         >
//                             {createProductMutation.isLoading || updateProductMutation.isLoading
//                                 ? "Saving..."
//                                 : product
//                                     ? "Update Product"
//                                     : "Create Product"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default ProductModal;

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";

const ProductModal = ({ onClose, categories }) => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        price: "",
        originalPrice: "",
        discount: "",
        weight: "",
        stockQuantity: "",
        inStock: true,
        featured: false,
        tags: "",
        brand: "",
        images: "", // comma-separated URLs
    });

    const mutation = useMutation({
        mutationFn: async (newProduct) => {
            const response = await fetch("http://localhost:5006/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // <-- make sure token is stored

                },
                body: JSON.stringify(newProduct),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to add product");
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["products"]);
            onClose();
        },
        onError: (err) => {
            alert("Error: " + err.message);
        },
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const {
            name,
            description,
            category,
            price,
            originalPrice,
            discount,
            weight,
            stockQuantity,
            inStock,
            featured,
            tags,
            brand,
            images,
        } = formData;

        const productData = {
            name,
            description,
            category,
            price: parseFloat(price),
            originalPrice: parseFloat(originalPrice),
            discount: parseFloat(discount),
            weight,
            stockQuantity: parseInt(stockQuantity),
            inStock,
            featured,
            tags: tags.split(",").map((tag) => tag.trim()),
            brand,
            images: images.split(",").map((url) => url.trim()),
        };

        mutation.mutate(productData);
    };

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
            onClick={onClose}>

            <div className="bg-white rounded-xl p-6 max-w-2xl w-full relative overflow-y-auto max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
                >
                    <X size={20} />
                </button>
                <h2 className="text-xl font-bold mb-4">Add New Product</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block font-medium">Name</label>
                        <input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block font-medium">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label htmlFor="category" className="block font-medium">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full border rounded px-3 py-2"
                        >
                            <option value="">Select category</option>
                            {categories?.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Price */}
                    <div>
                        <label htmlFor="price" className="block font-medium">Price</label>
                        <input
                            id="price"
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    {/* Original Price */}
                    <div>
                        <label htmlFor="originalPrice" className="block font-medium">Original Price</label>
                        <input
                            id="originalPrice"
                            name="originalPrice"
                            type="number"
                            value={formData.originalPrice}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    {/* Discount */}
                    <div>
                        <label htmlFor="discount" className="block font-medium">Discount (%)</label>
                        <input
                            id="discount"
                            name="discount"
                            type="number"
                            value={formData.discount}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    {/* Weight */}
                    <div>
                        <label htmlFor="weight" className="block font-medium">Weight</label>
                        <input
                            id="weight"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            required
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    {/* Stock Quantity */}
                    <div>
                        <label htmlFor="stockQuantity" className="block font-medium">Stock Quantity</label>
                        <input
                            id="stockQuantity"
                            name="stockQuantity"
                            type="number"
                            value={formData.stockQuantity}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    {/* Brand */}
                    <div>
                        <label htmlFor="brand" className="block font-medium">Brand</label>
                        <input
                            id="brand"
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label htmlFor="tags" className="block font-medium">Tags (comma-separated)</label>
                        <input
                            id="tags"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    {/* Images */}
                    <div>
                        <label htmlFor="images" className="block font-medium">Image URLs (comma-separated)</label>
                        <textarea
                            id="images"
                            name="images"
                            value={formData.images}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    {/* Checkboxes */}
                    <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="inStock"
                                checked={formData.inStock}
                                onChange={handleChange}
                            />
                            <span>In Stock</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="featured"
                                checked={formData.featured}
                                onChange={handleChange}
                            />
                            <span>Featured</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={mutation.isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded"
                    >
                        {mutation.isLoading ? "Adding..." : "Add Product"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;






// import { useState, useEffect } from "react"
// import { useMutation, useQueryClient } from "@tanstack/react-query"
// import { X } from "lucide-react"
// import toast from "react-hot-toast"
// import axios from "axios"

// const ProductModal = ({ isOpen, onClose, product, categories }) => {
//     const [formData, setFormData] = useState({
//         name: "",
//         description: "",
//         category: "",
//         price: "",
//         originalPrice: "",
//         discount: 0,
//         weight: "",
//         stockQuantity: "",
//         inStock: true,
//         featured: false,
//         tags: "",
//         brand: "",
//         images: [],
//         imagePreview: []
//     })

//     const queryClient = useQueryClient()

//     useEffect(() => {
//         if (product) {
//             setFormData({
//                 name: product.name || "",
//                 description: product.description || "",
//                 category: product.category?._id || "",
//                 price: product.price || "",
//                 originalPrice: product.originalPrice || "",
//                 discount: product.discount || 0,
//                 weight: product.weight || "",
//                 stockQuantity: product.stockQuantity || "",
//                 inStock: product.inStock ?? true,
//                 featured: product.featured ?? false,
//                 tags: product.tags?.join(", ") || "",
//                 brand: product.brand || "",
//                 images: product.images || [],
//                 imagePreview: Array.isArray(product.images)
//                     ? product.images
//                     : product.images
//                         ? [product.images]
//                         : []
//             })
//         } else {
//             setFormData({
//                 name: "",
//                 description: "",
//                 category: "",
//                 price: "",
//                 originalPrice: "",
//                 discount: 0,
//                 weight: "",
//                 stockQuantity: "",
//                 inStock: true,
//                 featured: false,
//                 tags: "",
//                 brand: "",
//                 images: [],
//                 imagePreview: []
//             })
//         }
//     }, [product])

//     const createProductMutation = useMutation({
//         mutationFn: (productData) => axios.post("/api/products", productData),
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["products"] })
//             toast.success("Product created successfully")
//             onClose()
//         },
//         onError: (error) => {
//             toast.error(error.response?.data?.message || "Failed to create product")
//         },
//     })

//     const updateProductMutation = useMutation({
//         mutationFn: (productData) => axios.put(`/api/products/${product._id}`, productData),
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["products"] })
//             toast.success("Product updated successfully")
//             onClose()
//         },
//         onError: (error) => {
//             toast.error(error.response?.data?.message || "Failed to update product")
//         },
//     })

//     const handleSubmit = (e) => {
//         e.preventDefault()

//         const productData = {
//             ...formData,
//             price: Number(formData.price),
//             originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
//             discount: Number(formData.discount),
//             stockQuantity: Number(formData.stockQuantity),
//             tags: formData.tags
//                 .split(",")
//                 .map((tag) => tag.trim())
//                 .filter((tag) => tag),
//             images: formData.imagePreview
//         }

//         if (product) {
//             updateProductMutation.mutate(productData)
//         } else {
//             createProductMutation.mutate(productData)
//         }
//     }

//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target
//         setFormData((prev) => ({
//             ...prev,
//             [name]: type === "checkbox" ? checked : value,
//         }))
//     }

//     const handleImageChange = (e) => {
//         const files = Array.from(e.target.files)
//         const previews = files.map((file) => URL.createObjectURL(file))
//         setFormData((prev) => ({
//             ...prev,
//             images: files,
//             imagePreview: previews,
//         }))
//     }

//     if (!isOpen) return null

//     return (
//         <div className="fixed inset-0 z-50 overflow-y-auto">
//             <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//                 <div className="fixed inset-0 bg-opacity-50 transition-opacity" onClick={onClose}></div>

//                 <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full z-50">
//                     <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//                         <div className="flex items-center justify-between mb-4">
//                             <h3 className="text-lg font-medium text-gray-900">{product ? "Edit Product" : "Add New Product"}</h3>
//                             <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
//                                 <X className="w-6 h-6" />
//                             </button>
//                         </div>

//                         <form onSubmit={handleSubmit} className="space-y-4">
//                             <div>
//                                 <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
//                                 <input
//                                     id="name"
//                                     name="name"
//                                     type="text"
//                                     autoComplete="off"
//                                     value={formData.name}
//                                     onChange={handleChange}
//                                     className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
//                                     required
//                                 />
//                             </div>

//                             <div>
//                                 <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
//                                 <textarea
//                                     id="description"
//                                     name="description"
//                                     value={formData.description}
//                                     onChange={handleChange}
//                                     className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
//                                     required
//                                 />
//                             </div>

//                             <div>
//                                 <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
//                                 <select
//                                     id="category"
//                                     name="category"
//                                     value={formData.category}
//                                     onChange={handleChange}
//                                     className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
//                                     required
//                                 >
//                                     <option value="">Select Category</option>
//                                     {categories?.map((cat) => (
//                                         <option key={cat._id} value={cat._id}>{cat.name}</option>
//                                     ))}
//                                 </select>
//                             </div>

//                             <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (₹)</label>
//                                     <input
//                                         id="price"
//                                         name="price"
//                                         type="number"
//                                         value={formData.price}
//                                         onChange={handleChange}
//                                         className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
//                                         required
//                                     />
//                                 </div>
//                                 <div>
//                                     <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700">Original Price (₹)</label>
//                                     <input
//                                         id="originalPrice"
//                                         name="originalPrice"
//                                         type="number"
//                                         value={formData.originalPrice}
//                                         onChange={handleChange}
//                                         className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
//                                     />
//                                 </div>
//                             </div>

//                             <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <label htmlFor="discount" className="block text-sm font-medium text-gray-700">Discount (%)</label>
//                                     <input
//                                         id="discount"
//                                         name="discount"
//                                         type="number"
//                                         value={formData.discount}
//                                         onChange={handleChange}
//                                         className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700">Stock Quantity</label>
//                                     <input
//                                         id="stockQuantity"
//                                         name="stockQuantity"
//                                         type="number"
//                                         value={formData.stockQuantity}
//                                         onChange={handleChange}
//                                         className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
//                                     />
//                                 </div>
//                             </div>

//                             <div>
//                                 <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
//                                 <input
//                                     id="brand"
//                                     name="brand"
//                                     type="text"
//                                     value={formData.brand}
//                                     onChange={handleChange}
//                                     className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
//                                 />
//                             </div>

//                             <div>
//                                 <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
//                                 <input
//                                     id="tags"
//                                     name="tags"
//                                     type="text"
//                                     value={formData.tags}
//                                     onChange={handleChange}
//                                     className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
//                                 />
//                             </div>

//                             <div className="flex space-x-4">
//                                 <label className="flex items-center space-x-2">
//                                     <input
//                                         id="inStock"
//                                         name="inStock"
//                                         type="checkbox"
//                                         checked={formData.inStock}
//                                         onChange={handleChange}
//                                     />
//                                     <span className="text-sm">In Stock</span>
//                                 </label>
//                                 <label className="flex items-center space-x-2">
//                                     <input
//                                         id="featured"
//                                         name="featured"
//                                         type="checkbox"
//                                         checked={formData.featured}
//                                         onChange={handleChange}
//                                     />
//                                     <span className="text-sm">Featured</span>
//                                 </label>
//                             </div>

//                             <div>
//                                 <label htmlFor="images" className="block text-sm font-medium text-gray-700">Product Image(s)</label>
//                                 <input
//                                     id="images"
//                                     type="file"
//                                     accept="image/*"
//                                     multiple
//                                     onChange={handleImageChange}
//                                     className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
//                                 />
//                                 <div className="flex flex-wrap mt-2 gap-2">
//                                     {formData.imagePreview?.map((img, idx) => (
//                                         <img
//                                             key={idx}
//                                             src={img}
//                                             alt={`Preview ${idx}`}
//                                             className="w-16 h-16 object-cover rounded border"
//                                         />
//                                     ))}
//                                 </div>
//                             </div>

//                             <div className="flex justify-end space-x-3 pt-4">
//                                 <button
//                                     type="button"
//                                     onClick={onClose}
//                                     className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     disabled={createProductMutation.isLoading || updateProductMutation.isLoading}
//                                     className="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
//                                 >
//                                     {createProductMutation.isLoading || updateProductMutation.isLoading
//                                         ? "Saving..."
//                                         : product ? "Update Product" : "Create Product"}
//                                 </button>
//                             </div>
//                         </form>

//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default ProductModal