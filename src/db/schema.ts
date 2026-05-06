export interface SurveyResponseDb {
  id: number
  client_company: string
  client_person: string
  survey_group: string
  ratings: string
  suggestions: string
  created_at: string
}

export interface UserDb {
  id: number
  email: string
  password: string
  created_at: string
}

export const SURVEY_RESPONSES_DB_STMT = `
  CREATE TABLE IF NOT EXISTS survey_responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_company TEXT NOT NULL,
    client_person TEXT NOT NULL,
    survey_group TEXT NOT NULL,
    ratings TEXT NOT NULL,
    suggestions TEXT,
    created_at TEXT NOT NULL
  )
`

export const USERS_DB_STMT = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TEXT NOT NULL
  )
`