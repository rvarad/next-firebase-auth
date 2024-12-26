"use client"

import { useAuth } from "@/lib/contexts/AuthProvider"
import Link from "next/link"

function HomeContent() {
	const { user, signOut } = useAuth()

	return (
		<div>
			{user ? (
				<div>
					<h1>Home</h1>
					<p>Hello, {user.email}</p>
					<button onClick={async () => await signOut()}>Sign out</button>
				</div>
			) : (
				<div className="h-screen w-screen flex flex-row items-center justify-evenly">
					<Link href={"/signin"}>
						<div className="w-[120px] h-[60px] flex items-center justify-center border-2 border-white rounded-2xl">
							Sign in
						</div>
					</Link>
					<Link href={"/signup"}>
						<div className="w-[120px] h-[60px] flex items-center justify-center border-2 border-white rounded-2xl">
							Sign up
						</div>
					</Link>
				</div>
			)}
		</div>
	)
}

export default HomeContent
