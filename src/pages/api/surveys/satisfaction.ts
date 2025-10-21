import type { APIRoute } from 'astro'
import { getFirestore } from 'firebase-admin/firestore'
import { app } from '../../../firebase/server'
import type { SatisfactionResponse } from '../../../types/survey'

export const GET: APIRoute = async () => {
  const db = getFirestore(app)
  const snapshot = await db.collection('survey-responses').orderBy('createdAt', 'desc').get()

  const responses = snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as SatisfactionResponse[]

  return new Response(JSON.stringify(responses), { status: 200 })
}

export const POST: APIRoute = async ({ request }) => {
  const db = getFirestore(app)

  let body: Record<string, string | number | null>
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ error: 'JSON inválido' }), { status: 400 })
  }

  const required = ['clientCompany', 'clientPerson', 'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7']
  for (const k of required) {
    if (body[k] === undefined || body[k] === null) {
      return new Response(JSON.stringify({ error: `Falta el campo ${k}` }), { status: 400 })
    }
  }

  const doc = {
    clientCompany: body.clientCompany,
    clientPerson: body.clientPerson,
    group: body.group ? String(body.group) : 'General',
    ratings: {
      q1: Number(body.q1),
      q2: Number(body.q2),
      q3: Number(body.q3),
      q4: Number(body.q4),
      q5: Number(body.q5),
      q6: Number(body.q6),
      q7: Number(body.q7),
    },
    suggestions: body.suggestions ?? '',
    createdAt: new Date().toISOString(),
    userAgent: request.headers.get('user-agent') ?? '',
  }

  await db.collection('survey-responses').add(doc)

  return new Response(JSON.stringify(doc), { status: 201 })
}
