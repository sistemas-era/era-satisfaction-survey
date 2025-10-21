import type { APIRoute } from 'astro'
import { getFirestore } from 'firebase-admin/firestore'
import type { SatisfactionResponse } from '../../../types/survey'
import { app } from '../../../firebase/server'

export const GET: APIRoute = async () => {
  const db = getFirestore(app)
  const snapshot = await db.collection('survey-responses').orderBy('createdAt', 'desc').get()

  const responses = snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as SatisfactionResponse[]

  if (responses.length === 0) {
    return new Response(
      JSON.stringify({ message: 'No hay respuestas de encuestas para exportar.' }),
      { status: 404 }
    )
  }

  const docs = snapshot.docs.map((d) => {
    const raw = d.data()

    // createdAt puede ser Timestamp o string
    const createdAt =
      typeof raw.createdAt === 'string'
        ? raw.createdAt
        : raw.createdAt?.toDate?.()
          ? raw.createdAt.toDate().toISOString()
          : ''

    const ratings = raw.ratings ?? {}

    return {
      id: d.id,
      clientCompany: raw.clientCompany ?? '',
      clientPerson: raw.clientPerson ?? '',
      group: raw.group ?? '',
      q1: ratings.q1 ?? '',
      q2: ratings.q2 ?? '',
      q3: ratings.q3 ?? '',
      q4: ratings.q4 ?? '',
      q5: ratings.q5 ?? '',
      q6: ratings.q6 ?? '',
      q7: ratings.q7 ?? '',
      suggestions: raw.suggestions ?? '',
      createdAt, // string ISO
      // 🚫 userAgent intencionalmente NO se incluye
    }
  })

  // --- CSV ---
  const headers = [
    'id',
    'clientCompany',
    'clientPerson',
    'group',
    'q1',
    'q2',
    'q3',
    'q4',
    'q5',
    'q6',
    'q7',
    'suggestions',
    'createdAt',
  ] as const

  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`

  const rows = docs.map((row) => headers.map((h) => esc(row[h as keyof typeof row])).join(','))

  // BOM para que Excel detecte UTF-8
  const csv = '\uFEFF' + [headers.join(','), ...rows].join('\n')

  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="encuesta_satisfaccion.csv"',
      'Cache-Control': 'no-store',
    },
  })
}
