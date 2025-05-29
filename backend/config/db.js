const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/expense-tracker")
    console.log("MongoDB Connected")
  } catch (error) {
    console.error("Database connection error:", error.message)
    process.exit(1)
  }
}

module.exports = connectDB
