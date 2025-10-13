import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next()

  if (response.status === 404) {
    return Response.redirect(new URL('/', context.request.url), 302)
  }

  return response
})
