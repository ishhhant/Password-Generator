"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Eye, EyeOff, Edit, Trash2, ExternalLink, Check } from "lucide-react"
import type { VaultItem } from "@/lib/vault-encryption"

interface VaultItemCardProps {
  item: VaultItem
  onEdit: () => void
  onDelete: () => void
}

export function VaultItemCard({ item, onEdit, onDelete }: VaultItemCardProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const handleCopy = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedField(field)

    // Auto-clear after 15 seconds
    setTimeout(() => {
      setCopiedField(null)
    }, 15000)
  }

  return (
    <Card className="border-border bg-card hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{item.title}</CardTitle>
            {item.username && <p className="text-sm text-muted-foreground mt-1">{item.username}</p>}
          </div>
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={onDelete}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Password */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Password</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-3 py-2 bg-muted rounded text-sm font-mono border border-border">
              {showPassword ? item.password : "••••••••••••"}
            </code>
            <Button size="icon" variant="ghost" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button size="icon" variant="ghost" onClick={() => handleCopy(item.password, "password")}>
              {copiedField === "password" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* URL */}
        {item.url && (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">URL</p>
            <div className="flex items-center gap-2">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-3 py-2 bg-muted rounded text-sm truncate hover:bg-muted/80 transition-colors border border-border"
              >
                {item.url}
              </a>
              <Button size="icon" variant="ghost" onClick={() => window.open(item.url, "_blank")}>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Notes */}
        {item.notes && (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Notes</p>
            <p className="text-sm px-3 py-2 bg-muted rounded border border-border whitespace-pre-wrap">{item.notes}</p>
          </div>
        )}

        {copiedField && <p className="text-xs text-green-500">Copied! Clipboard will auto-clear in 15 seconds</p>}
      </CardContent>
    </Card>
  )
}
