"use client";

import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft, ChevronDown } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL || "https://admin.sarvoclub.com";

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
];

const ForgotPassword: React.FC = () => {
  const [identity, setIdentity] = useState("");
  const [identityType, setIdentityType] = useState<"email" | "phone">("phone");
  const [selectedCountryCode, setSelectedCountryCode] = useState("+91");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      // Combine selected country code with phone number
      const formattedIdentity = identityType === "phone" ? `${selectedCountryCode}${identity}` : identity;

      const payload = {
        identity: formattedIdentity,
        identity_type: identityType,
      };

      console.log("Sending forgot password OTP request with payload:", payload);

      const res = await axios.post(
        `${BASE_URL}/api/v1/user/forget-password/send-otp`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "X-localization": "en",
            zoneId: "a02c55ff-cb84-4bbb-bf91-5300d1766a29",
          },
        }
      );

      console.log("Send OTP response:", res.data);

      if (res.data.response_code === "default_200") {
        setSuccessMessage(`An OTP has been sent to your ${identityType}.`);

        // Navigate to OTP verification with state
        setTimeout(() => {
          navigate("/otp-verification", {
            state: { identity: formattedIdentity, identityType, mode: "forget" },
          });
        }, 2000);
      } else {
        setError(res.data.message || "Failed to send OTP");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to send OTP.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountryCode(countryCode);
    setShowCountryDropdown(false);
  };

  const selectedCountry = countryCodes.find(country => country.code === selectedCountryCode);

  return (
    <div className="flex items-center justify-center p-8 lg:p-12 bg-background min-h-screen">
      <Card className="w-full max-w-md shadow-xl border-border/50">
        <CardHeader className="text-center space-y-3 pb-8">
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Forgot Password
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Enter your email or phone number to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert
              variant="destructive"
              className="mb-4 animate-in fade-in slide-in-from-top-2"
            >
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {successMessage && (
            <Alert className="mb-4 border-green-500/50 bg-green-500/10 animate-in fade-in slide-in-from-top-2">
              <AlertDescription className="text-green-700 dark:text-green-400">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="identity" className="text-sm font-medium">
                Phone Number
              </Label>
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
                  id="identity"
                  type={"tel"}
                  placeholder={"1234567890"}
                  value={identity}
                  onChange={(e) => setIdentity(e.target.value)}
                  required
                  className="h-11 rounded-l-none transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Email option (commented out but available if needed) */}
            {/* <div className="space-y-2">
              <Label className="text-sm font-medium">Identity Type</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="identityType"
                    value="email"
                    checked={identityType === "email"}
                    onChange={() => setIdentityType("email")}
                    className="text-primary"
                  />
                  Email
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="identityType"
                    value="phone"
                    checked={identityType === "phone"}
                    onChange={() => setIdentityType("phone")}
                    className="text-primary"
                  />
                  Phone
                </label>
              </div>
            </div> */}

            <Button
              type="submit"
              className="w-full h-11 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                "Send OTP"
              )}
            </Button>
          </form>

          <div className="text-center pt-4 border-t">
            <Link
              to="/login"
              className="text-sm text-primary hover:underline flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Overlay to close dropdown when clicking outside */}
      {showCountryDropdown && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowCountryDropdown(false)}
        />
      )}
    </div>
  );
};

export default ForgotPassword;