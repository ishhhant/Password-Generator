"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PasswordGenerator } from "@/components/password-generator"
import { Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { encryptVaultItem } from "@/lib/vault-encryption"
import type { VaultItem } from "@/lib/vault-encryption"

export default function GeneratePage() {
  const [masterPassword, setMasterPassword] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const handleSaveToVault = async (password: string) => {
    const mp = prompt("Enter your master password to save this password to your vault:")
    if (!mp) return

    setSaving(true)
    try {
      const item: VaultItem = {
        title: "Generated Password",
        username: "",
        password: password,
        url: "",
        notes: `Generated on ${new Date().toLocaleString()}`,
      }

      const { encryptedData, salt } = await encryptVaultItem(item, mp)

      const response = await fetch("/api/vault", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ encryptedData, salt }),
      })

      if (!response.ok) throw new Error("Failed to save")

      alert("Password saved to vault!")
      router.push("/vault")
    } catch (error) {
      console.error("[v0] Save to vault error:", error)
      alert("Failed to save password. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/vault" className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            <span className="text-xl font-bold">SecureVault</span>
          </Link>
          <Link href="/vault">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Vault
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Generate Password</h1>
            <p className="text-muted-foreground">Create a strong, cryptographically secure password</p>
          </div>
          <PasswordGenerator onSave={saving ? undefined : handleSaveToVault} />
        </div>
      </main>
    </div>
  )
}
