import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const restrictedPaths = ["/dashboard", "/project"];
    const path = request.nextUrl.pathname;

    // Check if path starts with any restricted path
    const isRestricted = restrictedPaths.some((p) => path.startsWith(p));

    if (isRestricted) {
        const token = request.cookies.get("auth-token");

        if (!token) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/project/:path*"],
};
