import type { APIRoute } from 'astro'
import { createSurveyResponse, getAllSurveyResponses } from '@/repositories/survey.repository'

export const GET: APIRoute = async () => {
  const responses = getAllSurveyResponses()

  return new Response(JSON.stringify(responses), {
    status: 200,
  })
}

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, string | number | null>

  try {
    body = await request.json()
  } catch {
    return new Response(
      JSON.stringify({ error: 'JSON inválido' }),
      { status: 400 }
    )
  }

  const required = [
    'clientCompany',
    'clientPerson',
    'q1',
    'q2',
    'q3',
    'q4',
    'q5',
    'q6',
    'q7',
  ]

  for (const k of required) {
    if (body[k] === undefined || body[k] === null) {
      return new Response(
        JSON.stringify({ error: `Falta el campo ${k}` }),
        { status: 400 }
      )
    }
  }

  const survey = createSurveyResponse({
    clientCompany: String(body.clientCompany),
    clientPerson: String(body.clientPerson),
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
    suggestions: body.suggestions
      ? String(body.suggestions)
      : '',
    createdAt: new Date().toISOString(),
  })

  return new Response(
    JSON.stringify(survey),
    { status: 201 }
  )
}
