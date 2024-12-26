import { useEffect, useState } from "react"
import { FIREBASE_CONFIG } from "../firebase/config"
import { User } from "firebase/auth"
import { onAuthStateChanged } from "../firebase/auth"
import { useRouter } from "next/navigation"
import exp from "constants"

function useUserSession(currentUser: User) {
	const [user, setUser] = useState(currentUser)
	const router = useRouter()

	useEffect(() => {
		if ("serviceWorker" in navigator) {
			const serializedFirebaseConfig = encodeURIComponent(
				JSON.stringify(FIREBASE_CONFIG)
			)
			const serviceWorkerUrl = `/auth-service-worker.ts?firebaseConfig=${serializedFirebaseConfig}`

			navigator.serviceWorker
				.register(serviceWorkerUrl)
				.then((registration) => console.log("Scope is: ", registration.scope))
		}
	}, [])

	useEffect(() => {
		const unsubscribe = onAuthStateChanged((authUser) => {
			if (authUser) setUser(authUser)
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
	}, [user])

	return user
}

export default useUserSession
