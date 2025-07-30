import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./AuthContext"
import axios from "axios"
import toast from "react-hot-toast"

const CartContext = createContext()

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([])
    const [loading, setLoading] = useState(false)
    const { user } = useAuth()

    useEffect(() => {
        if (user) {
            fetchCart()
        } else {
            // Load cart from localStorage for non-authenticated users
            const localCart = localStorage.getItem("cart")
            if (localCart) {
                setCart(JSON.parse(localCart))
            }
        }
    }, [user])

    const fetchCart = async () => {
        try {
            setLoading(true)
            const response = await axios.get("/api/users/cart")
            setCart(response.data)
        } catch (error) {
            console.error("Error fetching cart:", error)
        } finally {
            setLoading(false)
        }
    }

    const addToCart = async (product, quantity = 1) => {
        try {
            if (user) {
                await axios.post("/api/users/cart", {
                    productId: product._id,
                    quantity,
                })
                await fetchCart()
            } else {
                // Handle local cart for non-authenticated users
                const existingItem = cart.find((item) => item.product._id === product._id)
                let newCart

                if (existingItem) {
                    newCart = cart.map((item) =>
                        item.product._id === product._id ? { ...item, quantity: item.quantity + quantity } : item,
                    )
                } else {
                    newCart = [...cart, { product, quantity }]
                }

                setCart(newCart)
                localStorage.setItem("cart", JSON.stringify(newCart))
            }

            toast.success("Added to cart!")
        } catch (error) {
            toast.error("Failed to add to cart")
            console.error("Error adding to cart:", error)
        }
    }

    const updateCartItem = async (productId, quantity) => {
        try {
            if (user) {
                await axios.put(`/api/users/cart/${productId}`, { quantity })
                await fetchCart()
            } else {
                const newCart = cart.map((item) => (item.product._id === productId ? { ...item, quantity } : item))
                setCart(newCart)
                localStorage.setItem("cart", JSON.stringify(newCart))
            }
        } catch (error) {
            toast.error("Failed to update cart")
            console.error("Error updating cart:", error)
        }
    }

    const removeFromCart = async (productId) => {
        try {
            if (user) {
                await axios.delete(`/api/users/cart/${productId}`)
                await fetchCart()
            } else {
                const newCart = cart.filter((item) => item.product._id !== productId)
                setCart(newCart)
                localStorage.setItem("cart", JSON.stringify(newCart))
            }

            toast.success("Removed from cart")
        } catch (error) {
            toast.error("Failed to remove from cart")
            console.error("Error removing from cart:", error)
        }
    }

    const clearCart = () => {
        setCart([])
        localStorage.removeItem("cart")
    }

    const getCartTotal = () => {
        if (!Array.isArray(cart)) return 0;
        return cart.reduce((total, item) => total + item.product.price * item.quantity, 0)
    }

    // const getCartItemsCount = () => {
    //     return cart.reduce((total, item) => total + item.quantity, 0)
    // }

    const getCartItemsCount = () => {
        if (!Array.isArray(cart)) return 0;
        return cart.reduce((total, item) => total + item.quantity, 0);
    }

    const value = {
        cart,
        loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartItemsCount,
    }

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
