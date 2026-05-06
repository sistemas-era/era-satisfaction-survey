import { db } from "@/db"
import type { UserDb } from "@/db/schema"
import type { User } from "@/types/auth"
import bcrypt from 'bcrypt'

export function getUserByEmail(email: string): User | null {
  const stmt = db.prepare(`
    SELECT *
    FROM users
    WHERE email = ?
  `)

  const user = stmt.get(email) as UserDb

  if (!user) return null

  return {
    id: user.id,
    email: user.email,
    password: user.password,
    createdAt: user.created_at,
  }
}

export async function createUser(email: string, password: string) {
  const stmt = db.prepare(`
    INSERT INTO users (
      email,
      password,
      created_at
    )
    VALUES (?, ?, ?)
  `)

  const passwordHash = await bcrypt.hash(password, await bcrypt.genSalt())

  const result = stmt.run(
    email,
    passwordHash,
    new Date().toISOString()
  )

  return {
    id: Number(result.lastInsertRowid),
    email,
  }
}