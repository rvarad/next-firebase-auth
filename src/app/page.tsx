import HomeContent from "@/components/HomeContent"
import { signOut } from "@/lib/firebase/auth"
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function Home() {
	const { firebaseServerApp, auth } = await getAuthenticatedAppForUser()

	console.log("firebaseServerApp: ", firebaseServerApp.options.apiKey)

	console.log("auth user: ", auth.currentUser?.email)

	// return auth.currentUser ? (
	// 	<div>
	// 		<h1>Home</h1>
	// 		<p>Hello, {auth.currentUser.displayName}</p>
	// 		<button onClick={async () => await signOut()}>Sign out</button>
	// 	</div>
	// ) : (
	// 	<div className="h-screen w-screen flex flex-row items-center justify-evenly">
	// 		<Link href={"/signin"}>
	// 			<div className="w-[120px] h-[60px] flex items-center justify-center border-2 border-white rounded-2xl">
	// 				Sign in
	// 			</div>
	// 		</Link>
	// 		<Link href={"/signup"}>
	// 			<div className="w-[120px] h-[60px] flex items-center justify-center border-2 border-white rounded-2xl">
	// 				Sign up
	// 			</div>
	// 		</Link>
	// 	</div>
	// )

	return (
		<>
			<h1>This is home page</h1>
			<HomeContent />
		</>
	)
}
