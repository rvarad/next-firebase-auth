// / <reference lib="webworker" />

// import { initializeApp } from "firebase/app"
// import { getAuth, getIdToken } from "firebase/auth"
// import { getInstallations, getToken } from "firebase/installations"
// import { FIREBASE_CONFIG } from "./src/lib/firebase/config"

// let firebaseConfig = FIREBASE_CONFIG

// self.addEventListener("install", (event) => {
// 	const serializedFirebaseConfig = new URL(location.href).searchParams.get(
// 		"firebaseConfig"
// 	)

// 	// if (!serializedFirebaseConfig) {
// 	// 	throw new Error(
// 	// 		"Firebase Config object not found in service worker query string."
// 	// 	)
// 	// }
// 	if (serializedFirebaseConfig) {
// 		try {
// 			firebaseConfig = JSON.parse(serializedFirebaseConfig)
// 			console.log(
// 				"Service worker installed with Firebase config",
// 				firebaseConfig
// 			)
// 		} catch (error) {
// 			console.error("Failed to parse Firebase config", error)
// 		}
// 	} else {
// 		console.log(
// 			"service worker installed with hardcoded config",
// 			firebaseConfig
// 		)
// 	}
// })

// self.addEventListener("fetch", (event) => {
// 	console.log("in fetch event listener")
// 	const { origin } = new URL(event.request.url)
// 	if (origin !== self.location.origin) return
// 	event.respondWith(fetchWithFirebaseHeaders(event.request))
// })

// async function fetchWithFirebaseHeaders(request) {
// 	console.log("in fetchWithFirebaseHeaders")
// 	const app = initializeApp(firebaseConfig)
// 	const auth = getAuth(app)
// 	const installations = getInstallations(app)
// 	console.log("in fetchWithFirebaseHeaders after initializeApp")

// 	const headers = new Headers(request.headers)

// 	const [authIdToken, installationToken] = await Promise.all([
// 		getAuthIdToken(auth),
// 		getToken(installations),
// 	])

// 	headers.append("Firebase-Instance-ID-Token", installationToken)

// 	if (authIdToken) headers.append("Authorization", `Bearer ${authIdToken}`)

// 	const newRequest = new Request(request, { headers })

// 	return await fetch(newRequest)
// }

// export async function getAuthIdToken(auth) {
// 	console.log("in getAuthIdToken before authStateReady")

// 	await auth.authStateReady()

// 	console.log("in getAuthIdToken")

// 	if (!auth.currentUser) return

// 	return await getIdToken(auth.currentUser)
// }

import { openDB } from "idb"

const CACHE_NAME = "config-cache-v1"
const TOKEN_KEY = "auth-token"
const TOKEN_CACHED_RECEIPT_KEY = "token-cached-receipt"
const DB_NAME = "auth-db"
const DB_STORE_NAME = "tokens"

async function openDatabase() {
	return openDB(DB_NAME, 1, {
		upgrade(db) {
			if (!db.objectStoreNames.contains(DB_STORE_NAME)) {
				db.createObjectStore(DB_STORE_NAME)
			}
		},
	})
}

async function cacheAuthToken(token) {
	const expirationTime = Date.now() + 3600 * 1000 // Token expires in 1 hour
	const data = JSON.stringify({ token, expirationTime })
	const receipt = { status: "success", timestamp: Date.now() }

	// Cache in service worker cache
	const cache = await caches.open(CACHE_NAME)
	const response = new Response(data, {
		headers: { "Content-Type": "application/json" },
	})
	await cache.put(TOKEN_KEY, response)

	// Cache in IndexedDB
	const db = await openDatabase()
	await db.put(DB_STORE_NAME, { token, expirationTime }, TOKEN_KEY)

	// Notify clients that the token was cached successfully
	const clientsList = await clients.matchAll()
	clientsList.forEach((client) =>
		client.postMessage({ type: "TOKEN_CACHED", receipt })
	)
}

async function getCachedAuthToken() {
	const cache = await caches.open(CACHE_NAME)
	const response = await cache.match(TOKEN_KEY)

	if (response) {
		const { token, expirationTime } = await response.json()
		if (Date.now() > expirationTime) {
			await cache.delete(TOKEN_KEY)
			return null
		}
		return token
	}

	// Fallback to IndexedDB
	const db = await openDatabase()
	const storedData = await db.get(DB_STORE_NAME, TOKEN_KEY)
	if (storedData && Date.now() < storedData.expirationTime) {
		return storedData.token
	}

	return null
}

async function clearAuthToken() {
	// Clear from service worker cache
	const cache = await caches.open(CACHE_NAME)
	await cache.delete(TOKEN_KEY)

	// Clear from IndexedDB
	const db = await openDatabase()
	await db.delete(DB_STORE_NAME, TOKEN_KEY)
}

self.addEventListener("fetch", (event) => {
	const { origin } = new URL(event.request.url)
	if (origin !== self.location.origin) return

	event.respondWith(
		(async () => {
			const authToken = await getCachedAuthToken()
			const headers = new Headers(event.request.headers)

			if (authToken) {
				headers.append("Authorization", `Bearer ${authToken}`)
			}

			const modifiedRequest = new Request(event.request, { headers })
			return fetch(modifiedRequest)
		})()
	)
})

self.addEventListener("message", (event) => {
	if (event.data && event.data.type === "CACHE_TOKEN") {
		cacheAuthToken(event.data.token).then(() => {
			console.log("Service Worker: Token cached successfully.")
		})
	} else if (event.data && event.data.type === "CLEAR_TOKEN") {
		clearAuthToken().then(() => {
			console.log("Service Worker: Token cleared successfully.")
		})
	}
})

// Installation and Activation for Immediate Control
self.addEventListener("install", (event) => {
	const serializedFirebaseConfig = new URL(location).searchParams.get(
		"firebaseConfig"
	)
	if (!serializedFirebaseConfig) {
		throw new Error(
			"Firebase Config object not found in service worker query string."
		)
	}
	self.skipWaiting()
	event.waitUntil(saveConfig(serializedFirebaseConfig))
})

self.addEventListener("activate", (event) => {
	event.waitUntil(clients.claim())
})
