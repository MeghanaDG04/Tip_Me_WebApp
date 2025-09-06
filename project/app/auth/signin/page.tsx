'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { googleLogin, logIn, signUp } from '@/services/authService'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [mode, setMode] = useState<'login'|'signup'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      if (mode === 'login') {
        await logIn(email, password)
      } else {
        await signUp(email, password, name || email.split('@')[0])
      }
    } catch (err:any) {
      setError(err?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Link>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-2xl font-bold text-gray-900">{mode === 'login' ? 'Welcome back' : 'Create your account'}</CardTitle>
            <CardDescription className="text-gray-600">
              {mode === 'login' ? 'Log in with email/password or Google' : 'Sign up with email/password or Google'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••" />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Please wait...' : (mode === 'login' ? 'Log In' : 'Sign Up')}
              </Button>
            </form>

            <div className="relative flex items-center justify-center">
              <span className="px-2 text-xs uppercase tracking-wider text-gray-400 bg-white">or</span>
            </div>

            <Button type="button" onClick={()=>googleLogin()} className="w-full" variant="outline">
              Continue with Google
            </Button>

            <button className="w-full text-sm text-gray-600 hover:underline" onClick={()=>setMode(mode==='login'?'signup':'login')}>
              {mode==='login' ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
