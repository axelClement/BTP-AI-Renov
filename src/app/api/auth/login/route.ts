import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { password } = await req.json();
        const correctPassword = process.env.APP_PASSWORD;

        if (!correctPassword) {
            console.error("APP_PASSWORD is not set in environment variables");
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        if (password !== correctPassword) {
            return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
        }

        const response = NextResponse.json({ success: true });

        // Set HTTP-only cookie
        response.cookies.set("auth-token", "authenticated", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        });

        return response;
    } catch (error) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}
