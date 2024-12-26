import {
	onAuthStateChanged as _onAuthStateChanged,
	signInWithEmailAndPassword as _signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	User,
} from "firebase/auth"
import { auth } from "./clientApp"

function onAuthStateChanged(cb: (user: User | null) => void) {
	return _onAuthStateChanged(auth, cb)
}

async function signupWithEmailPassword(email: string, password: string) {
	try {
		return await createUserWithEmailAndPassword(auth, email, password)
	} catch (error) {
		console.error("Error signing up with email and password", error)
	}
}

async function signInWithEmailAndPassword(email: string, password: string) {
	try {
		return await _signInWithEmailAndPassword(auth, email, password)
	} catch (error) {
		console.error("Error signing in with email and password", error)
	}
}

async function signOut() {
	try {
		return await auth.signOut()
	} catch (error) {
		console.error("Error signing out", error)
	}
}

export {
	onAuthStateChanged,
	signupWithEmailPassword,
	signInWithEmailAndPassword,
	signOut,
}
