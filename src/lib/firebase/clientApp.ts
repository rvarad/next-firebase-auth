"use client"

import { getApps, initializeApp } from "firebase/app"
import { FIREBASE_CONFIG } from "./config"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const clientFirebaseApp =
	getApps().length === 0
		? initializeApp(FIREBASE_CONFIG)
		: getApps().find((app) => app.name === "firebase-auth-proto")

const auth = getAuth(clientFirebaseApp)

const db = clientFirebaseApp ? getFirestore(clientFirebaseApp) : null

const storage = getStorage(clientFirebaseApp)

export { auth, db, storage }
