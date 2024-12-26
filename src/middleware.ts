import { NextRequest, NextResponse } from "next/server"

function middleware(req: NextRequest) {
	let authorizationHeader = req.headers.get("Authorization")

	if (
		authorizationHeader &&
		(req.nextUrl.pathname === "/signin" || req.nextUrl.pathname === "/signup")
	) {
		return NextResponse.redirect(new URL("/", req.url))
	}

	if (
		!authorizationHeader &&
		(req.nextUrl.pathname === "/profile" || req.nextUrl.pathname === "/admin")
	) {
		return NextResponse.redirect(new URL("/signin", req.url))
	}

	return NextResponse.next()
}

const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Always run for API routes
		"/(api|trpc)(.*)",
	],
}

export { middleware, config }
