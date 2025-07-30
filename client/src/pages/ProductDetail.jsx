
// import { useState } from "react"
// import { useParams, Link } from "react-router-dom"
// import { useQuery } from "@tanstack/react-query"
// import { motion } from "framer-motion"
// import { ArrowLeft, Plus, Minus, Star, Heart } from "lucide-react"
// import axios from "axios"
// import { useCart } from "../contexts/CartContext"

// const ProductDetail = () => {
//     const { id } = useParams()
//     const [quantity, setQuantity] = useState(1)
//     const { addToCart } = useCart()

//     const { data: product, isLoading } = useQuery(
//         ["product", id],
//         async () => {
//             const response = await axios.get(`/api/products/${id}`)
//             return response.data
//         },
//         {
//             enabled: !!id,
//         },
//     )

//     const { data: relatedProducts } = useQuery(
//         ["related-products", product?.category?._id],
//         async () => {
//             if (!product?.category?._id) return []
//             const response = await axios.get(`/api/products?category=${product.category._id}&limit=4`)
//             return response.data.products.filter((p) => p._id !== product._id)
//         },
//         {
//             enabled: !!product?.category?._id,
//         },
//     )

//     const handleAddToCart = () => {
//         addToCart(product, quantity)
//     }

//     const handleQuantityChange = (change) => {
//         const newQuantity = quantity + change
//         if (newQuantity >= 1) {
//             setQuantity(newQuantity)
//         }
//     }

//     if (isLoading) {
//         return (
//             <div className="min-h-screen bg-gray-50">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                     <div className="animate-pulse">
//                         <div className="bg-gray-200 h-8 w-32 mb-6"></div>
//                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                             <div className="bg-gray-200 h-96 rounded-lg"></div>
//                             <div className="space-y-4">
//                                 <div className="bg-gray-200 h-8 w-3/4"></div>
//                                 <div className="bg-gray-200 h-4 w-1/2"></div>
//                                 <div className="bg-gray-200 h-6 w-1/4"></div>
//                                 <div className="bg-gray-200 h-20 w-full"></div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         )
//     }

//     if (!product) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
//                     <Link to="/products" className="text-red-500 hover:text-red-600">
//                         Back to Products
//                     </Link>
//                 </div>
//             </div>
//         )
//     }

//     return (
//         <div className="min-h-screen bg-gray-50">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                 {/* Breadcrumb */}
//                 <div className="flex items-center mb-6">
//                     <Link to="/products" className="flex items-center text-gray-600 hover:text-gray-900">
//                         <ArrowLeft className="w-5 h-5 mr-2" />
//                         Back to Products
//                     </Link>
//                 </div>

//                 <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
//                         {/* Product Image */}
//                         <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
//                             <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
//                                 <span className="text-gray-400">Product Image</span>
//                             </div>
//                             <div className="grid grid-cols-4 gap-2">
//                                 {[...Array(4)].map((_, i) => (
//                                     <div key={i} className="w-full h-20 bg-gray-100 rounded-lg"></div>
//                                 ))}
//                             </div>
//                         </motion.div>

//                         {/* Product Info */}
//                         <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
//                             <div>
//                                 <p className="text-sm text-gray-500 mb-2">{product.category?.name}</p>
//                                 <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
//                                 <p className="text-gray-600 mb-4">{product.description}</p>

//                                 <div className="flex items-center space-x-2 mb-4">
//                                     <div className="flex items-center">
//                                         {[...Array(5)].map((_, i) => (
//                                             <Star
//                                                 key={i}
//                                                 className={`w-5 h-5 ${i < Math.floor(product.ratings?.average || 0)
//                                                     ? "text-yellow-400 fill-current"
//                                                     : "text-gray-300"
//                                                     }`}
//                                             />
//                                         ))}
//                                     </div>
//                                     <span className="text-sm text-gray-500">({product.ratings?.count || 0} reviews)</span>
//                                 </div>
//                             </div>

//                             <div className="border-t border-b border-gray-200 py-4">
//                                 <div className="flex items-center space-x-4 mb-2">
//                                     {product.originalPrice && product.originalPrice > product.price && (
//                                         <span className="text-xl text-gray-400 line-through">${product.originalPrice}</span>
//                                     )}
//                                     <span className="text-3xl font-bold text-gray-900">${product.price}</span>
//                                     {product.discount > 0 && (
//                                         <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
//                                             {product.discount}% OFF
//                                         </span>
//                                     )}
//                                 </div>
//                                 <p className="text-sm text-gray-600">Weight: {product.weight}</p>
//                                 <p className="text-sm text-gray-600">Brand: {product.brand || "N/A"}</p>
//                             </div>

