const Expense = require("../models/Expense")
const { validationResult } = require("express-validator")

// Get all expenses for user
const getExpenses = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, startDate, endDate, search } = req.query

    // Build filter object
    const filter = { user: req.user._id }

    if (category && category !== "all") {
      filter.category = category
    }

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      }
    }

    if (search) {
      filter.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    const expenses = await Expense.find(filter)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Expense.countDocuments(filter)

    res.json({
      expenses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Get expenses error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Get expense by ID
const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" })
    }

    res.json(expense)
  } catch (error) {
    console.error("Get expense by ID error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Create new expense
const createExpense = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const expenseData = {
      ...req.body,
      user: req.user._id,
    }

    const expense = new Expense(expenseData)
    await expense.save()

    res.status(201).json({
      message: "Expense created successfully",
      expense,
    })
  } catch (error) {
    console.error("Create expense error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Update expense
const updateExpense = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const expense = await Expense.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, {
      new: true,
      runValidators: true,
    })

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" })
    }

    res.json({
      message: "Expense updated successfully",
      expense,
    })
  } catch (error) {
    console.error("Update expense error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Delete expense
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" })
    }

    res.json({ message: "Expense deleted successfully" })
  } catch (error) {
    console.error("Delete expense error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Get expense statistics
const getExpenseStats = async (req, res) => {
  try {
    const { year = new Date().getFullYear(), month } = req.query

    // Build date filter
    const startDate = month ? new Date(year, month - 1, 1) : new Date(year, 0, 1)
    const endDate = month ? new Date(year, month, 0) : new Date(year, 11, 31)

    // Category-wise expenses
    const categoryStats = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { total: -1 },
      },
    ])

    // Monthly trends
    const monthlyStats = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: new Date(year, 0, 1), $lte: new Date(year, 11, 31) },
        },
      },
      {
        $group: {
          _id: { $month: "$date" },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])

    // Total expenses
    const totalExpenses = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ])

    res.json({
      categoryStats,
      monthlyStats,
      totalExpenses: totalExpenses[0] || { total: 0, count: 0 },
      period: { startDate, endDate },
    })
  } catch (error) {
    console.error("Get expense stats error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseStats,
}
