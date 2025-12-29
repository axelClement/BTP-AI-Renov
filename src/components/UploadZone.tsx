"use client";

import { useState, useCallback } from "react";
import { Upload, FileText, Image as ImageIcon, X } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface UploadZoneProps {
    onFilesSelected: (files: File[]) => void;
    className?: string;
    accept?: string;
    label?: string;
    subLabel?: string;
}

export function UploadZone({
    onFilesSelected,
    className,
    accept = "image/*,application/pdf",
    label = "Glissez-déposez vos fichiers ici",
    subLabel = "ou cliquez pour sélectionner",
}: UploadZoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [previewFiles, setPreviewFiles] = useState<File[]>([]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            const files = Array.from(e.dataTransfer.files);
            if (files.length > 0) {
                setPreviewFiles((prev) => [...prev, ...files]);
                onFilesSelected(files);
            }
        },
        [onFilesSelected]
    );

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files ? Array.from(e.target.files) : [];
            if (files.length > 0) {
                setPreviewFiles((prev) => [...prev, ...files]);
                onFilesSelected(files);
            }
        },
        [onFilesSelected]
    );

    const removeFile = (index: number) => {
        setPreviewFiles((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className={twMerge("w-full", className)}>
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={clsx(
                    "relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ease-in-out flex flex-col items-center justify-center text-center cursor-pointer group",
                    isDragging
                        ? "border-blue-500 bg-blue-50/10 scale-[1.01]"
                        : "border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                )}
            >
                <input
                    type="file"
                    multiple
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileInput}
                    accept={accept}
                />
                <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 mb-4 group-hover:scale-110 transition-transform duration-200">
                    <Upload className="w-8 h-8 text-slate-500 dark:text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {label}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {subLabel}
                </p>
            </div>

            {previewFiles.length > 0 && (
                <div className="mt-6 space-y-3">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Fichiers sélectionnés
                    </h4>
                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                        {previewFiles.map((file, idx) => (
                            <div
                                key={idx}
                                className="flex items-center p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm"
                            >
                                <div className="p-2 rounded-md bg-slate-100 dark:bg-slate-800 mr-3">
                                    {file.type.startsWith("image/") ? (
                                        <ImageIcon className="w-5 h-5 text-blue-500" />
                                    ) : (
                                        <FileText className="w-5 h-5 text-orange-500" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {(file.size / 1024).toFixed(1)} KB
                                    </p>
                                </div>
                                <button
                                    onClick={() => removeFile(idx)}
                                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
