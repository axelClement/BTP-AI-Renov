import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProjectDetailView } from "@/components/ProjectDetailView";

interface ProjectPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { id } = await params;

    const project = await prisma.project.findUnique({
        where: { id },
        include: {
            quoteDetails: true,
            variations: true,
        },
    });

    if (!project) {
        notFound();
    }

    return <ProjectDetailView project={project} />;
}
