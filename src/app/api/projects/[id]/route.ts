import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

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

        await prisma.project.delete({
            where: { id },
        });

        return NextResponse.json({ success: true, message: "Project deleted" });
    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json(
            { error: "Failed to delete project", details: error?.message },
            { status: 500 }
        );
    }
}
