import { defineMiddleware } from 'astro:middleware'
import { verifyToken } from './lib/auth'

export const onRequest = defineMiddleware(
  async (context, next) => {
    const pathname = context.url.pathname

    const protectedRoutes = [
      '/dashboard',
    ]

    const isProtected = protectedRoutes.some((r) =>
      pathname.startsWith(r)
    )

    if (!isProtected) {
      return next()
    }

    const token =
      context.cookies.get('token')?.value

    if (!token) {
      return context.redirect('/login')
    }

    const payload = verifyToken(token)

    if (!payload) {
      context.cookies.delete('token')

      return context.redirect('/login')
    }

    return next()
  }
)