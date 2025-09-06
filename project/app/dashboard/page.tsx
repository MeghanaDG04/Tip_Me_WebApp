'use client'

import { useFirebaseAuth } from '@/hooks/useFirebaseAuth'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Copy, Plus, TrendingUp, Users, DollarSign, Settings } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface TipButton {
  _id: string
  slug: string
  title: string
  description: string
  suggested_amount: number
  thank_you_message: string
  is_active: boolean
}

interface Analytics {
  total: {
    tips: number
    amount: number
    earnings: number
  }
  last30Days: {
    tips: number
    amount: number
    earnings: number
  }
  recentSupporters: Array<{
    supporter_name: string
    supporter_email: string
    amount: number
    created_at: string
  }>
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [tipButtons, setTipButtons] = useState<TipButton[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [newButton, setNewButton] = useState({
    slug: '',
    title: '',
    description: '',
    suggested_amount: 100,
    thank_you_message: 'Thank you for your support! It means the world to me. 💖'
  })

  useEffect(() => {
    if (status === 'authenticated') {
      fetchTipButtons()
      fetchAnalytics()
    }
  }, [status])

  const fetchTipButtons = async () => {
    try {
      const response = await fetch('/api/tip-buttons')
      if (response.ok) {
        const data = await response.json()
        setTipButtons(data)
      }
    } catch (error) {
      console.error('Failed to fetch tip buttons:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics')
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    }
  }

  const createTipButton = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/tip-buttons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newButton)
      })

      if (response.ok) {
        toast.success('Your tip button has been created.')
        setIsCreateOpen(false)
        setNewButton({
          slug: '',
          title: '',
          description: '',
          suggested_amount: 100,
          thank_you_message: 'Thank you for your support! It means the world to me. 💖'
        })
        fetchTipButtons()
      } else {
        const error = await response.json()
        toast.error(error.error)
      }
    } catch (error) {
      toast.error('Failed to create tip button')
    }
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${type} copied to clipboard`)
  }

  const generateEmbedCode = (slug: string) => {
    return `<iframe src="${window.location.origin}/tip/${slug}" width="300" height="400" frameborder="0"></iframe>`
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (status !== 'authenticated') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {session?.user?.name || session?.user?.email}</p>
            </div>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Tip Button
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Tip Button</DialogTitle>
                </DialogHeader>
                <form onSubmit={createTipButton} className="space-y-4">
                  <div>
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input
                      id="slug"
                      placeholder="my-awesome-content"
                      value={newButton.slug}
                      onChange={(e) => setNewButton({...newButton, slug: e.target.value})}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Your tip page will be at: /tip/{newButton.slug}
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Support My Work"
                      value={newButton.title}
                      onChange={(e) => setNewButton({...newButton, title: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Help me continue creating amazing content..."
                      value={newButton.description}
                      onChange={(e) => setNewButton({...newButton, description: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="amount">Suggested Amount (₹)</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="1"
                      value={newButton.suggested_amount}
                      onChange={(e) => setNewButton({...newButton, suggested_amount: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Thank You Message</Label>
                    <Textarea
                      id="message"
                      value={newButton.thank_you_message}
                      onChange={(e) => setNewButton({...newButton, thank_you_message: e.target.value})}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Create Tip Button
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="buttons">Tip Buttons</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Analytics Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Total Earnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ₹{analytics?.total.earnings.toLocaleString() || 0}
                  </div>
                  <p className="text-xs text-gray-600">
                    From {analytics?.total.tips || 0} tips
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Last 30 Days
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ₹{analytics?.last30Days.earnings.toLocaleString() || 0}
                  </div>
                  <p className="text-xs text-gray-600">
                    {analytics?.last30Days.tips || 0} tips this month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Supporters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analytics?.recentSupporters.length || 0}
                  </div>
                  <p className="text-xs text-gray-600">Recent supporters</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Tip Buttons
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{tipButtons.length}</div>
                  <p className="text-xs text-gray-600">Active buttons</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Supporters */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Supporters</CardTitle>
                <CardDescription>Your latest supporters and their contributions</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics?.recentSupporters.length ? (
                  <div className="space-y-4">
                    {analytics.recentSupporters.map((supporter, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">
                            {supporter.supporter_name || 'Anonymous'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(supporter.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          ₹{supporter.amount}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No supporters yet. Share your tip button to get started!
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="buttons" className="space-y-6">
            <div className="grid gap-6">
              {tipButtons.length ? (
                tipButtons.map((button) => (
                  <Card key={button._id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {button.title}
                            <Badge variant={button.is_active ? "default" : "secondary"}>
                              {button.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </CardTitle>
                          <CardDescription>{button.description}</CardDescription>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">₹{button.suggested_amount}</p>
                          <p className="text-sm text-gray-600">suggested</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label>Share Link</Label>
                          <div className="flex mt-1">
                            <Input
                              value={`${window.location.origin}/tip/${button.slug}`}
                              readOnly
                              className="rounded-r-none"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-l-none"
                              onClick={() => copyToClipboard(`${window.location.origin}/tip/${button.slug}`, 'Link')}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <Label>Embed Code</Label>
                          <div className="flex mt-1">
                            <Input
                              value={generateEmbedCode(button.slug)}
                              readOnly
                              className="rounded-r-none font-mono text-xs"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-l-none"
                              onClick={() => copyToClipboard(generateEmbedCode(button.slug), 'Embed code')}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-gray-500 mb-4">No tip buttons created yet</p>
                    <Button onClick={() => setIsCreateOpen(true)}>
                      Create Your First Tip Button
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Payment Settings
                </CardTitle>
                <CardDescription>
                  Connect your Razorpay account to receive payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h3 className="font-medium text-yellow-800">Connect Razorpay Account</h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      You need to connect your Razorpay account to receive payments from tips.
                    </p>
                    <Button className="mt-3" variant="outline">
                      Connect Razorpay
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}