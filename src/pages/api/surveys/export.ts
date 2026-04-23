import type { APIRoute } from 'astro'
import { getFirestore } from 'firebase-admin/firestore'
import type { SatisfactionResponse } from '../../../types/survey'
import { app } from '../../../firebase/server'
import ExcelJS from 'exceljs'

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

  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Encuesta')

  sheet.columns = [
    { header: 'Empresa', key: 'clientCompany',  },
    { header: 'Encargado Empresa', key: 'clientPerson', width: 25 },
    { header: 'Unidad de negocio', key: 'group', width: 20 },
    { header: 'q1', key: 'q1', width: 10 },
    { header: 'q2', key: 'q2', width: 10 },
    { header: 'q3', key: 'q3', width: 10 },
    { header: 'q4', key: 'q4', width: 10 },
    { header: 'q5', key: 'q5', width: 10 },
    { header: 'q6', key: 'q6', width: 10 },
    { header: 'q7', key: 'q7', width: 10 },
    { header: 'Sugerencias', key: 'suggestions', width: 40 },
    { header: 'Fecha envío', key: 'createdAt', width: 30 },
  ]

  const docs = snapshot.docs.map((d) => {
    const raw = d.data()

    const createdAt =
      typeof raw.createdAt === 'string'
        ? raw.createdAt
        : raw.createdAt?.toDate?.()
          ? raw.createdAt.toDate().toISOString()
          : ''

    const ratings = raw.ratings ?? {}

    return {
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
      createdAt
    }
  })

  docs.forEach((row) => {
    const r = sheet.addRow({
      ...row,
      createdAt: row.createdAt ? new Date(row.createdAt) : null
    })

    r.getCell('suggestions').alignment = { wrapText: true }

    r.getCell('createdAt').numFmt = 'yyyy-mm-dd hh:mm:ss AM/PM'
  })

  const buffer = await workbook.xlsx.writeBuffer()

  return new Response(buffer, {
  headers: {
    'Content-Type':
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'Content-Disposition': 'attachment; filename="encuesta.xlsx"',
  },
})
}
