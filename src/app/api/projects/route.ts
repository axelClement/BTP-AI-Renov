import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// GET /api/projects - List all projects
export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            include: {
                quoteDetails: true,
                variations: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json({ success: true, data: projects });
    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch projects", details: error?.message },
            { status: 500 }
        );
    }
}

// POST /api/projects - Create a new project
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const project = await prisma.project.create({
            data: {
                title: body.title,
                client: body.client,
                date: body.date ? new Date(body.date) : null,
                status: body.status || "DRAFT",
                budget: body.budget,
                originalImage: body.originalImage,
                quotePdf: body.quotePdf,
                quoteDetails: body.quoteDetails
                    ? {
                        create: body.quoteDetails.map((d: { label: string; value: string }) => ({
                            label: d.label,
                            value: d.value,
                        })),
                    }
                    : undefined,
                variations: body.variations
                    ? {
                        create: body.variations.map((v: { name: string; color: string; image?: string }) => ({
                            name: v.name,
                            color: v.color,
                            image: v.image,
                        })),
                    }
                    : undefined,
            },
            include: {
                quoteDetails: true,
                variations: true,
            },
        });

        return NextResponse.json({ success: true, data: project }, { status: 201 });
    } catch (error: any) {
        console.error("API Error (POST /api/projects):", error);
        return NextResponse.json(
            { error: "Failed to create project", details: error?.message, stack: error?.stack },
            { status: 500 }
        );
    }
}
