import { Project } from "@/data/mockProjects";
import { Calendar, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";

interface ProjectCardProps {
    project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
    const statusColors: Record<string, string> = {
        DRAFT: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
        REVIEW: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        IN_PROGRESS: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        COMPLETED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    };

    const statusLabels: Record<string, string> = {
        DRAFT: "Brouillon",
        REVIEW: "Revue",
        IN_PROGRESS: "En Cours",
        COMPLETED: "Terminé",
    };

    return (
        <div className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300">
            <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={project.originalImage || "/facade_chalet.png"}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                    <span className={clsx("px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm", statusColors[project.status] || statusColors.DRAFT)}>
                        {statusLabels[project.status] || project.status}
                    </span>
                </div>
            </div>

            <div className="p-5">
                <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {project.title}
                </h3>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                        <User className="w-4 h-4 mr-2" />
                        {project.client}
                    </div>
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        {project.date}
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {project.budget}
                    </span>
                    <Link
                        href={`/project/${project.id}`}
                        className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
                    >
                        Voir le projet <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
