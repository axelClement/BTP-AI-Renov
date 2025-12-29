import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "../../../lib/supabase";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
    console.log("Upload API hit...");
    console.log("ENV CHECK: NEXT_PUBLIC_SUPABASE_URL length:", process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0);
    console.log("ENV CHECK: SUPABASE_SERVICE_ROLE_KEY length:", process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0);

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            console.error("Upload API: No file provided");
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        console.log(`Upload API: Processing ${file.name} (${file.type})`);

        const buffer = await file.arrayBuffer();
        const fileExt = file.name.split(".").pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        // Use Admin client if available to bypass RLS, otherwise fallback to standard client
        const storageClient = supabaseAdmin || supabase;

        if (!storageClient) {
            console.error("Upload API: No Supabase client initialized. Check .env variables.");
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }
        if (!supabaseAdmin) {
            console.warn("Upload API: supabaseAdmin is null, falling back to anon client");
        }

        console.log(`Upload API: Attempting storage upload to 'projects' bucket at ${filePath}`);

        const { data, error } = await storageClient.storage
            .from("projects")
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: false,
            });

        if (error) {
            console.error("Upload API: Supabase Storage Error:", error);
            const fs = require("fs");
            fs.appendFileSync("upload_debug.log", `[${new Date().toISOString()}] STORAGE ERROR: ${JSON.stringify(error)}\n`);
            return NextResponse.json({ error: "Upload failed", details: error.message }, { status: 500 });
        }

        console.log("Upload API: Upload successful, getting public URL");

        // Get public URL
        const { data: { publicUrl } } = storageClient.storage
            .from("projects")
            .getPublicUrl(filePath);

        console.log("Upload API: Returning success with URL:", publicUrl);
        return NextResponse.json({ success: true, url: publicUrl });
    } catch (error: any) {
        console.error("Upload API: Internal server error:", error);
        const fs = require("fs");
        fs.appendFileSync("upload_debug.log", `[${new Date().toISOString()}] CRASH: ${error.message}\nStack: ${error.stack}\n`);
        return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
    }
}
