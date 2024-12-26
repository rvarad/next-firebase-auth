"use client"

import { useAuth } from "@/lib/contexts/AuthProvider"
import { signOut, signupWithEmailPassword } from "@/lib/firebase/auth"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
// import { signupWithEmailPassword } from "./actions"

function SignupForm() {
	const { control, handleSubmit } = useForm({
		defaultValues: {
			email: "",
			password: "",
			// reEnterPassword: "",
		},
	})

	const router = useRouter()

	const { signOut } = useAuth()

	async function submitUser(data) {
		// signupWithEmailPassword(data.name, data.admin, data.email, data.password)
		await signupWithEmailPassword(data.email, data.password)

		await signOut()

		router.push("/signin")
	}

	return (
		<form onSubmit={handleSubmit(submitUser)}>
			{/* <div>
				<label htmlFor="nameInput">Name</label>
				<Controller
					control={control}
					name="name"
					render={({ field }) => (
						<input
							id="nameInput"
							type="text"
							{...field}
						/>
					)}
				/>
			</div> */}
			{/* <div>
				<label htmlFor="adminInput">Admin</label>
				<Controller
					control={control}
					name="admin"
					render={({ field }) => (
						<input
							id="adminInput"
							type="checkbox"
							checked={field.value}
							onChange={field.onChange}
						/>
					)}
				/>
			</div> */}
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
			{/* <div>
				<label htmlFor="re-enterPasswordInput">Re-Enter Password</label>
				<Controller
					control={control}
					name="reEnterPassword"
					render={({ field }) => (
						<input
							id="re-enterPasswordInput"
							type="password"
							{...field}
						/>
					)}
				/>
			</div> */}
			<button>Sign Up</button>
		</form>
	)
}

export default SignupForm
