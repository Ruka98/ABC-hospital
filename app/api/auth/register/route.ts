import { NextRequest, NextResponse } from "next/server"
import { dbGet, dbRun } from "@/lib/db"
import { createSession, hashPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role, phone, dob, gender } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
    }

    if (role !== "patient") {
      return NextResponse.json({ error: "Only patient registration is allowed" }, { status: 400 })
    }

    return NextResponse.json({
      error: "Self-registration is disabled. Please contact an administrator to create your account.",
    }, { status: 403 })
  } catch (error: any) {
    console.error("Register error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
