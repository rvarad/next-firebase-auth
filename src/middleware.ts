import { NextRequest, NextResponse } from "next/server"

function middleware(req: NextRequest) {
	console.log("middleware: ", req.headers.get("Authorization"))

	return NextResponse.next()
}

const config = {
	matcher: "/",
}

export { middleware }
