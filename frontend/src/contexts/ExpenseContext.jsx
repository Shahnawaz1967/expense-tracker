import { createContext, useContext, useReducer } from "react"
import { toast } from "react-toastify"
import api from "../utils/api"

const ExpenseContext = createContext()

const initialState = {
  expenses: [],
  stats: null,
  isLoading: false,
  filters: {
    category: "all",
    startDate: "",
    endDate: "",
    search: "",
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
  },
}

const expenseReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "SET_EXPENSES":
      return {
        ...state,
        expenses: action.payload.expenses,
        pagination: {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          total: action.payload.total,
        },
      }
    case "ADD_EXPENSE":
      return {
        ...state,
        expenses: [action.payload, ...state.expenses],
      }
    case "UPDATE_EXPENSE":
      return {
        ...state,
        expenses: state.expenses.map((expense) => (expense._id === action.payload._id ? action.payload : expense)),
      }
    case "DELETE_EXPENSE":
      return {
        ...state,
        expenses: state.expenses.filter((expense) => expense._id !== action.payload),
      }
    case "SET_STATS":
      return { ...state, stats: action.payload }
    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload } }
    case "RESET_FILTERS":
      return {
        ...state,
        filters: {
          category: "all",
          startDate: "",
          endDate: "",
          search: "",
        },
      }
    default:
      return state
  }
}

export const ExpenseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(expenseReducer, initialState)

  const fetchExpenses = async (page = 1, filters = {}) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...filters,
      })

      const response = await api.get(`/expenses?${params}`)
      dispatch({ type: "SET_EXPENSES", payload: response.data })
    } catch (error) {
      console.error("Fetch expenses error:", error)
      toast.error("Failed to fetch expenses")
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const createExpense = async (expenseData) => {
    try {
      const response = await api.post("/expenses", expenseData)
      dispatch({ type: "ADD_EXPENSE", payload: response.data.expense })
      toast.success("Expense added successfully!")
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create expense"
      toast.error(message)
      return { success: false, message }
    }
  }

  const updateExpense = async (id, expenseData) => {
    try {
      const response = await api.put(`/expenses/${id}`, expenseData)
      dispatch({ type: "UPDATE_EXPENSE", payload: response.data.expense })
      toast.success("Expense updated successfully!")
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update expense"
      toast.error(message)
      return { success: false, message }
    }
  }

  const deleteExpense = async (id) => {
    try {
      await api.delete(`/expenses/${id}`)
      dispatch({ type: "DELETE_EXPENSE", payload: id })
      toast.success("Expense deleted successfully!")
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete expense"
      toast.error(message)
      return { success: false, message }
    }
  }

  const fetchStats = async (year, month) => {
    try {
      const params = new URLSearchParams()
      if (year) params.append("year", year)
      if (month) params.append("month", month)

      const response = await api.get(`/expenses/stats?${params}`)
      dispatch({ type: "SET_STATS", payload: response.data })
    } catch (error) {
      console.error("Fetch stats error:", error)
      toast.error("Failed to fetch statistics")
    }
  }

  const setFilters = (filters) => {
    dispatch({ type: "SET_FILTERS", payload: filters })
  }

  const resetFilters = () => {
    dispatch({ type: "RESET_FILTERS" })
  }

  const value = {
    ...state,
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    fetchStats,
    setFilters,
    resetFilters,
  }

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
}

export const useExpense = () => {
  const context = useContext(ExpenseContext)
  if (!context) {
    throw new Error("useExpense must be used within an ExpenseProvider")
  }
  return context
}
