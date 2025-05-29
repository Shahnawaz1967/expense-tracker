import { createContext, useContext, useReducer, useEffect } from "react"
import { toast } from "react-toastify"
import api from "../utils/api"

const AuthContext = createContext()

const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  isLoading: true,
  isAuthenticated: false,
}

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
    case "REGISTER_SUCCESS":
      localStorage.setItem("token", action.payload.token)
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      }
    case "LOGOUT":
    case "AUTH_ERROR":
      localStorage.removeItem("token")
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      }
    case "USER_LOADED":
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
      }
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      }
    case "UPDATE_USER":
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Load user on app start
  useEffect(() => {
    if (state.token) {
      loadUser()
    } else {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [])

  // Set auth token in axios headers
  useEffect(() => {
    if (state.token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${state.token}`
    } else {
      delete api.defaults.headers.common["Authorization"]
    }
  }, [state.token])

  const loadUser = async () => {
    try {
      const response = await api.get("/auth/me")
      dispatch({ type: "USER_LOADED", payload: response.data })
    } catch (error) {
      console.error("Load user error:", error)
      dispatch({ type: "AUTH_ERROR" })
    }
  }

  const login = async (email, password) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await api.post("/auth/login", { email, password })

      dispatch({ type: "LOGIN_SUCCESS", payload: response.data })
      toast.success("Login successful!")
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || "Login failed"
      dispatch({ type: "AUTH_ERROR" })
      toast.error(message)
      return { success: false, message }
    }
  }

  const register = async (name, email, password) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await api.post("/auth/register", { name, email, password })

      dispatch({ type: "REGISTER_SUCCESS", payload: response.data })
      toast.success("Registration successful!")
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed"
      dispatch({ type: "AUTH_ERROR" })
      toast.error(message)
      return { success: false, message }
    }
  }

  const googleLogin = async (credential) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await api.post("/auth/google", { credential })

      dispatch({ type: "LOGIN_SUCCESS", payload: response.data })
      toast.success("Google login successful!")
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || "Google login failed"
      dispatch({ type: "AUTH_ERROR" })
      toast.error(message)
      return { success: false, message }
    }
  }

  const logout = () => {
    dispatch({ type: "LOGOUT" })
    toast.info("Logged out successfully")
  }

  const updateUser = (userData) => {
    dispatch({ type: "UPDATE_USER", payload: userData })
  }

  const value = {
    ...state,
    login,
    register,
    googleLogin,
    logout,
    updateUser,
    loadUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
