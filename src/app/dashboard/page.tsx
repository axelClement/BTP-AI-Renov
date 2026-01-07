import { ProjectCard } from "@/components/ProjectCard";
import { Plus, LayoutGrid, ListFilter } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProjectStatus } from "@prisma/client";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    // Fetch projects from database
    const projects = await prisma.project.findMany({
        include: {
            quoteDetails: true,
            variations: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    // Helper to map DB project to UI project type (if they differ slightly)
    const formattedProjects = projects.map((p: any) => ({
        ...p,
        date: p.date ? p.date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Date inconnue',
        status: p.status as any, // Cast for compatibility
        originalImage: p.originalImage || "/facade_chalet.png",
    }));

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                        BTP Renov AI
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300">
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                <span className="text-xs">AX</span>
                            </div>
                            <span>Axel P.</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Tableau de Bord
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            Gérez vos projets de rénovation ({formattedProjects.length} actifs)
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                            <ListFilter className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                        <Link
                            href="/"
                            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm shadow-blue-500/20"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Nouveau Projet
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {formattedProjects.map((project: any) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}

                    {/* Empty State / Add New Card */}
                    <Link
                        href="/"
                        className="group flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl hover:border-blue-400 dark:hover:border-blue-600 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all cursor-pointer"
                    >
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:scale-110 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 flex items-center justify-center transition-all mb-4">
                            <Plus className="w-6 h-6 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white">Créer un projet</span>
                        <span className="text-sm text-slate-500 dark:text-slate-400 mt-1">Importer photos & devis</span>
                    </Link>
                </div>
            </main>
        </div>
    );
}

