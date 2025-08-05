const express = require("express")
const { body, validationResult } = require("express-validator")
const Order = require("../models/Order")
const Product = require("../models/Product")
const { auth, adminAuth } = require("../middleware/auth")

const router = express.Router()

// Get user orders
router.get("/my-orders", auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query

    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Order.countDocuments({ user: req.user._id })

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: Number.parseInt(page),
      total,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get all orders (Admin only)
router.get("/", adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query
    const query = {}

    if (status) {
      query.orderStatus = status
    }

    const orders = await Order.find(query)
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Order.countDocuments(query)

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: Number.parseInt(page),
      total,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create order
router.post(
  "/",
  auth,
  [
    body("items").isArray({ min: 1 }).withMessage("Order must have at least one item"),
    body("shippingAddress").isObject().withMessage("Shipping address is required"),
    body("paymentMethod").isIn(["cash", "card", "upi", "wallet"]).withMessage("Invalid payment method"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { items, shippingAddress, paymentMethod, couponUsed } = req.body

      // Validate products and calculate totals
      let subtotal = 0
      const orderItems = []

      for (const item of items) {
        const product = await Product.findById(item.product)
        if (!product) {
          return res.status(400).json({ message: `Product ${item.product} not found` })
        }

        if (!product.inStock || product.stockQuantity < item.quantity) {
          return res.status(400).json({ message: `Insufficient stock for ${product.name}` })
        }

        const itemTotal = product.price * item.quantity
        subtotal += itemTotal

        orderItems.push({
          product: product._id,
          quantity: item.quantity,
          price: product.price,
          total: itemTotal,
        })

        // Update stock
        product.stockQuantity -= item.quantity
        if (product.stockQuantity === 0) {
          product.inStock = false
        }
        await product.save()
      }

      const deliveryFee = subtotal > 500 ? 0 : 50 // Free delivery above $500
      const total = subtotal + deliveryFee

      const latestOrder = await Order.findOne().sort({ createdAt: -1 })
const orderNumber = latestOrder ? latestOrder.orderNumber + 1 : 1001

      const order = new Order({
        user: req.user._id,
        items: orderItems,
        shippingAddress,
        paymentMethod,
        subtotal,
        deliveryFee,
        total,
        couponUsed,
        orderNumber,
      })

      await order.save()
      await order.populate("items.product")

      res.status(201).json(order)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Update order status (Admin only)
router.put("/:id/status", adminAuth, async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body

    const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus, paymentStatus }, { new: true }).populate(
      "items.product",
    )

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    res.json(order)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})
// Update order status (Admin only)

// router.put("/:id/status", adminAuth, async (req, res) => {
//   try {
//     const { orderstatus } = req.body

//     const order = await Order.findByIdAndUpdate(
//       req.params.id,
//       { orderstatus }, // ✅ This must match the schema
//       { new: true }
//     ).populate("items.product")

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" })
//     }

//     res.json(order)
//   } catch (error) {
//     console.error(error)
//     res.status(500).json({ message: "Server error" })
//   }
// })


module.exports = router
