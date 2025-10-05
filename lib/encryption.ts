// Client-side encryption utilities using Web Crypto API
// Uses AES-GCM for authenticated encryption

export async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, [
    "deriveBits",
    "deriveKey",
  ])

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  )
}

export async function encryptData(data: string, key: CryptoKey): Promise<string> {
  const encoder = new TextEncoder()
  const iv = crypto.getRandomValues(new Uint8Array(12))

  const encryptedData = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoder.encode(data))

  // Combine IV and encrypted data
  const combined = new Uint8Array(iv.length + encryptedData.byteLength)
  combined.set(iv, 0)
  combined.set(new Uint8Array(encryptedData), iv.length)

  // Convert to base64 for storage
  return btoa(String.fromCharCode(...combined))
}

export async function decryptData(encryptedData: string, key: CryptoKey): Promise<string> {
  const combined = Uint8Array.from(atob(encryptedData), (c) => c.charCodeAt(0))

  const iv = combined.slice(0, 12)
  const data = combined.slice(12)

  const decryptedData = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data)

  const decoder = new TextDecoder()
  return decoder.decode(decryptedData)
}

// Generate a random salt for key derivation
export function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(16))
}

// Store encryption key in session storage (cleared when browser closes)
export function storeEncryptionKey(key: CryptoKey, userId: string) {
  // We can't directly store CryptoKey, so we'll need to export it
  crypto.subtle.exportKey("raw", key).then((keyData) => {
    const keyArray = Array.from(new Uint8Array(keyData))
    sessionStorage.setItem(`encryption_key_${userId}`, JSON.stringify(keyArray))
  })
}

export async function getStoredEncryptionKey(userId: string): Promise<CryptoKey | null> {
  const stored = sessionStorage.getItem(`encryption_key_${userId}`)
  if (!stored) return null

  const keyArray = new Uint8Array(JSON.parse(stored))
  return crypto.subtle.importKey("raw", keyArray, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"])
}
