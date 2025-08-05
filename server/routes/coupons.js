const express = require("express")
const { body, validationResult } = require("express-validator")
const Coupon = require("../models/Coupon")
const { auth, adminAuth } = require("../middleware/auth")

const router = express.Router()

// Get all active coupons
router.get("/", async (req, res) => {
  try {
    const coupons = await Coupon.find({
      isActive: true,
      validUntil: { $gte: new Date() },
    }).select("-usedCount")

    res.json(coupons)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get all coupons (Admin only)
router.get("/admin", adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query

    const coupons = await Coupon.find()
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Coupon.countDocuments()

    res.json({
      coupons,
      totalPages: Math.ceil(total / limit),
      currentPage: Number.parseInt(page),
      total,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Validate coupon
router.post("/validate", auth, async (req, res) => {
  try {
    const { code, orderTotal } = req.body

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
      validFrom: { $lte: new Date() },
      validUntil: { $gte: new Date() },
    })

    if (!coupon) {
      return res.status(400).json({ message: "Invalid or expired coupon" })
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: "Coupon usage limit exceeded" })
    }

    if (orderTotal < coupon.minOrder) {
      return res.status(400).json({
        message: `Minimum order amount is $${coupon.minOrder}`,
      })
    }

    let discountAmount = 0
    if (coupon.type === "percentage") {
      discountAmount = (orderTotal * coupon.discount) / 100
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount
      }
    } else {
      discountAmount = coupon.discount
    }

    res.json({
      valid: true,
      coupon: {
        id: coupon._id,
        code: coupon.code,
        title: coupon.title,
        discountAmount,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create coupon (Admin only)
router.post(
  "/",
  adminAuth,
  [
    body("code").trim().isLength({ min: 3 }).withMessage("Coupon code must be at least 3 characters"),
    body("title").trim().isLength({ min: 1 }).withMessage("Title is required"),
    body("type").isIn(["percentage", "flat"]).withMessage("Type must be percentage or flat"),
    body("discount").isNumeric().withMessage("Discount must be a number"),
    body("validUntil").isISO8601().withMessage("Valid until date is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const coupon = new Coupon(req.body)
      await coupon.save()

      res.status(201).json(coupon)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Update coupon (Admin only)
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" })
    }

    res.json(coupon)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete coupon (Admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id)

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" })
    }

    res.json({ message: "Coupon deleted successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
