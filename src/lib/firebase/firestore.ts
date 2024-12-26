import { doc } from "firebase/firestore"
import { db } from "./clientApp"

function getUsersCollection() {
	return doc(db, "users")
}

export { getUsersCollection }
