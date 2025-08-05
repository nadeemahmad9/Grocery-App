// const express = require("express")
// const jwt = require("jsonwebtoken")
// const { body, validationResult } = require("express-validator")
// const User = require("../models/User")
// const { auth } = require("../middleware/auth")

// const router = express.Router()

// // Register
// router.post(
//   "/register",
//   [
//     body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
//     body("email").isEmail().withMessage("Please enter a valid email"),
//     body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
//   ],
//   async (req, res) => {
//     try {
//       const errors = validationResult(req)
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() })
//       }

//       const { name, email, password, phone } = req.body

//       // Check if user exists
//       const existingUser = await User.findOne({ email })
//       if (existingUser) {
//         return res.status(400).json({ message: "User already exists" })
//       }

//       // Create user
//       const user = new User({ name, email, password, phone })
//       await user.save()

//       // Generate token
//       const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "7d" })

//       res.status(201).json({
//         token,
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//         },
//       })
//     } catch (error) {
//       console.error(error)
//       res.status(500).json({ message: "Server error" })
//     }
//   },
// )

// // Login
// router.post(
//   "/login",
//   [
//     body("email").isEmail().withMessage("Please enter a valid email"),
//     body("password").exists().withMessage("Password is required"),
//   ],
//   async (req, res) => {
//     try {
//       const errors = validationResult(req)
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() })
//       }

//       const { email, password } = req.body

//       // Check if user exists
//       const user = await User.findOne({ email })
//       if (!user) {
//         return res.status(400).json({ message: "Invalid credentials" })
//       }

//       // Check password
//       const isMatch = await user.comparePassword(password)
//       if (!isMatch) {
//         return res.status(400).json({ message: "Invalid credentials" })
//       }

//       // Generate token
//       const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "7d" })

//       res.json({
//         token,
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//         },
//       })
//     } catch (error) {
//       console.error(error)
//       res.status(500).json({ message: "Server error" })
//     }
//   },
// )

// // Get current user
// router.get("/me", auth, async (req, res) => {
//   try {
//     res.json({
//       user: {
//         id: req.user._id,
//         name: req.user.name,
//         email: req.user.email,
//         role: req.user.role,
//         phone: req.user.phone,
//         addresses: req.user.addresses,
//       },
//     })
//   } catch (error) {
//     console.error(error)
//     res.status(500).json({ message: "Server error" })
//   }
// })

// module.exports = router


const express = require("express")
const jwt = require("jsonwebtoken")
const { body, validationResult } = require("express-validator")
const User = require("../models/User")
const { auth } = require("../middleware/auth")

const router = express.Router()

// Register
router.post(
  "/register",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { name, email, password, phone, image } = req.body

      // Check if user exists
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" })
      }

      // Create user
      const user = new User({
        name,
        email,
        password,
        phone,
        profileImage: image || "", // Save image URL
      })

      await user.save()

      // Generate token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "10d" }
      )

      res.status(201).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          profileImage: user.profileImage,
        },
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server error" })
    }
  }
)

// Login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").exists().withMessage("Password is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { email, password } = req.body

      // Check if user exists
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" })
      }

      // Check password
      const isMatch = await user.comparePassword(password)
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" })
      }

      // Generate token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "30d" }
      )

      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          profileImage: user.profileImage,
        },
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server error" })
    }
  }
)

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        phone: req.user.phone,
        addresses: req.user.addresses,
        profileImage: req.user.profileImage,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
