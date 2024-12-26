// // import admin, { app } from "firebase-admin"

import { headers } from "next/headers"
import { FIREBASE_CONFIG } from "./config"
import { initializeServerApp } from "firebase/app"
import { getAuth } from "firebase/auth"

async function getAuthenticatedAppForUser() {
	const idToken = (await headers()).get("Authorization")?.split("Bearer ")[1]

	// console.log("firebaseConfig", JSON.stringify(FIREBASE_CONFIG))

	const firebaseServerApp = initializeServerApp(
		FIREBASE_CONFIG,
		idToken ? { authIdToken: idToken } : {}
	)

	const auth = getAuth(firebaseServerApp)

	await auth.authStateReady()

	return { firebaseServerApp, auth }
}

export { getAuthenticatedAppForUser }
