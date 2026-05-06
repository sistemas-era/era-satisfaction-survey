import type { APIRoute } from 'astro'
import ExcelJS from 'exceljs'
import { getAllSurveyResponses } from '@/repositories/survey.repository'

export const GET: APIRoute = async () => {
  const responses = getAllSurveyResponses()

  if (responses.length === 0) {
    return new Response(
      JSON.stringify({
        message: 'No hay respuestas de encuestas para exportar.',
      }),
      { status: 404 }
    )
  }

  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Encuesta')

  sheet.columns = [
    { header: 'Empresa', key: 'clientCompany', width: 25 },
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

  responses.forEach((row) => {
    const r = sheet.addRow({
      clientCompany: row.clientCompany,
      clientPerson: row.clientPerson,
      group: row.group,
      q1: row.ratings.q1,
      q2: row.ratings.q2,
      q3: row.ratings.q3,
      q4: row.ratings.q4,
      q5: row.ratings.q5,
      q6: row.ratings.q6,
      q7: row.ratings.q7,
      suggestions: row.suggestions ?? '',
      createdAt: row.createdAt ? new Date(row.createdAt) : null,
    })

    r.getCell('suggestions').alignment = {
      wrapText: true,
    }

    r.getCell('createdAt').numFmt =
      'yyyy-mm-dd hh:mm:ss AM/PM'
  })

  const buffer = await workbook.xlsx.writeBuffer()

  return new Response(buffer, {
    headers: {
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition':
        'attachment; filename="encuesta.xlsx"',
    },
  })
}
