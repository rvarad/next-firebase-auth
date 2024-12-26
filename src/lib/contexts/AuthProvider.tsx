"use client"

import { User } from "firebase/auth"
import { createContext, useContext, useEffect, useState } from "react"
import { FIREBASE_CONFIG } from "../firebase/config"
import {
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut as _signOut,
} from "../firebase/auth"
import { useRouter } from "next/navigation"
import { auth } from "../firebase/clientApp"
import { openDB } from "idb"

interface AuthContextValue {
	user: any | null
	signIn: (email: string, password: string) => Promise<void>
	signOut: () => Promise<void>
}

interface AuthProviderProps {
	initialUser: any | null
	children: React.ReactNode
}

const DB_NAME = "auth-db"
const DB_STORE_NAME = "tokens"
const TOKEN_KEY = "auth-token"

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function AuthProvider({ initialUser, children }: AuthProviderProps) {
	const [user, setUser] = useState(initialUser)
	const router = useRouter()

	// useEffect(() => {
	// 	console.log("in useEffect")
	// 	if ("serviceWorker" in navigator) {
	// 		const serializedFirebaseConfig = encodeURIComponent(
	// 			JSON.stringify(FIREBASE_CONFIG)
	// 		)
	// 		console.log("serializedFirebaseConfig")
	// 		const serviceWorkerUrl = `/auth-service-worker.js?firebaseConfig=${serializedFirebaseConfig}`
	// 		console.log("Gone to service worker url")

	// 		navigator.serviceWorker
	// 			.register(serviceWorkerUrl)
	// 			.then((registration) => console.log("Scope is: ", registration.scope))
	// 	}
	// }, [])

	// useEffect(() => {
	// 	const unsubscribe = onAuthStateChanged((authUser) => {
	// 		if (authUser) setUser(authUser)
	// 	})

	// 	return () => unsubscribe()
	// }, [])

	useEffect(() => {
		if ("serviceWorker" in navigator) {
			const serializedFirebaseConfig = encodeURIComponent(
				JSON.stringify(FIREBASE_CONFIG)
			)
			const serviceWorkerUrl = `/auth-service-worker.js?firebaseConfig=${serializedFirebaseConfig}`

			navigator.serviceWorker
				.register(serviceWorkerUrl)
				.then((registration) => {
					console.log("Service Worker scope:", registration.scope)
					return navigator.serviceWorker.ready
				})
				.then(() => {
					console.log("Service Worker is ready and controlling the page.")
					if (!navigator.serviceWorker.controller) {
						console.warn(
							"However, due to a shift-reload, the service worker controller is bypassed entirely."
						)
						location.reload()
					}
				})
		}
	}, [])

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(async (authUser: any) => {
			setUser(authUser)
			console.log("Auth state changed:", authUser)

			if (authUser) {
				console.log("Attempting to cache the token.")
				let idToken = authUser?.accessToken
				if (!idToken) {
					idToken = await auth.currentUser?.getIdToken()
				}

				console.log("idToken detected", { idToken })

				// Cache the token with the service worker if it's available
				if (
					"serviceWorker" in navigator &&
					navigator.serviceWorker.controller
				) {
					console.log("Caching token after auth state change:", idToken)
					navigator.serviceWorker.controller.postMessage({
						type: "CACHE_TOKEN",
						token: idToken,
					})
				}

				// Also store the token in IndexedDB as a backup
				const db = await openDB(DB_NAME, 1, {
					upgrade(db) {
						db.createObjectStore(DB_STORE_NAME)
					},
				})
				await db.put(
					DB_STORE_NAME,
					{ token: idToken, expirationTime: Date.now() + 3600 * 1000 },
					TOKEN_KEY
				)
				console.log("Token cached in IndexedDB as a backup.")
			}
		})

		return () => unsubscribe()
	}, [])

	useEffect(() => {
		onAuthStateChanged((authUser) => {
			if (user === undefined) return

			if (user?.email !== authUser?.email) {
				router.refresh()
			}
		})
	}, [user, router])

	async function signIn(email: string, password: string) {
		try {
			await signInWithEmailAndPassword(email, password)
			const idToken = await auth.currentUser?.getIdToken(true)
			if (idToken) {
				console.log("Caching token immediately after sign-in:", idToken)

				if (navigator.serviceWorker.controller) {
					navigator.serviceWorker.controller.postMessage({
						type: "CACHE_TOKEN",
						token: idToken,
					})
				}

				// Cache in IndexedDB as a fallback
				const db = await openDB(DB_NAME, 1)
				await db.put(
					DB_STORE_NAME,
					{ token: idToken, expirationTime: Date.now() + 3600 * 1000 },
					TOKEN_KEY
				)
				console.log("Token cached in IndexedDB as a backup.")
			}
		} catch (error) {
			console.error("Error signing in with email and password", error)
		}
	}

	async function signOut() {
		try {
			// await _signOut()
			_signOut().then(async () => {
				if (navigator.serviceWorker.controller) {
					navigator.serviceWorker.controller.postMessage({
						type: "CLEAR_TOKEN",
					})
				}

				// Clear from IndexedDB
				const db = await openDB(DB_NAME, 1)
				await db.delete(DB_STORE_NAME, TOKEN_KEY)
				console.log("Token cleared from IndexedDB.")

				setUser(null)
				router.refresh()
			})

			// setUser(null)

			// router.refresh()
		} catch (error) {
			console.error("Error signing out", error)
		}
	}

	return (
		<AuthContext.Provider value={{ user, signIn, signOut }}>
			{children}
		</AuthContext.Provider>
	)
}

function useAuth(): AuthContextValue {
	const context = useContext(AuthContext)
	if (!context) throw new Error("No context provided")

	return context
}

export { useAuth, AuthProvider }
