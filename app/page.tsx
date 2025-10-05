import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Lock, Key } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            <span className="text-xl font-bold">SecureVault</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-balance">
              Your passwords, secured and encrypted
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Generate strong passwords and store them safely with client-side encryption. Your data never leaves your
              device unencrypted.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started
              </Button>
            </Link>
            <Link href="/signin">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="p-6 rounded-lg border border-border bg-card">
              <Key className="h-10 w-10 mb-4 text-black" />
              <h3 className="text-lg font-semibold mb-2">Strong Passwords</h3>
              <p className="text-sm text-muted-foreground">
                Generate cryptographically secure passwords with customizable options
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card">
              <Lock className="h-10 w-10 mb-4 text-black" />
              <h3 className="text-lg font-semibold mb-2">Client-Side Encryption</h3>
              <p className="text-sm text-muted-foreground">
                Your passwords are encrypted in your browser before being stored
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card">
              <Shield className="h-10 w-10 mb-4 text-black" />
              <h3 className="text-lg font-semibold mb-2">Privacy First</h3>
              <p className="text-sm text-muted-foreground">
                We never see your plaintext passwords. Your security is our priority
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>SecureVault - Your privacy-first password manager</p>
        </div>
      </footer>
    </div>
  )
}
