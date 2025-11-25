import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-10 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Just a Drop</h1>
          <p className="text-muted-foreground">
            Connect volunteers with organizations that need help
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>For Volunteers</CardTitle>
              <CardDescription>
                Find meaningful opportunities to make a difference
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Browse and apply for volunteer opportunities that match your skills and interests.
              </p>
              <Button className="w-full">Browse Opportunities</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>For Organizations</CardTitle>
              <CardDescription>
                Post opportunities and find dedicated volunteers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Create and manage volunteer opportunities for your organization.
              </p>
              <Button variant="outline" className="w-full">
                Register Organization
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>Join our community today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Enter your email" type="email" />
              <Button className="w-full">Sign Up</Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 p-6 border rounded-lg bg-card">
          <h2 className="text-2xl font-semibold mb-4">UI Components Preview</h2>
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Button>Primary Button</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input placeholder="Text input" />
              <Input placeholder="Email input" type="email" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
