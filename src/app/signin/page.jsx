import Link from "next/link"
import SigninForm from "./SigninForm"

function Page() {
	return (
		<div>
			<h1>Sign in</h1>
			<SigninForm />
			<p>or</p>
			<Link href="/signup">Sign up</Link>
		</div>
	)
}

export default Page
