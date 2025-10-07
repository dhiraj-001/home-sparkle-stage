import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Phone } from "lucide-react"

const HelpSupport: React.FC = () => {
  const handleEmailClick = () => {
    window.location.href = "mailto:bgbhairitikkumar@gmail.com"
  }

  const handlePhoneClick = () => {
    window.location.href = "tel:+918468029854"
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Help & Support</h1>
        </div>

        <div className="space-y-8">
          {/* Email Support Section */}
          <Card className="shadow-lg border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">
                Contact us through email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-base text-muted-foreground">
                You can send us email through
              </CardDescription>
              <p className="text-lg font-semibold text-foreground">
                bgbhairitikkumar@gmail.com
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  Typically the support team send you any feedback in 2 hours
                </p>
              </div>
              <Button
                onClick={handleEmailClick}
                className="w-full sm:w-auto h-12 px-8 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                <Mail className="mr-2 h-5 w-5" />
                Email
              </Button>
            </CardContent>
          </Card>

          {/* Phone Support Section */}
          <Card className="shadow-lg border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">
                Contact us through phone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-base text-muted-foreground">
                Contact us through our customer care number
              </CardDescription>
              <p className="text-lg font-semibold text-foreground">
                +91 84680 29854
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  Talk with our customer support executive at any time
                </p>
              </div>
              <Button
                onClick={handlePhoneClick}
                className="w-full sm:w-auto h-12 px-8 text-base font-medium bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                <Phone className="mr-2 h-5 w-5" />
                Call
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleEmailClick}
            className="h-14 px-8 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
            size="lg"
          >
            <Mail className="mr-2 h-5 w-5" />
            Email Support
          </Button>
          <Button
            onClick={handlePhoneClick}
            className="h-14 px-8 text-base font-medium bg-green-600 hover:bg-green-700 text-white shadow-lg"
            size="lg"
          >
            <Phone className="mr-2 h-5 w-5" />
            Call Support
          </Button>
        </div>
      </div>
    </div>
  )
}

export default HelpSupport