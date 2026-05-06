export type QuestionKey = `q${1 | 2 | 3 | 4 | 5 | 6 | 7}`

export type Ratings = Record<QuestionKey, number>

export interface SurveyResponse {
  id: number
  clientCompany: string
  clientPerson: string
  group: string
  ratings: Ratings
  suggestions?: string
  createdAt: string
}

export interface CreateSurveyResponseDTO {
  clientCompany: string
  clientPerson: string
  group: string
  ratings: Ratings
  suggestions?: string
  createdAt: string
}