//                             <div className="space-y-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
//                                     <div className="flex items-center space-x-3">
//                                         <button
//                                             onClick={() => handleQuantityChange(-1)}
//                                             className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
//                                         >
//                                             <Minus className="w-4 h-4" />
//                                         </button>
//                                         <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
//                                         <button
//                                             onClick={() => handleQuantityChange(1)}
//                                             className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
//                                         >
//                                             <Plus className="w-4 h-4" />
//                                         </button>
//                                     </div>
//                                 </div>

//                                 <div className="flex space-x-4">
//                                     <button
//                                         onClick={handleAddToCart}
//                                         className="flex-1 bg-red-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-600 transition-colors"
//                                     >
//                                         Add to Cart - ${(product.price * quantity).toFixed(2)}
//                                     </button>
//                                     <button className="w-12 h-12 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50">
//                                         <Heart className="w-5 h-5" />
//                                     </button>
//                                 </div>

//                                 <div className="text-sm text-gray-600">
//                                     <p className="flex items-center">
//                                         <span
//                                             className={`w-2 h-2 rounded-full mr-2 ${product.inStock ? "bg-green-500" : "bg-red-500"}`}
//                                         ></span>
//                                         {product.inStock ? `In Stock (${product.stockQuantity} available)` : "Out of Stock"}
//                                     </p>
//                                 </div>
//                             </div>

//                             {/* Product Tags */}
//                             {product.tags && product.tags.length > 0 && (
//                                 <div>
//                                     <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
//                                     <div className="flex flex-wrap gap-2">
//                                         {product.tags.map((tag, index) => (
//                                             <span key={index} className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
//                                                 {tag}
//                                             </span>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}
//                         </motion.div>
//                     </div>
//                 </div>

//                 {/* Related Products */}
//                 {relatedProducts && relatedProducts.length > 0 && (
//                     <div className="mt-12">
//                         <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//                             {relatedProducts.map((relatedProduct, index) => (
//                                 <motion.div
//                                     key={relatedProduct._id}
//                                     initial={{ opacity: 0, y: 20 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     transition={{ delay: index * 0.1 }}
//                                     className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
//                                 >
//                                     <Link to={`/products/${relatedProduct._id}`} className="block p-4">
//                                         <div className="w-full h-32 bg-gray-200 rounded-lg mb-3"></div>
//                                         <h3 className="font-medium text-sm mb-1">{relatedProduct.name}</h3>
//                                         <p className="text-xs text-gray-500 mb-2">{relatedProduct.weight}</p>
//                                         <div className="flex items-center justify-between">
//                                             <span className="font-bold text-sm">${relatedProduct.price}</span>
//                                             <button
//                                                 onClick={(e) => {
//                                                     e.preventDefault()
//                                                     addToCart(relatedProduct)
//                                                 }}
//                                                 className="text-red-500 border border-red-500 hover:bg-red-50 px-3 py-1 rounded text-xs"
//                                             >
//                                                 ADD
//                                             </button>
//                                         </div>
//                                     </Link>
//                                 </motion.div>
//                             ))}
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     )
// }

// export default ProductDetail



import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { ArrowLeft, Plus, Minus, Star, Heart } from "lucide-react"
import axios from "axios"
import { useCart } from "../contexts/CartContext"

