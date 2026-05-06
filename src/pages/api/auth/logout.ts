import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({
  cookies,
}) => {
  cookies.delete('token', {
    path: '/',
  })

  return new Response(null, {
    status: 204,
  })
}