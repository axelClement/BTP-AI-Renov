import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();
        const fileExt = file.name.split(".").pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        // Upload to Supabase Storage (bucket 'projects')
        const { data, error } = await supabase.storage
            .from("projects")
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: false,
            });

        if (error) {
            console.error("Supabase Storage Error:", error);
            return NextResponse.json({ error: "Upload failed", details: error.message }, { status: 500 });
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from("projects")
            .getPublicUrl(filePath);

        return NextResponse.json({ success: true, url: publicUrl });
    } catch (error: any) {
        console.error("Upload API Error:", error);
        return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
    }
}
