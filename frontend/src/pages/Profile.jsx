import { useState } from "react"
import { motion } from "framer-motion"
import { User, Mail, Settings, Palette, Globe, Save, Camera } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { useTheme } from "../contexts/ThemeContext"
import { toast } from "react-toastify"
import {
  MotionDiv,
  MotionCard,
  MotionButton,
  PageTransition,
  staggerContainer,
  staggerItem,
} from "../components/ui/MotionWrapper"
import api from "../utils/api"

const Profile = () => {
  const { user, updateUser } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
  name: user?.name || "",
  email: user?.email || "",
  currency: user?.preferences?.currency || "INR", 
  theme: user?.preferences?.theme || "light",
})

 const currencies = [
   { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
 
]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await api.put("/user/profile", {
        name: formData.name,
        preferences: {
          currency: formData.currency,
          theme: formData.theme,
        },
      })

      updateUser(response.data.user)
      toast.success("Profile updated successfully!")
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update profile"
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageTransition>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Header */}
        <MotionDiv className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
          <motion.h1
            className="text-3xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Profile Settings
          </motion.h1>
          <motion.p
            className="text-purple-100 mt-2 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Manage your account settings and preferences
          </motion.p>
        </MotionDiv>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <MotionCard delay={0.2}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Personal Information</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div variants={staggerItem}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input pl-10"
                      placeholder="Enter your full name"
                    />
                  </div>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="input pl-10 bg-gray-50 dark:bg-gray-700 cursor-not-allowed"
                      placeholder="Email cannot be changed"
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Email address cannot be changed for security reasons
                  </p>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preferred Currency
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe className="h-5 w-5 text-gray-400" />
                    </div>
                    <select name="currency" value={formData.currency} onChange={handleChange} className="input pl-10">
                      {currencies.map((currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.symbol} {currency.name} ({currency.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <MotionButton type="submit" disabled={isLoading} className="btn-primary flex items-center space-x-2">
                    <Save className="w-4 h-4" />
                    <span>{isLoading ? "Saving..." : "Save Changes"}</span>
                  </MotionButton>
                </motion.div>
              </form>
            </MotionCard>
          </div>

          {/* Profile Picture & Theme Settings */}
          <div className="space-y-6">
            {/* Profile Picture */}
            <MotionCard delay={0.3}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                  <Camera className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Picture</h3>
              </div>

              <div className="text-center">
                <motion.div
                  className="relative inline-block"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    {user?.avatar ? (
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-white" />
                    )}
                  </div>
                  <motion.button
                    className="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Camera className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </motion.button>
                </motion.div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload new picture</p>
              </div>
            </MotionCard>

            {/* Theme Settings */}
            <MotionCard delay={0.4}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                  <Palette className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Theme Preference
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      type="button"
                      onClick={() => {
                        if (theme === "dark") toggleTheme()
                        setFormData((prev) => ({ ...prev, theme: "light" }))
                      }}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        theme === "light"
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="w-full h-8 bg-white rounded border mb-2"></div>
                      <span className="text-sm font-medium">Light</span>
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={() => {
                        if (theme === "light") toggleTheme()
                        setFormData((prev) => ({ ...prev, theme: "dark" }))
                      }}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        theme === "dark"
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="w-full h-8 bg-gray-800 rounded border mb-2"></div>
                      <span className="text-sm font-medium">Dark</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </MotionCard>

            {/* Account Stats */}
            <MotionCard delay={0.5}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg">
                  <Settings className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Account Stats</h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Member since</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Account type</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Free</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Email verified</span>
                  <span className={`text-sm font-medium ${user?.isEmailVerified ? "text-green-600" : "text-red-600"}`}>
                    {user?.isEmailVerified ? "Verified" : "Not verified"}
                  </span>
                </div>
              </div>
            </MotionCard>
          </div>
        </div>
      </motion.div>
    </PageTransition>
  )
}

export default Profile
