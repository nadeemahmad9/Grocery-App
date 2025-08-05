const express = require("express")
const { body, validationResult } = require("express-validator")
const Category = require("../models/Category")
const { adminAuth } = require("../middleware/auth")

const router = express.Router()

// Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).populate("parent").sort({ sortOrder: 1, name: 1 })

    res.json(categories)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get single category
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate("parent")

    if (!category) {
      return res.status(404).json({ message: "Category not found" })
    }

    res.json(category)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create category (Admin only)
router.post(
  "/",
  adminAuth,
  [body("name").trim().isLength({ min: 1 }).withMessage("Category name is required")],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const category = new Category(req.body)
      await category.save()
      await category.populate("parent")

      res.status(201).json(category)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Update category (Admin only)
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("parent")

    if (!category) {
      return res.status(404).json({ message: "Category not found" })
    }

    res.json(category)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete category (Admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id)

    if (!category) {
      return res.status(404).json({ message: "Category not found" })
    }

    res.json({ message: "Category deleted successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
