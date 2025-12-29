import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { supabaseAdmin } from "../../../../lib/supabase";

// Helper to extract storage path from Supabase URL
function getStoragePath(url: string | null) {
    if (!url || !url.includes("/storage/v1/object/public/projects/")) return null;
    return url.split("/projects/").pop();
}

// GET /api/projects/[id] - Get single project
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const project = await prisma.project.findUnique({
            where: { id },
            include: {
                quoteDetails: true,
                variations: true,
            },
        });

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: project });
    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch project", details: error?.message },
            { status: 500 }
        );
    }
}

// PUT /api/projects/[id] - Update project
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();

        const project = await prisma.project.update({
            where: { id },
            data: {
                title: body.title,
                client: body.client,
                date: body.date ? new Date(body.date) : undefined,
                status: body.status,
                budget: body.budget,
                originalImage: body.originalImage,
                quotePdf: body.quotePdf,
            },
            include: {
                quoteDetails: true,
                variations: true,
            },
        });

        return NextResponse.json({ success: true, data: project });
    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json(
            { error: "Failed to update project", details: error?.message },
            { status: 500 }
        );
    }
}

// DELETE /api/projects/[id] - Delete project
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // 1. Get project assets before deletion
        const project = await prisma.project.findUnique({
            where: { id },
            select: { originalImage: true, quotePdf: true }
        });

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        // 2. Delete from DB
        await prisma.project.delete({
            where: { id },
        });

        // 3. Clean up storage if files exist and are on Supabase
        const filesToDelete: string[] = [];
        const imagePath = getStoragePath(project.originalImage);
        const pdfPath = getStoragePath(project.quotePdf);

        if (imagePath) filesToDelete.push(imagePath);
        if (pdfPath) filesToDelete.push(pdfPath);

        if (filesToDelete.length > 0 && supabaseAdmin) {
            console.log("Cleanup: Deleting files from Supabase Storage:", filesToDelete);
            const { error: storageError } = await supabaseAdmin.storage
                .from("projects")
                .remove(filesToDelete);

            if (storageError) {
                console.error("Cleanup Error: Failed to delete storage files:", storageError);
            }
        }

        return NextResponse.json({ success: true, message: "Project and associated files deleted" });
    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json(
            { error: "Failed to delete project", details: error?.message },
            { status: 500 }
        );
    }
}
