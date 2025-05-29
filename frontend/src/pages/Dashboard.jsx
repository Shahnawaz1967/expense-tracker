import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from "recharts"
import { DollarSign, TrendingUp, Receipt, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { useExpense } from "../contexts/ExpenseContext"
import { useAuth } from "../contexts/AuthContext"
import { MotionDiv, MotionCard, PageTransition, staggerContainer, staggerItem } from "../components/ui/MotionWrapper"
import LoadingSpinner from "../components/LoadingSpinner"

const Dashboard = () => {
  const { user } = useAuth()
  const { stats, fetchStats, expenses, fetchExpenses } = useExpense()
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  useEffect(() => {
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = selectedPeriod === "month" ? currentDate.getMonth() + 1 : null

    fetchStats(year, month)
    fetchExpenses(1, { limit: 5 })
  }, [selectedPeriod])

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4", "#84CC16", "#F97316"]

  const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount)
}

  const getMonthName = (monthNumber) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return months[monthNumber - 1]
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  const monthlyData = stats.monthlyStats.map((item) => ({
    month: getMonthName(item._id),
    amount: item.total,
  }))

  const categoryData = stats.categoryStats.map((item) => ({
    name: item._id,
    value: item.total,
    count: item.count,
  }))

  const StatCard = ({ icon: Icon, title, value, change, color, delay }) => (
    <MotionCard delay={delay} className="relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <motion.p
            className="text-2xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.2 }}
          >
            {value}
          </motion.p>
          {change && (
            <motion.div
              className={`flex items-center mt-1 text-sm ${change > 0 ? "text-green-600" : "text-red-600"}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.4 }}
            >
              {change > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {Math.abs(change)}% from last month
            </motion.div>
          )}
        </div>
        <motion.div
          className={`p-3 rounded-xl ${color}`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>
      </div>
    </MotionCard>
  )

  return (
    <PageTransition>
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
        {/* Welcome Section */}
        <MotionDiv className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
          <motion.div
            className="absolute inset-0 bg-black opacity-10"
            animate={{
              background: [
                "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 40% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
              ],
            }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
          <div className="relative z-10">
            <motion.h1
              className="text-3xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Welcome back, {user?.name}! 👋
            </motion.h1>
            <motion.p
              className="text-blue-100 mt-2 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Here's your expense overview for today
            </motion.p>
          </div>
        </MotionDiv>

        {/* Period Selector */}
        <motion.div variants={staggerItem} className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
          <motion.select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="input w-auto"
            whileFocus={{ scale: 1.02 }}
          >
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </motion.select>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={DollarSign}
            title="Total Spent"
            value={formatCurrency(stats.totalExpenses.total)}
            change={12.5}
            color="bg-gradient-to-r from-green-500 to-emerald-500"
            delay={0}
          />
          <StatCard
            icon={Receipt}
            title="Total Transactions"
            value={stats.totalExpenses.count}
            change={8.2}
            color="bg-gradient-to-r from-blue-500 to-cyan-500"
            delay={0.1}
          />
          <StatCard
            icon={TrendingUp}
            title="Avg per Transaction"
            value={formatCurrency(
              stats.totalExpenses.count > 0 ? stats.totalExpenses.total / stats.totalExpenses.count : 0,
            )}
            change={-3.1}
            color="bg-gradient-to-r from-yellow-500 to-orange-500"
            delay={0.2}
          />
          <StatCard
            icon={Calendar}
            title="Top Category"
            value={categoryData.length > 0 ? categoryData[0].name : "N/A"}
            color="bg-gradient-to-r from-purple-500 to-pink-500"
            delay={0.3}
          />
        </motion.div>

        {/* Charts */}
        <motion.div variants={staggerContainer} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Pie Chart */}
          <MotionCard delay={0.4} className="relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Expenses by Category</h3>
              <motion.div
                className="w-3 h-3 bg-blue-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
            </div>
            <AnimatePresence>
              {categoryData.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={800}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                    </PieChart>
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

          {/* Monthly Trend Chart */}
          <MotionCard delay={0.5} className="relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Monthly Trends</h3>
              <motion.div
                className="w-3 h-3 bg-green-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
              />
            </div>
            <AnimatePresence>
              {monthlyData.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
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

        {/* Recent Expenses */}
        <MotionCard delay={0.6}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Expenses</h3>
            <motion.button
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All
            </motion.button>
          </div>
          <AnimatePresence>
            {expenses.length > 0 ? (
              <motion.div
                className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
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
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {expenses.slice(0, 5).map((expense, index) => (
                      <motion.tr
                        key={expense._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {expense.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="badge badge-blue">{expense.category}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(expense.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(expense.date).toLocaleDateString()}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            ) : (
              <motion.div
                className="text-center py-12 text-gray-500"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Receipt className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">No expenses found</h3>
                <p>Start by adding your first expense!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </MotionCard>
      </motion.div>
    </PageTransition>
  )
}

export default Dashboard
