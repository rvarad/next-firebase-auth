"use server"

import { signupWithEmailPassword as _signupWithEmailPassword } from "@/lib/firebase/auth"

async function signupWithEmailPassword(
	name: string,
	admin: boolean,
	email: string,
	password: string
) {
	console.log(name, admin, email, password)

	const userCred = await _signupWithEmailPassword(email, password)

	const user = userCred?.user

	console.log(user)
}

export { signupWithEmailPassword }
