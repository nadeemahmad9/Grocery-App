import { motion } from "framer-motion"
import { Link } from "react-router-dom"

const CategoryCard = ({ category, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
        >
            <Link
                to={`/products?category=${category._id}`}
                className="block bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer rounded-lg p-4 text-center"
            >
                <img
                    src={category.image || "/images/default-category.png"}
                    alt={category.name}
                    className="w-full h-24 object-contain rounded-lg mb-3"
                />
                <p className="text-sm font-medium text-gray-700">{category.name}</p>
            </Link>
        </motion.div>
    )
}

export default CategoryCard
