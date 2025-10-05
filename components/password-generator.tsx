"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Copy, RefreshCw, Check, Save } from "lucide-react"
import { generatePassword, calculatePasswordStrength, type PasswordOptions } from "@/lib/password-generator"

interface PasswordGeneratorProps {
  onSave?: (password: string) => void
}

export function PasswordGenerator({ onSave }: PasswordGeneratorProps) {
  const [password, setPassword] = useState("")
  const [copied, setCopied] = useState(false)
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
  })

  const strength = calculatePasswordStrength(password)

  // Generate initial password
  useEffect(() => {
    handleGenerate()
  }, [])

  const handleGenerate = () => {
    const newPassword = generatePassword(options)
    setPassword(newPassword)
    setCopied(false)
  }

  // Regenerate when options change
  useEffect(() => {
    if (password) {
      handleGenerate()
    }
  }, [options])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(password)
    setCopied(true)

    // Auto-clear after 15 seconds
    setTimeout(() => {
      setCopied(false)
    }, 15000)
  }

  const updateOption = <K extends keyof PasswordOptions>(key: K, value: PasswordOptions[K]) => {
    setOptions((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <Card className="w-full border-border bg-card">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Password Generator</CardTitle>
        <CardDescription className="text-muted-foreground">
          Generate a strong, random password with custom options
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Generated Password Display */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Generated Password</Label>
            <span className={`text-sm font-medium ${strength.color}`}>{strength.label}</span>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 p-4 bg-muted rounded-md font-mono text-lg break-all border border-border">
              {password || "Click generate to create a password"}
            </div>
            <div className="flex flex-col gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={handleCopy}
                disabled={!password}
                className="h-full bg-transparent"
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Button size="icon" variant="outline" onClick={handleGenerate} className="h-full bg-transparent">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {copied && <p className="text-xs text-green-500">Copied! Clipboard will auto-clear in 15 seconds</p>}
        </div>

        {/* Length Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Length</Label>
            <span className="text-sm font-medium">{options.length}</span>
          </div>
          <Slider
            value={[options.length]}
            onValueChange={([value]) => updateOption("length", value)}
            min={8}
            max={64}
            step={1}
            className="w-full"
          />
        </div>

        {/* Options */}
        <div className="space-y-4">
          <Label>Character Types</Label>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="uppercase" className="font-normal">
                Uppercase Letters (A-Z)
              </Label>
              <Switch
                id="uppercase"
                checked={options.includeUppercase}
                onCheckedChange={(checked) => updateOption("includeUppercase", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="lowercase" className="font-normal">
                Lowercase Letters (a-z)
              </Label>
              <Switch
                id="lowercase"
                checked={options.includeLowercase}
                onCheckedChange={(checked) => updateOption("includeLowercase", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="numbers" className="font-normal">
                Numbers (0-9)
              </Label>
              <Switch
                id="numbers"
                checked={options.includeNumbers}
                onCheckedChange={(checked) => updateOption("includeNumbers", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="symbols" className="font-normal">
                Symbols (!@#$%...)
              </Label>
              <Switch
                id="symbols"
                checked={options.includeSymbols}
                onCheckedChange={(checked) => updateOption("includeSymbols", checked)}
              />
            </div>
          </div>
        </div>

        {/* Exclude Similar */}
        <div className="space-y-3 pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="exclude-similar" className="font-normal">
                Exclude Similar Characters
              </Label>
              <p className="text-xs text-muted-foreground">Avoid characters like 0/O, 1/l/I</p>
            </div>
            <Switch
              id="exclude-similar"
              checked={options.excludeSimilar}
              onCheckedChange={(checked) => updateOption("excludeSimilar", checked)}
            />
          </div>
        </div>

        {/* Actions */}
        {onSave && (
          <Button
            onClick={() => onSave(password)}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={!password}
          >
            <Save className="h-4 w-4 mr-2" />
            Save to Vault
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
