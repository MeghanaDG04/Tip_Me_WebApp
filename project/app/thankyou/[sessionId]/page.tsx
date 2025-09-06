'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Heart, Share2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

interface ThankYouData {
  tip: {
    amount: number
    currency: string
    supporter_name: string
    supporter_email: string
  }
  tipButton: {
    title: string
    thank_you_message: string
    slug: string
    users: {
      name: string
      email: string
    }
  }
}

export default function ThankYouPage() {
  const params = useParams()
  const [data, setData] = useState<ThankYouData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchThankYouData()
  }, [params.sessionId])

  const fetchThankYouData = async () => {
    try {
      const response = await fetch(`/api/thankyou/${params.sessionId}`)
      if (response.ok) {
        const thankYouData = await response.json()
        setData(thankYouData)
      }
    } catch (error) {
      console.error('Failed to fetch thank you data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const shareToTwitter = () => {
    const text = `I just supported ${data?.tipButton.users.name} with a tip! 💖`
    const url = `${window.location.origin}/tip/${data?.tipButton.slug}`
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
    window.open(twitterUrl, '_blank')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <p className="text-gray-600 mb-4">Thank you page not found</p>
            <Link href="/">
              <Button variant="outline">Go Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-2xl border-0">
        <CardHeader className="text-center pb-8">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          
          <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
            Thank You! 🎉
          </CardTitle>
          
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg text-gray-600">Your tip of</span>
              <Badge variant="default" className="text-lg px-3 py-1">
                ₹{data.tip.amount}
              </Badge>
              <span className="text-lg text-gray-600">was successful!</span>
            </div>
            
            <div className="flex items-center justify-center gap-2">
              <span className="text-gray-600">Supporting</span>
              <Badge variant="secondary" className="font-medium">
                {data.tipButton.users.name || data.tipButton.users.email}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Creator's Thank You Message */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-100">
            <div className="flex items-start gap-3">
              <Heart className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Message from {data.tipButton.users.name}:
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {data.tipButton.thank_you_message}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={shareToTwitter}
              variant="outline"
              size="lg"
              className="w-full h-12 border-2 hover:bg-gray-50"
            >
              <Share2 className="h-5 w-5 mr-2" />
              Share Your Support
            </Button>

            <Link href={`/tip/${data.tipButton.slug}`}>
              <Button
                variant="outline"
                size="lg"
                className="w-full h-12 border-2 hover:bg-gray-50"
              >
                <Heart className="h-5 w-5 mr-2" />
                Tip Again
              </Button>
            </Link>

            <Link href="/">
              <Button
                size="lg"
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Create Your Own Tip Button
              </Button>
            </Link>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500 leading-relaxed">
              Receipt and confirmation have been sent to your email if provided.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}