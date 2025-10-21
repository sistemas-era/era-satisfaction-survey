export type QuestionKey = `q${1 | 2 | 3 | 4 | 5 | 6 | 7}`

export type Ratings = Record<QuestionKey, number>

export interface SatisfactionResponse {
  id: string
  clientCompany: string
  clientPerson: string
  group: string
  ratings: Ratings
  suggestions?: string
  createdAt: string
  userAgent?: string
}
