import { db } from '@/db'
import type { SurveyResponseDb } from '@/db/schema'
import type { CreateSurveyResponseDTO, SurveyResponse } from '@/types/survey'

export function getAllSurveyResponses(): SurveyResponse[] {
  const stmt = db.prepare(`
    SELECT *
    FROM survey_responses
    ORDER BY created_at DESC
  `)

  const rows = stmt.all() as SurveyResponseDb[]

  return rows.map((r) => ({
    id: r.id,
    clientCompany: r.client_company,
    clientPerson: r.client_person,
    group: r.survey_group,
    ratings: JSON.parse(r.ratings),
    suggestions: r.suggestions,
    createdAt: r.created_at
  }))
}

export function createSurveyResponse(data: CreateSurveyResponseDTO): SurveyResponse {
  const stmt = db.prepare(`
    INSERT INTO survey_responses (
      client_company,
      client_person,
      survey_group,
      ratings,
      suggestions,
      created_at
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  const result = stmt.run(
    data.clientCompany,
    data.clientPerson,
    data.group,
    JSON.stringify(data.ratings),
    data.suggestions ?? '',
    data.createdAt
  )

  return {
    id: Number(result.lastInsertRowid),
    ...data,
  }
}

export function getSurveyResponseById(id: number): SurveyResponse | null {
  const stmt = db.prepare(`
    SELECT *
    FROM survey_responses
    WHERE id = ?
  `)

  const row = stmt.get(id) as SurveyResponseDb

  if (!row) return null

  return {
    id: row.id,
    clientCompany: row.client_company,
    clientPerson: row.client_person,
    group: row.survey_group,
    ratings: JSON.parse(row.ratings),
    suggestions: row.suggestions,
    createdAt: row.created_at
  }
}