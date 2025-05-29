import { useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { GoogleLogin } from "@react-oauth/google"
import { Eye, EyeOff, Wallet, Mail, Lock, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "../contexts/AuthContext"
import {
  MotionDiv,
  MotionButton,
  MotionInput,
  fadeInUp,
  fadeInDown,
  staggerContainer,
  staggerItem,
} from "../components/ui/MotionWrapper"
import LoadingSpinner from "../components/LoadingSpinner"

const Login = () => {
  const { login, googleLogin, isAuthenticated, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    await login(formData.email, formData.password)
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    await googleLogin(credentialResponse.credential)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <MotionDiv variant={fadeInDown} className="text-center">
          <motion.div className="flex justify-center" whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Wallet className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          <motion.h2 variants={staggerItem} className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </motion.h2>

        </MotionDiv>

        {/* Login Form */}
        <MotionDiv variant={fadeInUp} className="mt-8">
          <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <motion.div variants={staggerItem}>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <MotionInput
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`input pl-10 ${errors.email ? "input-error" : ""}`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </motion.div>

              <motion.div variants={staggerItem}>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <MotionInput
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`input pl-10 pr-10 ${errors.password ? "input-error" : ""}`}
                    placeholder="Enter your password"
                  />
                  <motion.button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </motion.button>
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </motion.div>

              <motion.div variants={staggerItem}>
                <MotionButton
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </MotionButton>
              </motion.div>
              <motion.p variants={staggerItem} className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Or{" "}
                <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  create a new account
                </Link>
              </motion.p>

              {/* Divider */}
              <motion.div variants={staggerItem} className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
                  </div>
                </div>
              </motion.div>


              {/* Google Login */}
              <motion.div variants={staggerItem} className="mt-6">
                <div className="w-full">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => console.error("Google login failed")}
                    theme="outline"
                    size="large"
                    width="100%"
                    text="signin_with"
                  />
                </div>
              </motion.div>
            </form>
          </div>
        </MotionDiv>

        {/* Footer */}

        <MotionDiv variant={fadeInUp} className="text-center">
          <motion.p className="text-xs text-gray-500 dark:text-gray-400" whileHover={{ scale: 1.05 }}>
            Secure login powered by ExpenseTracker
          </motion.p>

        </MotionDiv>
      </motion.div>
    </div>
  )
}

export default Login
