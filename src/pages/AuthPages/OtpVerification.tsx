
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import axios from "axios"
import { OtpAPI, UserAPI, setAuthToken } from "../../../api"

interface OtpVerificationProps {
  identity?: string // phone number or email
  identityType?: "phone" | "email"
}

const BASE_URL = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com"

const OtpVerification: React.FC<OtpVerificationProps> = ({ identity: propIdentity, identityType: propIdentityType }) => {
  const location = useLocation()
  const state = location.state as { identity?: string; identityType?: "phone" | "email"; mode?: "register" | "forget" } | undefined

  const identity = propIdentity || state?.identity || ""
  const identityType = propIdentityType || state?.identityType || "phone"
  const mode = state?.mode || "register"
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [resendCooldown, setResendCooldown] = useState(60)
  const navigate = useNavigate()

  const handleSendOtp = async () => {
    setLoading(true)
    setError(null)
    try {
      if (mode === 'register') {
        await OtpAPI.sendVerificationOtp({ identity, identity_type: identityType, check_user: true })
      } else {
        const payload = { identity, identity_type: identityType }
        console.log("Sending forget password OTP request with payload:", payload)
        const res = await axios.post(`${BASE_URL}/api/v1/user/forget-password/send-otp`, payload, {
          headers: {
            "Content-Type": "application/json",
            "X-localization": "en",
            "zoneId": "a02c55ff-cb84-4bbb-bf91-5300d1766a29",
          },
        })
        console.log("Send forget OTP response:", res.data)
        if (res.data.response_code !== "default_200") {
          throw new Error(res.data.message || "Failed to send OTP")
        }
      }
      setSuccessMessage(`An OTP has been sent to your ${identityType}.`)
      setResendCooldown(60)
      const interval = setInterval(() => {
        setResendCooldown(prev => {
          if (prev === 1) clearInterval(interval)
          return prev - 1
        })
      }, 1000)
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to send OTP.`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (mode === 'register') {
      handleSendOtp()
    }
  }, [mode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (mode === 'register') {
        const res = await OtpAPI.verifyOtp({ identity, otp, identity_type: identityType })
        if (res.data.response_code === "default_200" && res.data.content?.token) {
          setAuthToken(res.data.content.token)
          // Fetch user data after setting token
          await UserAPI.info()
          setSuccessMessage("Verification successful! Redirecting...")
          setTimeout(() => navigate("/"), 2000)
        } else {
          setError(res.data.message || "OTP verification failed.")
        }
      } else {
        const payload = { identity, otp, identity_type: identityType }
        console.log("Verifying forget password OTP with payload:", payload)
        const res = await axios.post(`${BASE_URL}/api/v1/user/forget-password/verify-otp`, payload, {
          headers: {
            "Content-Type": "application/json",
            "X-localization": "en",
            "zoneId": "a02c55ff-cb84-4bbb-bf91-5300d1766a29",
          },
        })
        console.log("Verify forget OTP response:", res.data)
        if (res.data.response_code === "default_200") {
          setSuccessMessage("OTP verified! Redirecting to reset password...")
          setTimeout(() => navigate("/reset-password", { state: { identity, identityType, otp } }), 2000)
        } else {
          setError(res.data.message || "OTP verification failed.")
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred during OTP verification.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center p-8 lg:p-12 bg-background">
      <Card className="w-full max-w-md shadow-xl border-border/50">
        <CardHeader className="space-y-3 pb-6 text-center">
          <CardTitle className="text-2xl font-bold">
            {mode === 'register' ? 'Verify Your Account' : 'Verify OTP'}
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Enter the 6-digit code sent to {identity}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {successMessage && !error && (
            <Alert className="mb-6 border-success text-success">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading || otp.length < 6}>
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Verify"}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={resendCooldown > 0 || loading}
                className="text-sm text-primary hover:underline disabled:text-muted-foreground disabled:cursor-not-allowed"
              >
                {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : "Resend OTP"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default OtpVerification
