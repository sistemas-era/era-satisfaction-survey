import type { APIRoute } from 'astro'
import bcrypt from 'bcrypt'
import { getUserByEmail } from '@/repositories/auth.repository'
import { generateToken } from '@/lib/auth'

export const POST: APIRoute = async ({ request, cookies }) => {
  const body = await request.json()

  const email = String(body.email || '')
  const password = String(body.password || '')

  if (!email || !password) {
    return new Response(
      JSON.stringify({
        error: 'Credenciales inválidas',
      }),
      { status: 400 }
    )
  }

  const user = getUserByEmail(email)

  if (!user) {
    return new Response(
      JSON.stringify({
        error: 'Usuario no encontrado',
      }),
      { status: 401 }
    )
  }

  const valid = await bcrypt.compare(
    password,
    user.password
  )

  if (!valid) {
    return new Response(
      JSON.stringify({
        error: 'Contraseña incorrecta',
      }),
      { status: 401 }
    )
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
  })

  cookies.set('token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return new Response(
    JSON.stringify({
      success: true,
    }),
    { status: 200 }
  )
}