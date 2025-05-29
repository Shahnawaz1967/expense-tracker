const express = require("express")
const { body } = require("express-validator")
const {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseStats,
} = require("../controllers/expenseController")
const auth = require("../middleware/auth")

const router = express.Router()

// Validation rules
const expenseValidation = [
  body("title").trim().isLength({ min: 1, max: 100 }).withMessage("Title must be between 1 and 100 characters"),
  body("amount").isFloat({ min: 0.01 }).withMessage("Amount must be greater than 0"),
  body("category")
    .isIn([
      "Food & Dining",
      "Transportation",
      "Shopping",
      "Entertainment",
      "Bills & Utilities",
      "Healthcare",
      "Education",
      "Travel",
      "Business",
      "Other",
    ])
    .withMessage("Invalid category"),
  body("date").isISO8601().withMessage("Invalid date format"),
]

// Apply auth middleware to all routes
router.use(auth)

// Routes
router.get("/", getExpenses)
router.get("/stats", getExpenseStats)
router.get("/:id", getExpenseById)
router.post("/", expenseValidation, createExpense)
router.put("/:id", expenseValidation, updateExpense)
router.delete("/:id", deleteExpense)

module.exports = router
