import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("password-vault")

    const items = await db
      .collection("vault_items")
      .find({ userId: session.userId as string })
      .sort({ updatedAt: -1 })
      .toArray()

    return NextResponse.json({ items })
  } catch (error) {
    console.error("[v0] Vault GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { encryptedData, salt } = await request.json()

    if (!encryptedData || !salt) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("password-vault")

    const result = await db.collection("vault_items").insertOne({
      userId: session.userId as string,
      encryptedData,
      salt,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({ id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("[v0] Vault POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
