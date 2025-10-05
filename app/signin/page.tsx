import { AuthForm } from "@/components/auth-form"
import { Shield } from "lucide-react"
import Link from "next/link"

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <Shield className="h-6 w-6" />
        <span className="text-xl font-bold">SecureVault</span>
      </Link>
      <AuthForm mode="signin" />
    </div>
  )
}
