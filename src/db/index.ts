import Database from 'better-sqlite3'
import { SURVEY_RESPONSES_DB_STMT, USERS_DB_STMT } from './schema'

const DATABASE_PATH = process.env.DATABASE_PATH ?? './data/database.db'

console.log(DATABASE_PATH)

export const db = new Database(DATABASE_PATH)

db.exec(SURVEY_RESPONSES_DB_STMT)
db.exec(USERS_DB_STMT)