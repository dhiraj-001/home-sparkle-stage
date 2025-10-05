"use client"

import type React from "react"
import { useEffect, useState } from "react"
import axios from "axios"
import { setAuthToken } from "../../../api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, EyeOff, ChevronDown } from "lucide-react"
import heroPainting from "@/assets/hero-ac-repair.jpg"
import { Link, useNavigate } from "react-router-dom"

const BASE_URL = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com"

// Country code options
const countryCodes = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "USA", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
]

interface LoginFormData {
  email_or_phone: string
  password: string
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email_or_phone: "",
    password: "",
  })
  const [loginType, setLoginType] = useState<"email" | "phone">("phone")
  const [selectedCountryCode, setSelectedCountryCode] = useState("+91")
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)
    setLoading(true)

    try {
      // Format the email_or_phone based on login type
      let formattedIdentity = formData.email_or_phone
      if (loginType === "phone") {
        formattedIdentity = `${selectedCountryCode}${formData.email_or_phone}`
      }

      // Generate a unique guest_id (you can use a library like uuid if needed)
      const guest_id = `a64dcd08-e47b-49d0-a785-92ce8ac3f6a6`

      const payload = {
        email_or_phone: formattedIdentity,
        password: formData.password,
        guest_id: guest_id,
        type: loginType
      }

      console.log("Sending login request with payload:", payload)

      const res = await axios.post(`${BASE_URL}/api/v1/customer/auth/login`, payload, {
        headers: {
          "Content-Type": "application/json",
          "X-localization": "en",
          "zoneId": "a02c55ff-cb84-4bbb-bf91-5300d1766a29",
        },
      })

      console.log("Login response:", res.data)

      if (res.data.response_code === "auth_login_200") {
        setSuccessMessage("Login successful!")
        
        // Store token and user data
        const token = res.data.content.token
        const is_active = res.data.content.is_active

        // Store token in localStorage
        localStorage.setItem("demand_token", token)
        localStorage.setItem("user_data", JSON.stringify({
          email_or_phone: formattedIdentity,
          is_active: is_active,
          login_time: new Date().toISOString()
        }))

        // Set auth token for API calls
        setAuthToken(token)

        // Store token in axios default headers for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

        // Redirect to home page or intended destination
        setTimeout(() => {
          navigate("/")
        }, 1500)

      } else {
        setError(res.data.message || "Login failed")
      }
    } catch (err: any) {
      console.error("Login error:", err)
      if (err.response?.data) {
        setError(err.response.data.message || "Login failed. Please check your credentials.")
      } else if (err.request) {
        setError("Network error. Please check your connection.")
      } else {
        setError("An unexpected error occurred.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountryCode(countryCode)
    setShowCountryDropdown(false)
  }

  const selectedCountry = countryCodes.find(country => country.code === selectedCountryCode)

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("demand_token")
    if (token) {
      // User is already logged in, redirect to home
      navigate("/profile")
    }
  }, [navigate])

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Half: Form */}
      <div className="flex items-center justify-center p-8 lg:p-12 bg-background">
        <Card className="w-full max-w-md shadow-xl border-border/50">
          <CardHeader className="text-center space-y-3 pb-8">
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Sign in to continue to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive" className="mb-4 animate-in fade-in slide-in-from-top-2">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {successMessage && (
              <Alert className="mb-4 border-green-500/50 bg-green-500/10 animate-in fade-in slide-in-from-top-2">
                <AlertDescription className="text-green-700 dark:text-green-400">{successMessage}</AlertDescription>
              </Alert>
            )}

            {/* Login Type Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Login with</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="loginType"
                    value="email"
                    checked={loginType === "email"}
                    onChange={() => setLoginType("email")}
                    className="text-primary"
                  />
                  Email
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="loginType"
                    value="phone"
                    checked={loginType === "phone"}
                    onChange={() => setLoginType("phone")}
                    className="text-primary"
                  />
                  Phone
                </label>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email_or_phone" className="text-sm font-medium">
                  {loginType === "email" ? "Email Address" : "Phone Number"}
                </Label>
                
                {loginType === "phone" ? (
                  <div className="flex">
                    {/* Country Code Dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                        className="flex items-center gap-1 h-11 px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm text-muted-foreground hover:bg-muted/80 transition-colors"
                      >
                        <span>{selectedCountry?.flag}</span>
                        <span>{selectedCountryCode}</span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </button>
                      
                      {showCountryDropdown && (
                        <div className="absolute top-full left-0 mt-1 w-48 max-h-60 overflow-y-auto bg-background border border-input rounded-md shadow-lg z-10">
                          {countryCodes.map((country) => (
                            <button
                              key={country.code}
                              type="button"
                              onClick={() => handleCountrySelect(country.code)}
                              className={`flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted transition-colors ${
                                selectedCountryCode === country.code ? 'bg-primary/10 text-primary' : ''
                              }`}
                            >
                              <span className="text-base">{country.flag}</span>
                              <span className="flex-1 text-left">{country.country}</span>
                              <span className="text-muted-foreground">{country.code}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <Input
                      id="email_or_phone"
                      type="tel"
                      name="email_or_phone"
                      placeholder="1234567890"
                      value={formData.email_or_phone}
                      onChange={handleChange}
                      required
                      className="h-11 rounded-l-none transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                ) : (
                  <Input
                    id="email_or_phone"
                    type="email"
                    name="email_or_phone"
                    placeholder="you@example.com"
                    value={formData.email_or_phone}
                    onChange={handleChange}
                    required
                    className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="h-11 pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary font-medium hover:underline">
                  Create one now
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Half: Image - Full height, full width */}
      <div className="hidden lg:block relative min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-accent/20" />
        <img
          src={heroPainting || "/placeholder.svg"}
          alt="Professional painting service"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
          <div className="p-12 text-white space-y-3">
            <h3 className="text-3xl font-bold">Professional Home Services</h3>
            <p className="text-lg text-white/90 max-w-md">
              Quality service at your doorstep. Experience excellence with every booking.
            </p>
          </div>
        </div>
      </div>

      {/* Overlay to close dropdown when clicking outside */}
      {showCountryDropdown && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowCountryDropdown(false)}
        />
      )}
    </div>
  )
}

export default Login