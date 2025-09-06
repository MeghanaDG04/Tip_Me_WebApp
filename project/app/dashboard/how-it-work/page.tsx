import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CheckCircle2, Settings, Zap, Eye, Share2, Shield, BarChart3 } from "lucide-react"

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              How it <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">works</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Create a tip button, share it anywhere, and start receiving secure payments in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signin">
                <Button size="lg" className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/tip/demo">
                <Button variant="outline" size="lg" className="px-8 py-6 text-lg font-semibold border-2 hover:bg-gray-50 transition-all">
                  View a Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step flow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mb-3">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl">1) Create</CardTitle>
              <CardDescription>Sign in and create your first tip button.</CardDescription>
            </CardHeader>
            <CardContent className="text-gray-600 space-y-2">
              <p>• Choose a title, description, and default amounts.</p>
              <p>• Pick a theme that matches your brand.</p>
              <p>• Connect your payout method.</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-3">
                <Share2 className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl">2) Share</CardTitle>
              <CardDescription>Embed on your site or share your link.</CardDescription>
            </CardHeader>
            <CardContent className="text-gray-600 space-y-2">
              <p>• Get a shareable link like <code>/tip/&lt;your-handle&gt;</code>.</p>
              <p>• Paste the embed on blogs, portfolios, or Link-in-bio.</p>
              <p>• Post it on socials to let supporters tip you.</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-3">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl">3) Grow</CardTitle>
              <CardDescription>Track earnings and optimize.</CardDescription>
            </CardHeader>
            <CardContent className="text-gray-600 space-y-2">
              <p>• View tips, top supporters, and conversion.</p>
              <p>• Test amounts, themes, and placements.</p>
              <p>• Thank supporters and build loyalty.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* What you’ll get */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureItem icon={<Settings className="h-5 w-5 text-white" />} title="Customizable">
            Choose colors, amounts, messages, and branding.
          </FeatureItem>
          <FeatureItem icon={<Eye className="h-5 w-5 text-white" />} title="Embeddable">
            Add to any site or link it directly from your bio.
          </FeatureItem>
          <FeatureItem icon={<Shield className="h-5 w-5 text-white" />} title="Secure">
            Bank-grade payments powered by Razorpay.
          </FeatureItem>
          <FeatureItem icon={<BarChart3 className="h-5 w-5 text-white" />} title="Analytics">
            See what works and grow your tips faster.
          </FeatureItem>
        </div>
      </section>

      {/* Quick start checklist */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Quick start checklist</CardTitle>
            <CardDescription>Be tip-ready in under 5 minutes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              "Sign in and create a tip button",
              "Set default amounts and theme",
              "Connect payout method",
              "Share your link or embed the button",
              "Test with a small tip",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-500" />
                <p className="text-gray-700">{item}</p>
              </div>
            ))}
            <div className="pt-2">
              <Link href="/auth/signin">
                <Button className="mt-2">Set up now</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently asked questions</h2>
        <Accordion type="single" collapsible className="bg-white/60 backdrop-blur rounded-xl border">
          <AccordionItem value="q1">
            <AccordionTrigger>Do I need a website to use TipMe?</AccordionTrigger>
            <AccordionContent>
              Nope. You get a shareable page at <code>/tip/&lt;your-handle&gt;</code> you can post anywhere.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>How do payouts work?</AccordionTrigger>
            <AccordionContent>
              Tips are processed securely (Razorpay) and settled to your linked account based on your payout settings.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3">
            <AccordionTrigger>Can I customize the look?</AccordionTrigger>
            <AccordionContent>
              Yes — choose themes, amounts, and messages to match your brand.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q4">
            <AccordionTrigger>Is my data secure?</AccordionTrigger>
            <AccordionContent>
              We use industry-standard security and never store card details. Payment processing is handled by Razorpay.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to try it?</h2>
          <p className="text-lg text-purple-100 mb-8 max-w-2xl mx-auto">
            Create your first tip button and share it with your audience today.
          </p>
          <Link href="/auth/signin">
            <Button size="lg" variant="secondary" className="px-8 py-6 text-lg font-semibold bg-white text-purple-600 hover:bg-gray-50">
              Get started
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

/* --- Helpers --- */
function FeatureItem({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all">
      <CardHeader className="pb-4">
        <div className="w-10 h-10 mx-auto bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mb-3">
          {icon}
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base leading-relaxed">{children}</CardDescription>
      </CardContent>
    </Card>
  )
}
