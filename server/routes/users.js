const express = require("express")
const User = require("../models/User")
const { auth, adminAuth } = require("../middleware/auth")

const router = express.Router()

// Get all users (Admin only)
router.get("/", adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query

    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await User.countDocuments()

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: Number.parseInt(page),
      total,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update user profile
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, phone, addresses } = req.body

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, addresses },
      { new: true, runValidators: true },
    ).select("-password")

    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Add to cart
router.post("/cart", auth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body

    const user = await User.findById(req.user._id)
    const existingItem = user.cart.find((item) => item.product.toString() === productId)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      user.cart.push({ product: productId, quantity })
    }

    await user.save()
    await user.populate("cart.product")

    res.json(user.cart)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get cart
router.get("/cart", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.product")
    res.json(user.cart)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update cart item
router.put("/cart/:productId", auth, async (req, res) => {
  try {
    const { quantity } = req.body
    const user = await User.findById(req.user._id)

    const cartItem = user.cart.find((item) => item.product.toString() === req.params.productId)

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" })
    }

    if (quantity <= 0) {
      user.cart = user.cart.filter((item) => item.product.toString() !== req.params.productId)
    } else {
      cartItem.quantity = quantity
    }

    await user.save()
    await user.populate("cart.product")

    res.json(user.cart)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Remove from cart
router.delete("/cart/:productId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    user.cart = user.cart.filter((item) => item.product.toString() !== req.params.productId)

    await user.save()
    await user.populate("cart.product")

    res.json(user.cart)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
