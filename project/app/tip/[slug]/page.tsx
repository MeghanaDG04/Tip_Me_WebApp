'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Heart, Gift } from 'lucide-react'
import { toast } from 'sonner'

declare global {
  interface Window {
    Razorpay: any
  }
}

interface TipButton {
  _id: string
  slug: string
  title: string
  description: string
  suggested_amount: number
  currency: string
  users: {
    name: string
    email: string
  }
}

export default function TipPage() {
  const params = useParams()
  const router = useRouter()
  const [tipButton, setTipButton] = useState<TipButton | null>(null)
  const [amount, setAmount] = useState<number>(0)
  const [customAmount, setCustomAmount] = useState('')
  const [supporterName, setSupporterName] = useState('')
  const [supporterEmail, setSupporterEmail] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  const presetAmounts = [50, 100, 200, 500]

  useEffect(() => {
    fetchTipButton()
    loadRazorpayScript()
  }, [params.slug])

  const fetchTipButton = async () => {
    try {
      const response = await fetch(`/api/tip-buttons/${params.slug}`)
      if (response.ok) {
        const data = await response.json()
        setTipButton(data)
        setAmount(data.suggested_amount)
      } else {
        toast.error('Tip button not found')
      }
    } catch (error) {
      console.error('Failed to fetch tip button:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadRazorpayScript = () => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
  }

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    const numValue = parseInt(value)
    if (numValue > 0) {
      setAmount(numValue)
    }
  }

  const processTip = async () => {
    if (!tipButton || amount < 1) {
      toast.error('Please enter a valid amount')
      return
    }

    setIsProcessing(true)

    try {
      // Create payment order
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: params.slug,
          amount,
          supporter_name: supporterName,
          supporter_email: supporterEmail
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create payment')
      }

      const { payment_id, amount: razorpayAmount, currency } = await response.json()

      // Initialize Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayAmount,
        currency,
        order_id: order_id,
        name: 'TipMe',
        description: `Tip for ${tipButton.title}`,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            })

            if (verifyResponse.ok) {
              router.push(`/thankyou/${response.razorpay_order_id}`)
            } else {
              throw new Error('Payment verification failed')
            }
          } catch (error) {
            toast.error('Payment verification failed')
          }
        },
        prefill: {
          name: supporterName,
          email: supporterEmail,
        },
        theme: {
          color: '#8B5CF6'
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()

    } catch (error) {
      toast.error('Failed to process payment')
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!tipButton) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <p className="text-gray-600 mb-4">Tip button not found</p>
            <Button variant="outline" onClick={() => router.push('/')}>
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {tipButton.title}
          </CardTitle>
          <CardDescription className="text-base leading-relaxed">
            {tipButton.description}
          </CardDescription>
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="text-sm text-gray-600">Supporting</span>
            <Badge variant="secondary" className="font-medium">
              {tipButton.users.name || tipButton.users.email}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Amount Selection */}
          <div>
            <Label className="text-base font-medium">Choose Amount</Label>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {presetAmounts.map((presetAmount) => (
                <Button
                  key={presetAmount}
                  variant={amount === presetAmount && !customAmount ? "default" : "outline"}
                  onClick={() => handleAmountSelect(presetAmount)}
                  className="h-12 font-semibold"
                >
                  ₹{presetAmount}
                </Button>
              ))}
            </div>
            
            <div className="mt-4">
              <Label htmlFor="custom-amount" className="text-sm">Custom Amount</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <Input
                  id="custom-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  className="pl-8 h-12 text-lg font-medium"
                  min="1"
                />
              </div>
            </div>
          </div>

          {/* Supporter Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Your Name (Optional)</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={supporterName}
                onChange={(e) => setSupporterName(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={supporterEmail}
                onChange={(e) => setSupporterEmail(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Tip Button */}
          <Button
            onClick={processTip}
            disabled={isProcessing || amount < 1}
            size="lg"
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg font-semibold"
          >
            {isProcessing ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              <div className="flex items-center">
                <Gift className="h-5 w-5 mr-2" />
                Tip ₹{amount}
              </div>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center leading-relaxed">
            Secure payment powered by Razorpay. Your payment information is safe and encrypted.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}