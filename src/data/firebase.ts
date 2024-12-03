// Import the functions you need from the SDKs you need
import { FirebaseApp, FirebaseOptions, initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: 'AIzaSyAoIWDgKgnmVNoB3mViRo4biLBb5jACMhk',
  authDomain: 'n30w-onemorething.firebaseapp.com',
  projectId: 'n30w-onemorething',
  storageBucket: 'n30w-onemorething.firebasestorage.app',
  messagingSenderId: '528143203144',
  appId: '1:528143203144:web:4f3632c72714f60b76117d',
  databaseURL:
    'https://n30w-onemorething-default-rtdb.asia-southeast1.firebasedatabase.app/',
}

// Initialize Firebase
const firebaseApp: FirebaseApp = initializeApp(firebaseConfig)
export const database = getDatabase(firebaseApp)
