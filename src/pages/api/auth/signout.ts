import type { APIRoute } from 'astro'

export const prerender = false

export const handler: APIRoute = async ({ redirect, cookies }) => {
  cookies.delete('__session', {
    path: '/',
  })
  return redirect('/signin')
}

export const POST = handler
export const GET = handler
