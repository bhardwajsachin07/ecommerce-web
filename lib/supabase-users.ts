import { supabase } from "./supabase"

export interface DbUser {
    id: string
    email: string
    name: string
    password_hash: string
    avatar: string | null
    role: "user" | "admin"
    created_at: string
}

// Sign up a new user
export async function signupUser(name: string, email: string, password: string) {
    // Check if email already exists
    const { data: existing } = await supabase
        .from("users")
        .select("id")
        .eq("email", email.toLowerCase())
        .single()

    if (existing) {
        return { user: null, error: "Email already registered" }
    }

    const id = Math.random().toString(36).substr(2, 9)

    const { data, error } = await supabase
        .from("users")
        .insert([{
            id,
            email: email.toLowerCase(),
            name,
            password_hash: password, // Note: plain text for demo — use bcrypt in production
            role: "user",
        }])
        .select()
        .single()

    if (error) {
        console.error("Signup error:", error)
        return { user: null, error: "Failed to create account" }
    }

    const user = data as DbUser
    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar || undefined,
            createdAt: user.created_at,
            role: user.role,
        },
        error: null,
    }
}

// Login with email and password
export async function loginUser(email: string, password: string) {
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email.toLowerCase())
        .eq("password_hash", password)
        .single()

    if (error || !data) {
        return { user: null, error: "Invalid email or password" }
    }

    const user = data as DbUser
    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar || undefined,
            createdAt: user.created_at,
            role: user.role,
        },
        error: null,
    }
}

// Update user profile
export async function updateUserProfile(id: string, updates: { name?: string; avatar?: string }) {
    const { error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", id)

    if (error) {
        console.error("Update profile error:", error)
        return false
    }
    return true
}

// Get all users (admin)
export async function getAllUsers() {
    const { data, error } = await supabase
        .from("users")
        .select("id, email, name, role, created_at")
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Failed to fetch users:", error)
        return []
    }
    return data
}
