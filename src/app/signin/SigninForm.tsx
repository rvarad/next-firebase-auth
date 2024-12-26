"use client"

import { useAuth } from "@/lib/contexts/AuthProvider"
// import useUserSession from "@/lib/custom-hooks/useUserSession"
import { signInWithEmailAndPassword } from "@/lib/firebase/auth"
import { FIREBASE_CONFIG } from "@/lib/firebase/config"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"

function SigninForm() {
	const { control, handleSubmit } = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
	})

	const router = useRouter()

	const { signIn } = useAuth()

	async function submitUser(data) {
		const userCred = await signIn(data.email, data.password)

		console.log(userCred)

		router.push("/")
	}

	return (
		<form
			className="flex flex-col"
			onSubmit={handleSubmit(submitUser)}
		>
			<div>
				<label htmlFor="emailInput">Email</label>
				<Controller
					control={control}
					name="email"
					render={({ field }) => (
						<input
							id="emailInput"
							type="email"
							{...field}
						/>
					)}
				/>
			</div>
			<div>
				<label htmlFor="passwordInput">Password</label>
				<Controller
					control={control}
					name="password"
					render={({ field }) => (
						<input
							id="passwordInput"
							type="password"
							{...field}
						/>
					)}
				/>
			</div>
			<button>Sign in</button>
		</form>
	)
}

export default SigninForm
