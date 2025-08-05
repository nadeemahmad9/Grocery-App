const express = require("express")
const { body, validationResult } = require("express-validator")
const Product = require("../models/Product")
const Category = require("../models/Category")
const { auth, adminAuth } = require("../middleware/auth")

const router = express.Router()

// Get all products
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      featured,
      minPrice,
      maxPrice,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query

    const query = {}

    // Filter by category
   const mongoose = require("mongoose")
if (category && mongoose.Types.ObjectId.isValid(category)) {
  query.category = new mongoose.Types.ObjectId(category)
}


    // Search functionality
    if (search) {
      query.$text = { $search: search }
    }

    // Filter by featured
    if (featured === "true") {
      query.featured = true
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }

    // Only show in-stock products
    query.inStock = true

    const options = {
      page: Number.parseInt(page),
      limit: Number.parseInt(limit),
      sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 },
      populate: "category",
    }

    const products = await Product.find(query)
      .populate("category")
      .sort(options.sort)
      .limit(options.limit * 1)
      .skip((options.page - 1) * options.limit)

    const total = await Product.countDocuments(query)

    res.json({
      products,
      totalPages: Math.ceil(total / options.limit),
      currentPage: options.page,
      total,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category")

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.json(product)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create product (Admin only)
router.post(
  "/",
  adminAuth,
  [
    body("name").trim().isLength({ min: 1 }).withMessage("Product name is required"),
    body("description").trim().isLength({ min: 1 }).withMessage("Description is required"),
    body("category").isMongoId().withMessage("Valid category ID is required"),
    body("price").isNumeric().withMessage("Price must be a number"),
    body("weight").trim().isLength({ min: 1 }).withMessage("Weight is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      // Check if category exists
      const category = await Category.findById(req.body.category)
      if (!category) {
        return res.status(400).json({ message: "Category not found" })
      }

      const product = new Product(req.body)
      await product.save()
      await product.populate("category")

      res.status(201).json(product)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Update product (Admin only)
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("category")

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.json(product)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete product (Admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
