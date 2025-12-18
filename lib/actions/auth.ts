"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getSession, createSession, hashPassword, verifyPassword, deleteSession } from "@/lib/auth"
import { dbGet, dbRun } from "@/lib/db"
import { cookies } from "next/headers"

export async function signIn(email: string, password: string) {
  try {
    // Try to find user in patients table
    let user = await dbGet("SELECT * FROM patients WHERE email = ?", [email]) as any

    if (user) {
      const isValid = await verifyPassword(password, user.password_hash)
      if (!isValid) {
        return { error: "Invalid credentials" }
      }

      await createSession(user.id.toString(), "patient")
      revalidatePath("/", "layout")
      return { success: true, redirect: "/patient" }
    }

    // Try to find user in staff table
    user = await dbGet("SELECT * FROM staff WHERE email = ?", [email]) as any

    if (user) {
      const isValid = await verifyPassword(password, user.password_hash)
      if (!isValid) {
        return { error: "Invalid credentials" }
      }

      await createSession(user.id.toString(), "staff")
      revalidatePath("/", "layout")
      return { success: true, redirect: `/${user.role}` }
    }

    return { error: "Invalid credentials" }
  } catch (error: any) {
    return { error: error.message || "Failed to sign in" }
  }
}

export async function signUp(
  email: string,
  password: string,
  name: string,
  role: "patient" | "staff",
  phone?: string,
  dob?: string,
  gender?: string,
) {
  try {
    return { error: "Self-registration is disabled. Please contact an administrator." }
  } catch (error: any) {
    return { error: error.message || "Failed to register" }
  }
}

export async function signOut() {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("session_id")?.value

    if (sessionId) {
      await deleteSession(sessionId)
    }
  } catch (error) {
    // Ignore errors on logout
  }
  
  revalidatePath("/", "layout")
  redirect("/login")
}

export async function getCurrentUser() {
  const user = await getSession()
  return user ? {
    id: user.id,
    email: user.email,
  } : null
}

export async function getCurrentUserWithRole() {
  const user = await getSession()
  if (!user) return null

  return { 
    user: {
      id: user.id,
      email: user.email,
    }, 
    role: user.role 
  }
}
