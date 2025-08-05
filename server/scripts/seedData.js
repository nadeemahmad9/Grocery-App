const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
require("dotenv").config()

const User = require("../models/User")
const Category = require("../models/Category")
const Product = require("../models/Product")
const Coupon = require("../models/Coupon")

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/groceryAppDB", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
})

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({})
    await Category.deleteMany({})
    await Product.deleteMany({})
    await Coupon.deleteMany({})

    console.log("Cleared existing data")

      // Create admin and test user (no manual hashing)
    const admin = new User({
      name: "Admin User",
      email: "admin@grocery.com",
      password: "admin123",
      role: "admin",
    });

    // const user = new User({
    //   name: "Test User",
    //   email: "user@grocery.com",
    //   password: "user123",
    //   role: "user",
    // });

    await admin.save();
    // await user.save();
    console.log("✅ Created admin and test user");


    // Create categories
    const categories = [
      { name: "Fruits & Vegetables", description: "Fresh fruits and vegetables", image:"/images/categories/fruitsandveg.png", sortOrder: 1 },
      { name: "Dairy, Bread & Eggs", description: "Fresh dairy products, bread and eggs",image:"/images/categories/dairy.png", sortOrder: 2 },
      { name: "Snack & Munchies", description: "Delicious snacks and munchies",image:"/images/categories/snacks.png", sortOrder: 3 },
      { name: "Bakery & Biscuits", description: "Fresh bakery items and biscuits",image:"/images/categories/bakery.png", sortOrder: 4 },
      { name: "Instant Food", description: "Quick and easy instant food",image:"/images/categories/instantfood.png", sortOrder: 5 },
      { name: "Tea, Coffee & Drinks", description: "Beverages and hot drinks",image:"/images/categories/teacoffee.png", sortOrder: 6 },
      { name: "Cold Drinks & Juices", description: "Refreshing cold drinks and juices",image:"/images/categories/colddrinks.png", sortOrder: 7 },
      { name: "Chicken, Meat & Fish", description: "Fresh meat and seafood",image:"/images/categories/meat.png", sortOrder: 8 },
    ]

    const createdCategories = await Category.insertMany(categories)
    console.log("Created categories")

    // Create products
    const products = [
      {
        name: "Salted Instant Peanuts",
        description: "Crunchy salted peanuts perfect for snacking",
        category: createdCategories[2]._id, // Snack & Munchies
        price: 40,
        originalPrice: 45,
        discount: 10,
        weight: "100g",
        inStock: true,
        stockQuantity: 100,
        featured: true,
        tags: ["snacks", "peanuts", "salty"],
        images: "/images/products/peanuts.png",
      
      },
      {
        name: "Blueberry Greek Yogurt",
        description: "Rich and creamy Greek yogurt with blueberries",
        category: createdCategories[1]._id, // Dairy, Bread & Eggs
        price: 70,
        originalPrice: 75,
        discount: 15,
        weight: "750g",
        inStock: true,
        stockQuantity: 50,
        featured: true,
        tags: ["yogurt", "dairy", "blueberry"],
        images: "/images/products/yogurt.png",
      },
      {
        name: "Motherdairy Cheese Slices",
        description: "Premium quality cheese slices",
        category: createdCategories[1]._id, // Dairy, Bread & Eggs
        price: 100,
        originalPrice: 120,
        discount: 0,
        weight: "250g",
        inStock: true,
        stockQuantity: 75,
        featured: true,
        tags: ["cheese", "dairy", "slices"],
        images: "/images/products/cheese.png",
      },
      {
        name: "Kellogg's Original Corn Flakes",
        description: "Crispy corn flakes for a healthy breakfast",
        category: createdCategories[4]._id, // Instant Food
        price: 75,
        originalPrice: 80,
        discount: 0,
        weight: "500g",
        inStock: true,
        stockQuantity: 60,
        featured: true,
        tags: ["cereal", "breakfast", "corn flakes"],
        images: "/images/products/cornflakes.png",
      },
      {
        name: "Haldiram's Sev Bhujia",
        description: "Traditional Indian snack mix",
        category: createdCategories[2]._id, // Snack & Munchies
        price: 50,
        originalPrice: 55,
        discount: 5,
        weight: "400g",
        inStock: true,
        stockQuantity: 80,
        featured: true,
        tags: ["indian snacks", "sev", "spicy"],
        images: "/images/products/bhujia.png",
      },
      {
        name: "NutriChoice Digestive Biscuits",
        description: "Healthy digestive biscuits",
        category: createdCategories[3]._id, // Bakery & Biscuits
        price: 20,
        originalPrice: 25,
        discount: 0,
        weight: "250g",
        inStock: true,
        stockQuantity: 120,
        featured: true,
        tags: ["biscuits", "digestive", "healthy"],
        images: "/images/products/nutrichoice.png",
      },
      {
        name: "Sprite Soft Drink",
        description: "Classic Sprite soft drink",
        category: createdCategories[6]._id, // Cold Drinks & Juices
        price: 20,
        originalPrice: 25,
        discount: 10,
        weight: "2L",
        inStock: true,
        stockQuantity: 200,
        featured: false,
        tags: ["cola", "soft drink", "beverage"],
        images: "/images/products/sprite.png",
      },
      {
        name: "Fresh Orange Juice",
        description: "Freshly squeezed orange juice",
        category: createdCategories[6]._id, // Cold Drinks & Juices
        price: 35,
        originalPrice: 40,
        discount: 5,
        weight: "1L",
        inStock: true,
        stockQuantity: 40,
        featured: false,
        tags: ["juice", "orange", "fresh"],
        images: "/images/products/juice.png",
      },
      {
        name: "Amul Fresh Milk",
        description: "Pure and fresh milk",
        category: createdCategories[1]._id, // Dairy, Bread & Eggs
        price: 60,
        originalPrice: 60,
        discount: 0,
        weight: "1L",
        inStock: true,
        stockQuantity: 30,
        featured: false,
        tags: ["milk", "dairy", "fresh"],
        images: "/images/products/milk.png",
      },
      {
        name: "Brown Bread Loaf",
        description: "Healthy brown bread loaf",
        category: createdCategories[3]._id, // Bakery & Biscuits
        price: 30,
        originalPrice: 35,
        discount: 0,
        weight: "400g",
        inStock: true,
        stockQuantity: 25,
        featured: false,
        tags: ["bread", "brown bread", "healthy"],
        images: "/images/products/bread.png"
      },
      {
    name: "Fresh Red Apples",
    description: "Juicy and sweet red apples",
    category: createdCategories[0]._id,
    price: 120,
    originalPrice: 140,
    discount: 15,
    weight: "1kg",
    inStock: true,
    stockQuantity: 50,
    featured: true,
    tags: ["fruits", "apples", "fresh"],
    images: "/images/products/apples.png",
  },
  {
    name: "Banana Cavendish",
    description: "High energy bananas rich in potassium",
    category: createdCategories[0]._id,
    price: 45,
    originalPrice: 50,
    discount: 10,
    weight: "1 dozen",
    inStock: true,
    stockQuantity: 80,
    featured: true,
    tags: ["bananas", "fruits", "energy"],
    images: "/images/products/banana.png",
  },
  {
    name: "Fresh Broccoli",
    description: "Green and crisp broccoli florets",
    category: createdCategories[0]._id,
    price: 70,
    originalPrice: 80,
    discount: 12,
    weight: "500g",
    inStock: true,
    stockQuantity: 60,
    featured: false,
    tags: ["vegetables", "broccoli", "green"],
    images: "/images/products/broccoli.png",
  },
  {
    name: "Carrot (Organic)",
    description: "Crunchy organic carrots full of nutrients",
    category: createdCategories[0]._id,
    price: 40,
    originalPrice: 45,
    discount: 5,
    weight: "500g",
    inStock: true,
    stockQuantity: 70,
    featured: true,
    tags: ["carrots", "organic", "vegetables"],
    images: "/images/products/carrot.png",
  },
  {
    name: "Green Grapes",
    description: "Seedless fresh green grapes",
    category: createdCategories[0]._id,
    price: 90,
    originalPrice: 100,
    discount: 10,
    weight: "500g",
    inStock: true,
    stockQuantity: 55,
    featured: false,
    tags: ["grapes", "fruits", "juicy"],
    images: "/images/products/grapes.png",
  },
  {
    name: "Tomatoes (Desi)",
    description: "Fresh and juicy tomatoes for daily cooking",
    category: createdCategories[0]._id,
    price: 30,
    originalPrice: 35,
    discount: 0,
    weight: "1kg",
    inStock: true,
    stockQuantity: 100,
    featured: true,
    tags: ["tomatoes", "vegetables", "cooking"],
    images: "/images/products/tomatoes.png",
  },
  {
    name: "Cucumber (Kheera)",
    description: "Cool and hydrating cucumbers",
    category: createdCategories[0]._id,
    price: 25,
    originalPrice: 30,
    discount: 5,
    weight: "500g",
    inStock: true,
    stockQuantity: 40,
    featured: false,
    tags: ["cucumber", "hydrating", "vegetables"],
    images: "/images/products/cucumber.png",
  },
  {
    name: "Spinach Leaves (Palak)",
    description: "Fresh spinach leaves full of iron",
    category: createdCategories[0]._id,
    price: 20,
    originalPrice: 25,
    discount: 0,
    weight: "250g",
    inStock: true,
    stockQuantity: 60,
    featured: false,
    tags: ["spinach", "leafy", "vegetables"],
    images: "/images/products/spinach.png",
  },
  {
    name: "Pineapple Slices",
    description: "Sweet and tangy pineapple slices",
    category: createdCategories[0]._id,
    price: 80,
    originalPrice: 90,
    discount: 10,
    weight: "1 piece",
    inStock: true,
    stockQuantity: 30,
    featured: true,
    tags: ["pineapple", "fruits", "tropical"],
    images: "/images/products/pineapple.png",
  },
  {
    name: "Green Beans",
    description: "Tender and fresh green beans",
    category: createdCategories[0]._id,
    price: 35,
    originalPrice: 40,
    discount: 5,
    weight: "500g",
    inStock: true,
    stockQuantity: 70,
    featured: false,
    tags: ["beans", "vegetables", "green"],
    images: "/images/products/beans.png",
  },
  {
    name: "Mango Alphonso",
    description: "Premium juicy Alphonso mangoes",
    category: createdCategories[0]._id,
    price: 150,
    originalPrice: 180,
    discount: 10,
    weight: "1kg",
    inStock: true,
    stockQuantity: 40,
    featured: true,
    tags: ["mango", "alphonso", "fruits"],
    images: "/images/products/mango.png",
  },
  {
    name: "Onion (Red)",
    description: "Red onions for everyday cooking",
    category: createdCategories[0]._id,
    price: 25,
    originalPrice: 30,
    discount: 0,
    weight: "1kg",
    inStock: true,
    stockQuantity: 90,
    featured: false,
    tags: ["onion", "cooking", "vegetables"],
    images: "/images/products/onion.png",
  },
  {
    name: "Sweet Corn (Boiled)",
    description: "Ready-to-eat sweet corn kernels",
    category: createdCategories[0]._id,
    price: 60,
    originalPrice: 65,
    discount: 5,
    weight: "400g",
    inStock: true,
    stockQuantity: 35,
    featured: true,
    tags: ["corn", "sweet", "vegetables"],
    images: "/images/products/sweetcorn.png",
  },
  {
    name: "Lettuce Iceberg",
    description: "Crunchy iceberg lettuce for salads",
    category: createdCategories[0]._id,
    price: 50,
    originalPrice: 60,
    discount: 10,
    weight: "1 piece",
    inStock: true,
    stockQuantity: 25,
    featured: false,
    tags: ["lettuce", "salad", "vegetables"],
    images: "/images/products/lettuce.png",
  },
  {
    name: "Papaya (Ripe)",
    description: "Sweet and healthy ripe papaya",
    category: createdCategories[0]._id,
    price: 65,
    originalPrice: 75,
    discount: 12,
    weight: "1kg",
    inStock: true,
    stockQuantity: 45,
    featured: false,
    tags: ["papaya", "fruits", "ripe"],
    images: "/images/products/papaya.png",
  }
    ]

    await Product.insertMany(products)
    console.log("Created products")

    // Create coupons
    const coupons = [
      {
        code: "SAVE10",
        title: "Flat ₹100 off",
        type: "flat",
        discount: 100,
        minOrder: 999,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        usageLimit: 100,
      },
      {
        code: "CODE10",
        title: "15% off upto ₹124",
        type: "percentage",
        discount: 15,
        maxDiscount: 124,
        minOrder: 750,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        usageLimit: 200,
      },
      {
        code: "OFF10",
        title: "10% off upto ₹150",
        type: "percentage",
        discount: 10,
        maxDiscount: 150,
        minOrder: 1100,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        usageLimit: 150,
      },
      {
        code: "SAVE150",
        title: "Flat ₹150 off",
        type: "flat",
        discount: 150,
        minOrder: 499,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        usageLimit: 50,
      },
    ]

    await Coupon.insertMany(coupons)
    console.log("Created coupons")

    console.log("Seed data created successfully!")
    console.log("Admin credentials: admin@grocery.com / admin123")
    console.log("User credentials: user@grocery.com / user123")

    process.exit(0)
  } catch (error) {
    console.error("Error seeding data:", error)
    process.exit(1)
  }
}

seedData()
