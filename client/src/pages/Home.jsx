import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { ShoppingCart } from "lucide-react"
import axios from "axios"
import ProductCard from "../components/ProductCard"
import CategoryCard from "../components/CategoryCard"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import SliderPage from "../components/Slider"

const banners = [
    {
        image: "img4.png",
        title: "Discover Fresh Deals Everyday",
        description: "Shop top quality items at the best prices.",
    },

    {
        image: "img8.png",
        title: "Best Prices on Daily Essentials",
        description: "Everyday savings on the items you love.",
    },
    {
        image: "img5.png",
        title: "Cool Treats, Sweet Moments!",
        description: "Enjoy ice creams, desserts, and more!",
    },
    {
        image: "img7.png",
        title: "Get Your Groceries Delivered Fast",
        description: "Lightning-fast delivery at your doorstep.",
    },
];





const Home = () => {

    const sliderSettings = {
        dots: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
    };


    const { data: recentProducts = [] } = useQuery({
        queryKey: ["recent-products"],
        queryFn: async () => {
            const response = await axios.get("/api/products?limit=6");
            return response.data?.products ?? [];
        }
    });

    const { data: featuredProducts = [], isLoading: productsLoading } = useQuery({
        queryKey: ["featured-products"],
        queryFn: async () => {
            const response = await axios.get("/api/products?featured=true&limit=6");
            console.log(response);

            return response.data?.products ?? [];
        }
    });

    const { data: categories = [], isLoading: categoriesLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const response = await axios.get("/api/categories");
            return response.data ?? [];
        }
    });

    const { data: coupons = [] } = useQuery({
        queryKey: ["coupons"],
        queryFn: async () => {
            const response = await axios.get("/api/coupons");
            return response.data ?? [];
        }
    });


    return (
        <div className="min-h-screen bg-white ">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 ">

                <Slider {...sliderSettings}>
                    {banners.map((banner, index) => (
                        <div
                            key={index}
                            className="relative h-[250px] md:h-[450px] rounded-lg overflow-hidden"
                        >
                            <img
                                src={banner.image}
                                alt={`Banner ${index + 1}`}
                                className="w-full h-full object-cover"
                            />

                            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent z-10"></div>

                            <div className="absolute top-2 left-4  md:text-4xl rounded-full animate-pulse z-20">🥬</div>
                            <div className="absolute top-2 right-4 md:text-4xl  rounded-full  animate-pulse z-20">🍞</div>

                            <div className="absolute bottom-8 right-20 text-2xl md:text-6xl z-20 animate-bounce-slow">
                                🍉
                            </div>
                            <div className="absolute bottom-8 left-10 text-2xl md:text-6xl z-20 animate-bounce-slow">
                                🥦
                            </div>
                            <div className="absolute top-20 left-50 text-2xl md:text-6xl z-20 animate-bounce-slow">
                                🍅
                            </div>

                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 mt-15 z-30">
                                <h2 className="text-xl md:text-3xl font-bold mb-2 drop-shadow-lg">
                                    {banner.title}
                                </h2>
                                <p className="text-sm md:text-lg mb-4 drop-shadow-sm">{banner.description}</p>
                                <Link
                                    to="/products"
                                    className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded shadow"
                                >
                                    Order Now
                                </Link>

                            </div>
                        </div>
                    ))}
                </Slider>



            </div>

            {/* Shop Popular Categories */}
            <section className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Shop Popular Categories</h2>
                        <Link to="/products" className="text-red-500 hover:text-red-600 font-medium">
                            View all →
                        </Link>
                    </div>

                    {categoriesLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="bg-gray-200 rounded-lg h-32 mb-3"></div>
                                    <div className="bg-gray-200 rounded h-4"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {categories?.slice(0, 6).map((category, index) => (
                                <CategoryCard key={category._id} category={category} index={index} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
                        <Link to="/products" className="text-red-500 hover:text-red-600 font-medium">
                            See All
                        </Link>
                    </div>

                    {productsLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="bg-gray-200 rounded-lg h-32 mb-3"></div>
                                    <div className="bg-gray-200 rounded h-4 mb-2"></div>
                                    <div className="bg-gray-200 rounded h-4 mb-2"></div>
                                    <div className="bg-gray-200 rounded h-8"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {featuredProducts?.map((product, index) => (
                                <ProductCard key={product._id} product={product} index={index} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Recent Products */}
            <section className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Recent Products</h2>
                        <Link to="/products" className="text-red-500 hover:text-red-600 font-medium">
                            See All
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {recentProducts?.map((product, index) => (
                            <ProductCard key={product._id} product={product} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Coupons Section */}
            <section className="py-8 bg-yellow-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Save more with coupons</h2>
                        <Link to="/products" className="text-gray-50 hover:text-gray-900 font-medium">
                            View all →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {coupons?.slice(0, 4).map((coupon, index) => (
                            <motion.div
                                key={coupon._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="bg-white border-0 rounded-lg p-4 flex items-center">
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                        <span className="text-white text-xs">%</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm">{coupon.title}</h3>
                                        <p className="text-xs text-gray-500">
                                            USE {coupon.code} | ON ₹{coupon.minOrder}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home


// import React from "react";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import ProductCard from "../components/ProductCard"; // Adjust the path as needed

// import CategoryCard from "../components/CategoryCard"

// const Home = () => {
//     const { data: categories, isLoading: categoriesLoading } = useQuery({
//         queryKey: ["categories"],
//         queryFn: async () => {
//             const response = await axios.get("/api/categories");
//             return response.data;
//         },
//     });

//     const { data: featuredProducts, isLoading: productsLoading } = useQuery({
//         queryKey: ["featured-products"],
//         queryFn: async () => {
//             const response = await axios.get("/api/products?featured=true&limit=6");
//             return response.data.products;
//         },
//     });

//     const { data: recentProducts, isLoading: recentLoading } = useQuery({
//         queryKey: ["recent-products"],
//         queryFn: async () => {
//             const response = await axios.get("/api/products?limit=6");
//             return response.data.products;
//         },
//     });

//     const { data: coupons, isLoading: couponsLoading } = useQuery({
//         queryKey: ["coupons"],
//         queryFn: async () => {
//             const response = await axios.get("/api/coupons");
//             return response.data;
//         },
//     });

//     // if (categoriesLoading || productsLoading || recentLoading || couponsLoading) {
//     //     return <Loader />;
//     // }

//     return (
//         <div className="space-y-12">
//             {/* Categories Section */}
//             <section>
//                 <h2 className="text-2xl font-bold mb-4">Shop by Category</h2>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//                     {categories?.map((category) => (
//                         <CategoryCard key={category._id} category={category} />
//                     ))}
//                 </div>
//             </section>

//             {/* Featured Products */}
//             <section>
//                 <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//                     {featuredProducts?.map((product) => (
//                         <ProductCard key={product._id} product={product} />
//                     ))}
//                 </div>
//             </section>

//             {/* Recent Products */}
//             <section>
//                 <h2 className="text-2xl font-bold mb-4">New Arrivals</h2>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//                     {recentProducts?.map((product) => (
//                         <ProductCard key={product._id} product={product} />
//                     ))}
//                 </div>
//             </section>

//             {/* Coupons */}
//             <section>
//                 <h2 className="text-2xl font-bold mb-4">Available Coupons</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {coupons?.map((coupon) => (
//                         <CouponCard key={coupon._id} coupon={coupon} />
//                     ))}
//                 </div>
//             </section>
//         </div>
//     );
// };

// export default Home;
