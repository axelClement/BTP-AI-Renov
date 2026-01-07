export default function ProjectDetailLoading() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 animate-pulse">
            {/* Header Skeleton */}
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                <div className="w-32 h-6 bg-slate-200 dark:bg-slate-800 rounded"></div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Top Section Skeleton */}
                <div className="flex flex-col lg:flex-row gap-8 mb-8">
                    {/* Left: Project Info */}
                    <div className="lg:w-1/3 space-y-6">
                        <div className="w-48 h-10 bg-slate-200 dark:bg-slate-800 rounded"></div>
                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 h-24"></div>
                            ))}
                        </div>
                        <div className="h-40 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800"></div>
                    </div>

                    {/* Right: Main Image Comparison Skeleton */}
                    <div className="lg:w-2/3">
                        <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800"></div>
                    </div>
                </div>

                {/* Variations Section Skeleton */}
                <div className="space-y-4">
                    <div className="w-48 h-8 bg-slate-200 dark:bg-slate-800 rounded mb-6"></div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="aspect-[4/3] bg-slate-200 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800"></div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
