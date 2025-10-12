import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: 'AIzaSyAev7D7rcCFvnv7bfSw5Cr8RsDn22QqjxI',
  authDomain: 'era-database.firebaseapp.com',
  projectId: 'era-database',
  storageBucket: 'era-database.firebasestorage.app',
  messagingSenderId: '969829685220',
  appId: '1:969829685220:web:68351a7098',
}

export const app = initializeApp(firebaseConfig)