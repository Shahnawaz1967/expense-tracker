import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Search, Filter, Edit, Trash2, Calendar, Receipt } from "lucide-react"
import { useExpense } from "../contexts/ExpenseContext"
import { MotionCard, MotionButton, PageTransition, staggerContainer, staggerItem } from "../components/ui/MotionWrapper"
import LoadingSpinner from "../components/LoadingSpinner"
import ExpenseModal from "../components/ExpenseModal"

const Expenses = () => {
  const { expenses, isLoading, pagination, filters, fetchExpenses, deleteExpense, setFilters, resetFilters } =
    useExpense()

  const [showModal, setShowModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [localFilters, setLocalFilters] = useState(filters)

  useEffect(() => {
    fetchExpenses(1, filters)
  }, [filters])

  const categories = [
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
  ]

  const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount)
}

  const handleFilterChange = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    setFilters(localFilters)
  }

  const clearFilters = () => {
    setLocalFilters({
      category: "all",
      startDate: "",
      endDate: "",
      search: "",
    })
    resetFilters()
  }

  const handleEdit = (expense) => {
    setEditingExpense(expense)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      await deleteExpense(id)
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
    setEditingExpense(null)
  }

  const handlePageChange = (page) => {
    fetchExpenses(page, filters)
  }

  return (
    <PageTransition>
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
        {/* Header */}
        <motion.div variants={staggerItem} className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Expenses</h1>
          <MotionButton onClick={() => setShowModal(true)} className="btn-primary flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </MotionButton>
        </motion.div>

        {/* Filters */}
        <MotionCard delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search expenses..."
                  value={localFilters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select
                value={localFilters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="input"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
              <input
                type="date"
                value={localFilters.startDate}
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
              <input
                type="date"
                value={localFilters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                className="input"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <MotionButton onClick={clearFilters} className="btn-secondary">
              Clear
            </MotionButton>
            <MotionButton onClick={applyFilters} className="btn-primary flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Apply Filters</span>
            </MotionButton>
          </div>
        </MotionCard>

        {/* Expenses List */}
        <MotionCard delay={0.2}>
          <AnimatePresence>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : expenses.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Payment Method
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {expenses.map((expense, index) => (
                      <motion.tr
                        key={expense._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{expense.title}</div>
                            {expense.description && (
                              <div className="text-sm text-gray-500 dark:text-gray-400">{expense.description}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="badge badge-blue">{expense.category}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {formatCurrency(expense.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(expense.date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {expense.paymentMethod}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <motion.button
                              onClick={() => handleEdit(expense)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Edit className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              onClick={() => handleDelete(expense._id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            ) : (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Receipt className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">No expenses found</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Start by adding your first expense or adjust your filters.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </MotionCard>

        {/* Expense Modal */}
        <AnimatePresence>
          {showModal && (
            <ExpenseModal
              expense={editingExpense}
              onClose={handleModalClose}
              onSuccess={() => {
                handleModalClose()
                fetchExpenses(pagination.currentPage, filters)
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </PageTransition>
  )
}

export default Expenses
