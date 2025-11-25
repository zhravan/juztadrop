import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Building2, Sparkles, Heart, Search } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#f0f9ff] via-[#e0f2fe]/30 to-white">
        {/* Decorative droplet shape */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-drop-100/40 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

        <div className="container mx-auto px-4 lg:px-8 py-16 md:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 relative z-10">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                  <span className="text-[#1e293b]">Small Actions,</span>
                  <br />
                  <span className="text-drop-500">Rippling</span>
                  <span className="text-[#1e293b]"> Impact</span>
                </h1>
                <p className="text-lg md:text-xl text-[#64748b] leading-relaxed max-w-xl">
                  Connect with local NGOs and charities that need your help. Every volunteer hour and donation is{' '}
                  <span className="text-drop-500 font-medium">just a drop</span> that creates ripples of positive change.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-drop-500 hover:bg-drop-600 text-white text-base" asChild>
                  <Link href="/opportunities">
                    <Search className="h-5 w-5 mr-2" />
                    Find Opportunities
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-drop-500 text-drop-500 hover:bg-drop-50 text-base" asChild>
                  <Link href="/organization/register">Register Organization</Link>
                </Button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative lg:h-[500px] h-[400px]">
              <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl overflow-hidden border-8 border-white">
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-center p-8">
                    <Users className="h-24 w-24 text-drop-500 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">Volunteers making an impact</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#1e293b]">How It Works</h2>
            <p className="text-lg md:text-xl text-[#64748b] max-w-2xl mx-auto">
              Making a difference is simple. Follow these steps to start your volunteering journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
            <Card className="relative border-2 hover:border-drop-200 transition-all hover:shadow-lg bg-white">
              <CardHeader className="space-y-4">
                <div className="h-14 w-14 rounded-xl bg-drop-100 flex items-center justify-center">
                  <Users className="h-7 w-7 text-drop-500" />
                </div>
                <CardTitle className="text-xl text-[#1e293b]">Sign Up</CardTitle>
                <CardDescription className="text-base text-[#64748b]">
                  Create your account as a volunteer or organization in minutes
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="relative border-2 hover:border-drop-200 transition-all hover:shadow-lg bg-white">
              <CardHeader className="space-y-4">
                <div className="h-14 w-14 rounded-xl bg-drop-100 flex items-center justify-center">
                  <Sparkles className="h-7 w-7 text-drop-500" />
                </div>
                <CardTitle className="text-xl text-[#1e293b]">Discover</CardTitle>
                <CardDescription className="text-base text-[#64748b]">
                  Browse opportunities that match your skills and interests
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="relative border-2 hover:border-drop-200 transition-all hover:shadow-lg bg-white">
              <CardHeader className="space-y-4">
                <div className="h-14 w-14 rounded-xl bg-drop-100 flex items-center justify-center">
                  <Heart className="h-7 w-7 text-drop-500" />
                </div>
                <CardTitle className="text-xl text-[#1e293b]">Apply</CardTitle>
                <CardDescription className="text-base text-[#64748b]">
                  Connect with organizations and apply to make an impact
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="relative border-2 hover:border-drop-200 transition-all hover:shadow-lg bg-white">
              <CardHeader className="space-y-4">
                <div className="h-14 w-14 rounded-xl bg-drop-100 flex items-center justify-center">
                  <Building2 className="h-7 w-7 text-drop-500" />
                </div>
                <CardTitle className="text-xl text-[#1e293b]">Contribute</CardTitle>
                <CardDescription className="text-base text-[#64748b]">
                  Start volunteering and create lasting positive change
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-drop-500 to-drop-600 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Ready to Make a Difference?
            </h2>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              Join thousands of volunteers and organizations creating positive change in communities worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button size="lg" className="w-full sm:w-auto text-base bg-white text-drop-500 hover:bg-gray-50" asChild>
                <Link href="/volunteer/register">Volunteer Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base border-2 border-white text-white hover:bg-white/10" asChild>
                <Link href="/organization/register">Register Organization</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
