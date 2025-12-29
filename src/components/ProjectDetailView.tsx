"use client";

import { useState } from "react";
import { ArrowLeft, Wand2, Download, Share2, Layers, FileText } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";

interface ProjectDetailViewProps {
    project: any;
}

export function ProjectDetailView({ project }: ProjectDetailViewProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedVariation, setSelectedVariation] = useState<string | null>(null);
    const [showComparison, setShowComparison] = useState(false);
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // State for extracted quote details (updated when PDF is analyzed)
    const [extractedDetails, setExtractedDetails] = useState<{ label: string; value: string }[] | null>(null);
    const [extractedClient, setExtractedClient] = useState<string | null>(null);
    const [extractedDate, setExtractedDate] = useState<string | null>(null);

    const variations = project.variations || [];
    const quotePdf = project.quotePdf || "devis_demo.pdf";

    // Use extracted data if available, otherwise fall back to project data
    const displayDetails = extractedDetails || project.quoteDetails || [];
    const displayClient = extractedClient || project.client;
    const displayDate = extractedDate || (project.date ? project.date.toLocaleDateString('fr-FR') : "Date inconnue");

    const handleGenerate = (variationId: string) => {
        if (selectedVariation === variationId) return;
        setIsGenerating(true);
        setSelectedVariation(null);

        // Simulate AI generation
        setTimeout(() => {
            setSelectedVariation(variationId);
            setIsGenerating(false);
            setShowComparison(true);
        }, 2000);
    };

    const handleAnalyzePdf = async () => {
        setIsAnalyzing(true);
        try {
            const response = await fetch(`/${quotePdf}`);
            const blob = await response.blob();
            const formData = new FormData();
            formData.append("file", blob, "devis.pdf");

            const apiRes = await fetch("/api/parse-pdf", {
                method: "POST",
                body: formData,
            });

            const data = await apiRes.json();
            if (data.success && data.data) {
                setExtractedClient(data.data.client);
                setExtractedDate(data.data.date);
                setExtractedDetails([
                    { label: "Client", value: data.data.client },
                    { label: "Date", value: data.data.date },
                    { label: "Surface", value: data.data.surface },
                    { label: "Total TTC", value: data.data.budget },
                ]);
                alert(`Devis analysé avec succès !`);
            } else {
                alert(`Erreur lors de l'analyse du devis: ${data.details || data.error}`);
            }
        } catch (error) {
            console.error(error);
            alert("Erreur technique lors de l'analyse.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const currentVariationImage = variations.find((v: any) => v.id === selectedVariation)?.image;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
            {/* Header */}
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard"
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
                                {project.title}
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {displayClient} • {displayDate}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-500 hover:text-blue-600 transition-colors">
                            <Share2 className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-slate-500 hover:text-blue-600 transition-colors">
                            <Download className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                            <FileText className="w-4 h-4" /> Détails du Devis
                        </h2>
                        <div className="space-y-3">
                            {displayDetails.length > 0 ? (
                                displayDetails.map((detail: any, i: number) => (
                                    <div key={i} className="flex justify-between text-sm">
                                        <span className="text-slate-500 dark:text-slate-400">{detail.label}</span>
                                        <span className="font-medium text-slate-900 dark:text-slate-200">{detail.value}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-400 italic">Aucun détail.</p>
                            )}
                        </div>
                        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                            <a
                                href={`/${quotePdf}`}
                                target="_blank"
                                className="block w-full text-center py-2 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                rel="noreferrer"
                            >
                                Voir le PDF
                            </a>
                            <button
                                onClick={handleAnalyzePdf}
                                disabled={isAnalyzing}
                                className="mt-3 w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                            >
                                {isAnalyzing ? <span className="animate-spin">⟳</span> : <FileText className="w-4 h-4" />}
                                {isAnalyzing ? "Analyse..." : "Analyser"}
                            </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Wand2 className="w-4 h-4" /> Générer Variations
                        </h2>
                        <div className="space-y-3">
                            {variations.map((variation: any) => (
                                <button
                                    key={variation.id}
                                    onClick={() => handleGenerate(variation.id)}
                                    disabled={isGenerating}
                                    className={clsx(
                                        "w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left",
                                        selectedVariation === variation.id
                                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500"
                                            : "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                                    )}
                                >
                                    <div className={`w-8 h-8 rounded-full ${variation.color} shadow-inner`} />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                        {variation.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Visualizer */}
                <div className="lg:col-span-9">
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg group">
                        <img
                            src={project.originalImage || "/facade_chalet.png"}
                            alt="Original"
                            className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500"
                        />
                        <AnimatePresence>
                            {showComparison && currentVariationImage && !isGenerating && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 w-full h-full"
                                    style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
                                >
                                    <img
                                        src={currentVariationImage}
                                        alt="Generated"
                                        className="absolute inset-0 w-full h-full object-contain"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {isGenerating && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                                <p className="text-white font-medium text-lg animate-pulse">Génération...</p>
                            </div>
                        )}

                        {showComparison && !isGenerating && (
                            <div
                                className="absolute inset-0 z-10 cursor-ew-resize"
                                onMouseMove={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                                    setSliderPosition((x / rect.width) * 100);
                                }}
                            >
                                <div
                                    className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                                    style={{ left: `${sliderPosition}%` }}
                                >
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-900">
                                        <Layers className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur text-white text-xs font-medium rounded-full pointer-events-none">Avant</div>
                        {showComparison && !isGenerating && (
                            <div className="absolute top-4 right-4 px-3 py-1 bg-blue-600/90 backdrop-blur text-white text-xs font-medium rounded-full pointer-events-none">Après Travaux</div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
