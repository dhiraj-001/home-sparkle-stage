import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle2, XCircle, Eye, EyeOff } from "lucide-react"
import heroPainting from "@/assets/hero-painting.jpg"
import { Link } from "react-router-dom"
import { AuthAPI } from "../../../api"
import OtpVerification from "./OtpVerification"

interface RegisterFormData {
  first_name: string
  last_name: string
  email: string
  phone: string
  country_code: string
  password: string
  confirm_password: string
}

const calculatePasswordStrength = (password: string): { strength: number; label: string; color: string } => {
  let strength = 0
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[^a-zA-Z0-9]/.test(password)) strength++

  if (strength <= 2) return { strength, label: "Weak", color: "bg-destructive" }
  if (strength <= 3) return { strength, label: "Fair", color: "bg-warning" }
  if (strength <= 4) return { strength, label: "Good", color: "bg-success" }
  return { strength, label: "Strong", color: "bg-success" }
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    country_code: "+91",
    password: "",
    confirm_password: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [existingUserError, setExistingUserError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)

  const passwordStrength = formData.password ? calculatePasswordStrength(formData.password) : null
  const passwordsMatch =
    formData.password && formData.confirm_password && formData.password === formData.confirm_password

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (existingUserError) setExistingUserError(null)
    if (error) setError(null)
  }

  const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if ((name !== "email" && name !== "phone") || !value) return

    const identity = name === "phone" ? `${formData.country_code}${value}` : value

    try {
      const payload = {
        identity_type: name,
        identity: identity,
      }
      const res = await AuthAPI.checkExistingUser(payload)
      if (res.data.is_found) {
        setExistingUserError(`This ${name} is already registered.`)
      } else {
        setExistingUserError(null)
      }
    } catch (err) {
      console.error("Failed to check existing user:", err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (existingUserError) {
      setError(existingUserError)
      return
    }

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    setLoading(true)

    try {
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: `${formData.country_code}${formData.phone}`,
        password: formData.password,
        confirm_password: formData.confirm_password,
      }

      await AuthAPI.register(payload)
      setIsRegistered(true)
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred during registration.")
    } finally {
      setLoading(false)
    }
  }

  if (isRegistered) {
    return <OtpVerification identity={`${formData.country_code}${formData.phone}`} identityType="phone" />
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:block relative min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-accent/20" />
        <img
          src={heroPainting || "/placeholder.svg"}
          alt="Professional home services"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
          <div className="p-12 text-white space-y-3">
            <h3 className="text-3xl font-bold">Professional Home Services</h3>
            <p className="text-lg text-white/90 max-w-md">
              Join thousands of satisfied customers who trust us for quality home services
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 lg:p-12 bg-background overflow-y-auto">
        <Card className="w-full max-w-lg shadow-xl border-border/50 my-8">
          <CardHeader className="space-y-3 pb-6">
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Create Account
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Join us to book home services easily
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {(error || existingUserError) && (
              <Alert variant="destructive" className="mb-6 animate-in fade-in slide-in-from-top-2">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error || existingUserError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name" className="text-sm font-medium">
                    First Name
                  </Label>
                  <Input
                    id="first_name"
                    type="text"
                    name="first_name"
                    placeholder="John"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    className="transition-all focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name" className="text-sm font-medium">
                    Last Name
                  </Label>
                  <Input
                    id="last_name"
                    type="text"
                    name="last_name"
                    placeholder="Doe"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    className="transition-all focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className="transition-all focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-[100px_1fr] gap-3">
                <div className="space-y-2">
                  <Label htmlFor="country_code" className="text-sm font-medium">
                    Code
                  </Label>
                  <Input
                    id="country_code"
                    type="text"
                    name="country_code"
                    placeholder="+91"
                    value={formData.country_code}
                    onChange={handleChange}
                    required
                    className="transition-all focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className="transition-all focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="pr-10 transition-all focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordStrength && (
                  <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            i < passwordStrength.strength ? passwordStrength.color : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Password strength: <span className="font-medium">{passwordStrength.label}</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm_password" className="text-sm font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirm_password"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm_password"
                    placeholder="Re-enter your password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    required
                    className="pr-10 transition-all focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {formData.confirm_password && (
                  <div className="flex items-center gap-2 text-xs animate-in fade-in slide-in-from-top-1">
                    {passwordsMatch ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                        <span className="text-success font-medium">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3.5 w-3.5 text-destructive" />
                        <span className="text-destructive font-medium">Passwords do not match</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                disabled={loading || !!existingUserError}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

              <div className="text-center pt-2">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="font-medium text-primary hover:underline transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Register
