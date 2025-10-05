"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Shield, Plus, Key, LogOut } from "lucide-react"
import Link from "next/link"
import { VaultItemCard } from "@/components/vault-item-card"
import { VaultItemForm } from "@/components/vault-item-form"
import { MasterPasswordPrompt } from "@/components/master-password-prompt"
import { type VaultItem, encryptVaultItem, decryptVaultItem } from "@/lib/vault-encryption"
import { Input } from "@/components/ui/input"

export default function VaultPage() {
  const [masterPassword, setMasterPassword] = useState<string | null>(null)
  const [items, setItems] = useState<(VaultItem & { _id: string })[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<(VaultItem & { _id: string }) | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (masterPassword) {
      loadVaultItems()
    }
  }, [masterPassword])

  const loadVaultItems = async () => {
    if (!masterPassword) return

    try {
      setLoading(true)
      const response = await fetch("/api/vault")
      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/signin")
        }
        return
      }

      const decryptedItems = await Promise.all(
        data.items.map(async (item: any) => {
          try {
            const decrypted = await decryptVaultItem(item.encryptedData, item.salt, masterPassword)
            return { ...decrypted, _id: item._id }
          } catch (error) {
            console.error("[v0] Decryption error for item:", item._id, error)
            return null
          }
        }),
      )

      setItems(decryptedItems.filter(Boolean) as (VaultItem & { _id: string })[])
    } catch (error) {
      console.error("[v0] Load vault items error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveItem = async (item: VaultItem) => {
    if (!masterPassword) return

    try {
      const { encryptedData, salt } = await encryptVaultItem(item, masterPassword)

      if (editingItem) {
        const response = await fetch(`/api/vault/${editingItem._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ encryptedData, salt }),
        })

        if (!response.ok) throw new Error("Failed to update item")
      } else {
        const response = await fetch("/api/vault", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ encryptedData, salt }),
        })

        if (!response.ok) throw new Error("Failed to create item")
      }

      await loadVaultItems()
      setShowForm(false)
      setEditingItem(null)
    } catch (error) {
      console.error("[v0] Save item error:", error)
      alert("Failed to save item. Please try again.")
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return

    try {
      const response = await fetch(`/api/vault/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete item")

      await loadVaultItems()
    } catch (error) {
      console.error("[v0] Delete item error:", error)
      alert("Failed to delete item. Please try again.")
    }
  }

  const handleSignOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" })
    router.push("/")
  }

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.url.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (!masterPassword) {
    return <MasterPasswordPrompt onSubmit={setMasterPassword} />
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border sticky top-0 bg-background z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            <span className="text-xl font-bold">SecureVault</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/generate">
              <Button variant="outline" size="sm">
                <Key className="h-4 w-4 mr-2" />
                Generate
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Your Vault</h1>
              <p className="text-muted-foreground">
                {items.length} {items.length === 1 ? "item" : "items"} stored securely
              </p>
            </div>
            <Button
              onClick={() => {
                setShowForm(true)
                setEditingItem(null)
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>

          {showForm && (
            <div className="mb-6">
              <VaultItemForm
                item={editingItem || undefined}
                onSubmit={handleSaveItem}
                onCancel={() => {
                  setShowForm(false)
                  setEditingItem(null)
                }}
              />
            </div>
          )}

          {items.length > 0 && (
            <div className="mb-6">
              <Input
                placeholder="Search vault items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md bg-input border-border"
              />
            </div>
          )}

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading your vault...</div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">{searchQuery ? "No items found" : "Your vault is empty"}</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "Try a different search term" : "Add your first password to get started"}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Item
                </Button>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <VaultItemCard
                  key={item._id}
                  item={item}
                  onEdit={() => {
                    setEditingItem(item)
                    setShowForm(true)
                  }}
                  onDelete={() => handleDeleteItem(item._id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