const ProductDetail = () => {
    const { id } = useParams()
    const [quantity, setQuantity] = useState(1)
    const { addToCart } = useCart()

    const { data: product, isLoading } = useQuery({
        queryKey: ["product", id],
        queryFn: async () => {
            const response = await axios.get(`/api/products/${id}`)
            return response.data
        },
        enabled: !!id,
    })

    const { data: relatedProducts } = useQuery({
        queryKey: ["related-products", product?.category?._id],
        queryFn: async () => {
            const response = await axios.get(`/api/products?category=${product.category._id}&limit=4`)
            return response.data.products.filter((p) => p._id !== product._id)
        },
        enabled: !!product?.category?._id,
    })

    const handleAddToCart = () => {
        addToCart(product, quantity)
    }

    const handleQuantityChange = (change) => {
        const newQuantity = quantity + change
        if (newQuantity >= 1) {
            setQuantity(newQuantity)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="animate-pulse">
                        <div className="bg-gray-200 h-8 w-32 mb-6"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-gray-200 h-96 rounded-lg"></div>
                            <div className="space-y-4">
                                <div className="bg-gray-200 h-8 w-3/4"></div>
                                <div className="bg-gray-200 h-4 w-1/2"></div>
                                <div className="bg-gray-200 h-6 w-1/4"></div>
                                <div className="bg-gray-200 h-20 w-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
                    <Link to="/products" className="text-red-500 hover:text-red-600">
                        Back to Products
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center mb-6">
                    <Link to="/products" className="flex items-center text-gray-600 hover:text-gray-900">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Products
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                        {/* Product Image */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                            {/* <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-gray-400">Product Image</span>
                            </div> */}
                            <img
                                src={product.images || "/images/products/default.png"}
                                alt={product.name}
                                className="w-full h-96 object-contain bg-gray-100 rounded-lg"
                            />

                            {/* <div className="grid grid-cols-4 gap-2">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="w-full h-20 bg-gray-100 rounded-lg"></div>
                                ))}
                            </div> */}

                            <div className="grid grid-cols-4 gap-2">
                                {product.images && product.images.length > 0 ? (
                                    product.images.map((img, i) => (
                                        <img
                                            key={i}
                                            src={img}
                                            alt={`Thumbnail ${i + 1}`}
                                            className="w-full h-20 object-cover rounded-lg bg-gray-100"
                                        />
                                    ))
                                ) : (
                                    [...Array(4)].map((_, i) => (
                                        <div key={i} className="w-full h-20 bg-gray-100 rounded-lg" />
                                    ))
                                )}
                            </div>

                        </motion.div>

                        {/* Product Info */}
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                            <div>
                                <p className="text-sm text-gray-500 mb-2">{product.category?.name}</p>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                                <p className="text-gray-600 mb-4">{product.description}</p>

                                <div className="flex items-center space-x-2 mb-4">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-5 h-5 ${i < Math.floor(product.ratings?.average || 0)
                                                    ? "text-yellow-400 fill-current"
                                                    : "text-gray-300"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-500">({product.ratings?.count || 0} reviews)</span>
                                </div>
                            </div>

                            <div className="border-t border-b border-gray-200 py-4">
                                <div className="flex items-center space-x-4 mb-2">
                                    {product.originalPrice && product.originalPrice > product.price && (
                                        <span className="text-xl text-gray-400 line-through">₹{product.originalPrice}</span>
                                    )}
                                    <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
                                    {product.discount > 0 && (
                                        <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                                            {product.discount}% OFF
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600">Weight: {product.weight}</p>
                                <p className="text-sm text-gray-600">Brand: {product.brand || "N/A"}</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => handleQuantityChange(-1)}
                                            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(1)}
                                            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex space-x-4">
                                    <button
                                        onClick={handleAddToCart}
                                        className="flex-1 bg-red-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-600 transition-colors"
                                    >
                                        Add to Cart - ₹{(product.price * quantity).toFixed(2)}
                                    </button>
                                    <button className="w-12 h-12 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50">
                                        <Heart className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="text-sm text-gray-600">
                                    <p className="flex items-center">
                                        <span
                                            className={`w-2 h-2 rounded-full mr-2 ${product.inStock ? "bg-green-500" : "bg-red-500"}`}
                                        ></span>
                                        {product.inStock ? `In Stock (${product.stockQuantity} available)` : "Out of Stock"}
                                    </p>
                                </div>
                            </div>

                            {/* Product Tags */}
                            {product.tags && product.tags.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {product.tags.map((tag, index) => (
                                            <span key={index} className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts && relatedProducts.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {relatedProducts.map((relatedProduct, index) => (
                                <motion.div
                                    key={relatedProduct._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                                >
                                    <Link to={`/products/${relatedProduct._id}`} className="block p-4">
                                        {/* <div className="w-full h-32 bg-gray-200 rounded-lg mb-3"></div> */}
                                        <img
                                            src={relatedProduct.images || "/images/products/default.png"}
                                            alt={relatedProduct.name}
                                            className="w-full h-32 object-contain bg-gray-100 rounded-lg mb-3"
                                            onError={(e) => {
                                                e.target.onerror = null
                                                e.target.src = "/images/products/default.png"
                                            }}
                                        />

                                        <h3 className="font-medium text-sm mb-1">{relatedProduct.name}</h3>
                                        <p className="text-xs text-gray-500 mb-2">{relatedProduct.weight}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-sm">₹{relatedProduct.price}</span>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    addToCart(relatedProduct)
                                                }}
                                                className="text-red-500 border border-red-500 hover:bg-red-50 px-3 py-1 rounded text-xs"
                                            >
                                                ADD
                                            </button>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProductDetail

