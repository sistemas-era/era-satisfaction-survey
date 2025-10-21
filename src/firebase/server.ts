import 'dotenv/config'
import type { ServiceAccount } from 'firebase-admin'
import { initializeApp, cert, getApps } from 'firebase-admin/app'

const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env

if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
  throw new Error('[firebase-admin] Missing env vars (PROJECT_ID / CLIENT_EMAIL / PRIVATE_KEY)')
}

const activeApps = getApps()
const serviceAccount = {
  type: 'service_account',
  project_id: FIREBASE_PROJECT_ID,
  private_key: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: FIREBASE_CLIENT_EMAIL,
}

const initApp = () => {
  return initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
  })
}

export const app = activeApps.length === 0 ? initApp() : activeApps[0]
