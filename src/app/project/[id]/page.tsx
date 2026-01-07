import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProjectDetailView } from "@/components/ProjectDetailView";

interface ProjectPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { id } = await params;
    console.log("Rendering project page for id:", id);

    try {
        const project = await prisma.project.findUnique({
            where: { id },
            include: {
                quoteDetails: true,
                variations: true,
            },
        });

        if (!project) {
            console.warn("Project not found in DB for id:", id);
            notFound();
        }

        console.log("Project found:", project.title);

        // Serialize to plain JSON to avoid any Prisma/DateTime serialization issues in Server Components
        const plainProject = JSON.parse(JSON.stringify(project));

        return <ProjectDetailView project={plainProject} />;
    } catch (error: any) {
        console.error("Error fetching project for page:", id, error);
        throw error;
    }
}
