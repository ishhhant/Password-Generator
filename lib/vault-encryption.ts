"use client"

import { encryptData, decryptData, deriveKey, generateSalt } from "./encryption"

export interface VaultItem {
  _id?: string
  title: string
  username: string
  password: string
  url: string
  notes: string
}

export interface EncryptedVaultItem {
  _id?: string
  userId: string
  encryptedData: string
  salt: string
  createdAt: Date
  updatedAt: Date
}

let cachedKey: CryptoKey | null = null
let cachedPassword: string | null = null

export async function setMasterPassword(password: string) {
  cachedPassword = password
  const salt = generateSalt()
  cachedKey = await deriveKey(password, salt)
}

export async function getEncryptionKey(): Promise<CryptoKey | null> {
  return cachedKey
}

export async function encryptVaultItem(
  item: VaultItem,
  masterPassword: string,
): Promise<{ encryptedData: string; salt: string }> {
  const salt = generateSalt()
  const key = await deriveKey(masterPassword, salt)

  const itemJson = JSON.stringify(item)
  const encryptedData = await encryptData(itemJson, key)

  return {
    encryptedData,
    salt: btoa(String.fromCharCode(...salt)),
  }
}

export async function decryptVaultItem(
  encryptedData: string,
  salt: string,
  masterPassword: string,
): Promise<VaultItem> {
  const saltArray = Uint8Array.from(atob(salt), (c) => c.charCodeAt(0))
  const key = await deriveKey(masterPassword, saltArray)

  const decryptedJson = await decryptData(encryptedData, key)
  return JSON.parse(decryptedJson)
}
