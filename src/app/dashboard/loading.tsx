import { LayoutGrid, ListFilter, Plus } from "lucide-react";

export default function DashboardLoading() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 animate-pulse">
            {/* Header Skeleton */}
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="w-32 h-6 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="w-24 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <div className="w-48 h-8 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
                        <div className="w-64 h-4 bg-slate-100 dark:bg-slate-800 rounded"></div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                        <div className="w-32 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg"></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 h-[300px] overflow-hidden">
                            <div className="h-40 bg-slate-200 dark:bg-slate-800"></div>
                            <div className="p-4 space-y-3">
                                <div className="w-3/4 h-5 bg-slate-200 dark:bg-slate-800 rounded text-slate-900/0">.</div>
                                <div className="w-1/2 h-4 bg-slate-100 dark:bg-slate-800 rounded"></div>
                                <div className="pt-4 flex justify-between">
                                    <div className="w-20 h-4 bg-slate-100 dark:bg-slate-800 rounded"></div>
                                    <div className="w-16 h-6 bg-blue-50 dark:bg-blue-900/20 rounded"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
