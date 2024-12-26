import ProfileContent from "@/components/ProfileContent"
import { db } from "@/lib/firebase/clientApp"
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp"
import { doc, getDoc, getFirestore } from "firebase/firestore"

async function Page() {
	const { firebaseServerApp, auth } = await getAuthenticatedAppForUser()

	const docRef = doc(getFirestore(firebaseServerApp), "users")

	const docSnap = await getDoc(docRef)

	return (
		<div>
			<h1>Profile</h1>
			<ProfileContent data={docSnap} />
		</div>
	)
}

export default Page
