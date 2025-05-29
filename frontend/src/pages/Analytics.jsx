"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts"
import { TrendingUp, DollarSign, Calendar, BarChart3 } from "lucide-react"
import { useExpense } from "../contexts/ExpenseContext"
import { MotionCard, PageTransition, staggerContainer, staggerItem } from "../components/ui/MotionWrapper"
import LoadingSpinner from "../components/LoadingSpinner"

const Analytics = () => {
  const { stats, fetchStats } = useExpense()
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState("")

  useEffect(() => {
    fetchStats(selectedYear, selectedMonth)
  }, [selectedYear, selectedMonth])

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4", "#84CC16", "#F97316"]

  const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount)
}

  const getMonthName = (monthNumber) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    return months[monthNumber - 1]
  }

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let i = currentYear; i >= currentYear - 5; i--) {
      years.push(i)
    }
    return years
  }

  const generateMonthOptions = () => {
    return Array.from({ length: 12 }, (_, i) => ({
      value: i + 1,
      label: getMonthName(i + 1),
    }))
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const monthlyData = stats.monthlyStats.map((item) => ({
    month: getMonthName(item._id),
    amount: item.total,
    count: item.count,
  }))

  const categoryData = stats.categoryStats.map((item, index) => ({
    name: item._id,
    value: item.total,
    count: item.count,
    color: COLORS[index % COLORS.length],
  }))

  const totalSpent = stats.totalExpenses.total
  const totalTransactions = stats.totalExpenses.count
  const avgPerTransaction = totalTransactions > 0 ? totalSpent / totalTransactions : 0

  return (
    <PageTransition>
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
        {/* Header */}
        <motion.div variants={staggerItem} className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          </div>

          <div className="flex space-x-4">
            <motion.select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number.parseInt(e.target.value))}
              className="input w-auto"
              whileFocus={{ scale: 1.02 }}
            >
              {generateYearOptions().map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </motion.select>

            <motion.select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="input w-auto"
              whileFocus={{ scale: 1.02 }}
            >
              <option value="">All Months</option>
              {generateMonthOptions().map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </motion.select>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MotionCard delay={0.1}>
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Spent</p>
                <motion.p
                  className="text-2xl font-bold text-gray-900 dark:text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {formatCurrency(totalSpent)}
                </motion.p>
              </div>
            </div>
          </MotionCard>

          <MotionCard delay={0.2}>
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Transactions</p>
                <motion.p
                  className="text-2xl font-bold text-gray-900 dark:text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {totalTransactions}
                </motion.p>
              </div>
            </div>
          </MotionCard>

          <MotionCard delay={0.3}>
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg per Transaction</p>
                <motion.p
                  className="text-2xl font-bold text-gray-900 dark:text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {formatCurrency(avgPerTransaction)}
                </motion.p>
              </div>
            </div>
          </MotionCard>
        </motion.div>

        {/* Charts Grid */}
        <motion.div variants={staggerContainer} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Distribution */}
          <MotionCard delay={0.4}>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Spending by Category</h3>
            <AnimatePresence>
              {categoryData.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="space-y-4"
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={800}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Category Legend */}
                  <div className="grid grid-cols-2 gap-2">
                    {categoryData.map((category, index) => (
                      <motion.div
                        key={category.name}
                        className="flex items-center space-x-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                      >
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                        <span className="text-sm text-gray-600 dark:text-gray-400 truncate">{category.name}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatCurrency(category.value)}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  className="flex items-center justify-center h-64 text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  No data available
                </motion.div>
              )}
            </AnimatePresence>
          </MotionCard>

          {/* Monthly Trends */}
          <MotionCard delay={0.5}>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Monthly Spending Trends</h3>
            <AnimatePresence>
              {monthlyData.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                      <XAxis dataKey="month" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "none",
                          borderRadius: "8px",
                          color: "#F9FAFB",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        dot={{ fill: "#3B82F6", strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8, stroke: "#3B82F6", strokeWidth: 2 }}
                        animationDuration={1000}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>
              ) : (
                <motion.div
                  className="flex items-center justify-center h-64 text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  No data available
                </motion.div>
              )}
            </AnimatePresence>
          </MotionCard>
        </motion.div>

        {/* Detailed Analytics */}
        <motion.div variants={staggerContainer} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Breakdown Table */}
          <MotionCard delay={0.6}>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Category Breakdown</h3>
            <AnimatePresence>
              {categoryData.length > 0 ? (
                <motion.div
                  className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          %
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {categoryData.map((category, index) => (
                        <motion.tr
                          key={category.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + index * 0.05 }}
                          whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: category.color }} />
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{category.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {formatCurrency(category.value)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {((category.value / totalSpent) * 100).toFixed(1)}%
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              ) : (
                <motion.div
                  className="text-center py-8 text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  No category data available
                </motion.div>
              )}
            </AnimatePresence>
          </MotionCard>

          {/* Monthly Bar Chart */}
          <MotionCard delay={0.7}>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Monthly Comparison</h3>
            <AnimatePresence>
              {monthlyData.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                      <XAxis dataKey="month" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip
                        formatter={(value, name) => [
                          name === "amount" ? formatCurrency(value) : value,
                          name === "amount" ? "Amount" : "Transactions",
                        ]}
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "none",
                          borderRadius: "8px",
                          color: "#F9FAFB",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="amount" fill="#3B82F6" name="Amount" animationDuration={800} />
                      <Bar dataKey="count" fill="#10B981" name="Transactions" animationDuration={800} />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              ) : (
                <motion.div
                  className="flex items-center justify-center h-64 text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  No monthly data available
                </motion.div>
              )}
            </AnimatePresence>
          </MotionCard>
        </motion.div>
      </motion.div>
    </PageTransition>
  )
}

export default Analytics
