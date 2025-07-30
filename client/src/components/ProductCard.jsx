// import { motion } from "framer-motion"
// import { Link } from "react-router-dom"
// import { useCart } from "../contexts/CartContext"

// const ProductCard = ({ product, index, viewMode = "grid" }) => {
//     const { addToCart } = useCart()

//     const handleAddToCart = (e) => {
//         e.preventDefault()
//         e.stopPropagation()
//         addToCart(product)
//     }

//     if (viewMode === "list") {
//         return (
//             <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.05 }}
//                 className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
//             >
//                 <Link to={`/products/${product._id}`} className="flex p-4">
//                     <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
//                     <div className="ml-4 flex-1">
//                         <div className="flex justify-between items-start">
//                             <div>
//                                 <p className="text-xs text-gray-500 mb-1">{product.category?.name}</p>
//                                 <h3 className="font-medium text-lg mb-1">{product.name}</h3>
//                                 <p className="text-sm text-gray-500 mb-2">{product.weight}</p>
//                                 <div className="flex items-center space-x-2">
//                                     {product.originalPrice && product.originalPrice > product.price && (
//                                         <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
//                                     )}
//                                     <span className="font-bold text-lg">${product.price}</span>
//                                     {product.discount > 0 && (
//                                         <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">{product.discount}% OFF</span>
//                                     )}
//                                 </div>
//                             </div>
//                             <button
//                                 onClick={handleAddToCart}
//                                 className="px-4 py-2 text-red-500 border border-red-500 rounded-md hover:bg-red-50 transition-colors"
//                             >
//                                 ADD
//                             </button>
//                         </div>
//                     </div>
//                 </Link>
//             </motion.div>
//         )
//     }

//     return (
//         <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.05 }}
//             className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
//         >
//             <Link to={`/products/${product._id}`} className="block p-4">
//                 {product.discount > 0 && (
//                     <div className="bg-red-500 text-white text-xs px-2 py-1 rounded mb-2 inline-block">
//                         {product.discount}% OFF
//                     </div>
//                 )}
//                 <div className="w-full h-32 rounded-lg mb-3">
//                     <img
//                         src={product.image || "/images/default.png"}
//                         alt={product.name}
//                         className="w-full h-32 object-contain rounded-lg mb-3"
//                     />

//                 </div>
//                 <p className="text-xs text-gray-500 mb-1">{product.category?.name}</p>
//                 <h3 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h3>
//                 <p className="text-xs text-gray-500 mb-2">{product.weight}</p>
//                 <div className="flex items-center justify-between mb-3">
//                     <div className="flex items-center space-x-1">
//                         {product.originalPrice && product.originalPrice > product.price && (
//                             <span className="text-xs text-gray-400 line-through">${product.originalPrice}</span>
//                         )}
//                         <span className="font-bold text-sm">${product.price}</span>
//                     </div>
//                 </div>
//                 <button
//                     onClick={handleAddToCart}
//                     className="w-full text-red-500 border border-red-500 hover:bg-red-50 bg-transparent py-2 px-4 rounded-md text-sm font-medium transition-colors"
//                 >
//                     ADD
//                 </button>
//             </Link>
//         </motion.div>
//     )
// }

// export default ProductCard

import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { useCart } from "../contexts/CartContext"

const ProductCard = ({ product, index, viewMode = "grid" }) => {
    const { addToCart } = useCart()

    const handleAddToCart = (e) => {
        e.preventDefault()
        e.stopPropagation()
        addToCart(product)
    }



    const imageSrc = product.images?.[0] || product.image || "/images/default.png"

    if (viewMode === "list") {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
                <Link to={`/products/${product._id}`} className="flex p-4">
                    <img
                        src={imageSrc}
                        alt={product.name}
                        className="w-24 h-24 object-contain bg-gray-100 rounded-lg flex-shrink-0"
                    />
                    <div className="ml-4 flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">{product.category?.name}</p>
                                <h3 className="font-medium text-lg mb-1">{product.name}</h3>
                                <p className="text-sm text-gray-500 mb-2">{product.weight}</p>
                                <div className="flex items-center space-x-2">
                                    {product.originalPrice > product.price && (
                                        <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                                    )}
                                    <span className="font-bold text-lg">₹{product.price}</span>
                                    {product.discount > 0 && (
                                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                                            {product.discount}% OFF
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                className="px-4 py-2 text-red-500 border border-red-500 rounded-md hover:bg-red-50 transition-colors"
                            >
                                ADD
                            </button>
                        </div>
                    </div>
                </Link>
            </motion.div>
        )
    }


    // --- Grid View ---
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
            <Link to={`/products/${product._id}`} className="block p-4">
                {product.discount > 0 && (
                    <div className="bg-red-500 text-white text-xs px-2 py-1 rounded mb-2 inline-block">
                        {product.discount}% OFF
                    </div>
                )}
                <img
                    src={product.images || "/images/products/default.png"}
                    alt={product.name}
                    className="w-full h-32 object-contain rounded-lg mb-3 bg-gray-100"
                />
                <p className="text-xs text-gray-500 mb-1">{product.category?.name}</p>
                <h3 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{product.weight}</p>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1">
                        {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                        )}
                        <span className="font-bold text-sm">₹{product.price}</span>
                    </div>
                </div>
                <button
                    onClick={handleAddToCart}
                    className="w-full text-red-500 border border-red-500 hover:bg-red-50 bg-transparent py-2 px-4 rounded-md text-sm font-medium transition-colors"
                >
                    ADD
                </button>
            </Link>
        </motion.div>
    )
}

export default ProductCard
