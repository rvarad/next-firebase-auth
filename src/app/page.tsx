import HomeContent from "@/components/HomeContent"
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function Home() {
	const { firebaseServerApp, auth } = await getAuthenticatedAppForUser()

	// console.log("firebaseServerApp: ", firebaseServerApp.options.apiKey)

	console.log("auth user: ", auth.currentUser?.email)

	return (
		<>
			<h1>This is home page</h1>
			<HomeContent />
		</>
	)
}
