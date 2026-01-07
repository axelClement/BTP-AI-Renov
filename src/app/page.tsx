"use client";

import { UploadZone } from "@/components/UploadZone";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);

  const [uploading, setUploading] = useState(false);

  const handleFilesAdded = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleFileRemoved = (indexInList: number) => {
    setFiles(prev => prev.filter((_, i) => i !== indexInList));
  };

  const handleCreateProject = async () => {
    if (files.length === 0) {
      alert("Veuillez sélectionner au moins un fichier.");
      return;
    }

    setUploading(true);

    try {
      let pdfUrl = "";
      let imageUrl = "";

      // 1. Upload files
      let extractedData = null;
      for (const file of files) {
        console.log("Uploading file:", file.name, "type:", file.type);
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData
        });
        const data = await res.json();

        if (data.success) {
          console.log("Upload success for", file.name, "URL:", data.url);
          const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
          const isImage = file.type.startsWith("image/") || /\.(jpg|jpeg|png|webp|avif)$/i.test(file.name);

          if (isPdf) {
            pdfUrl = data.url;
            // Automatically analyze the PDF
            try {
              console.log("Automatically analyzing PDF...");
              const parseRes = await fetch("/api/parse-pdf", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: data.url }),
              });
              const parseResult = await parseRes.json();
              if (parseResult.success) {
                extractedData = parseResult.data;
                console.log("PDF analysis results:", extractedData);
              }
            } catch (e) {
              console.warn("Automatic PDF analysis failed:", e);
            }
          } else if (isImage) {
            imageUrl = data.url;
          }
        } else {
          console.error("Upload failed for", file.name, data.error);
          throw new Error(`Échec de l'envoi pour ${file.name}: ${data.details || data.error}`);
        }
      }

      // 2. Create Project in DB
      let validDate = null;
      if (extractedData?.date && extractedData.date !== "Non trouvé") {
        const d = new Date(extractedData.date);
        if (!isNaN(d.getTime())) {
          validDate = d.toISOString();
        }
      }

      const projectData = {
        title: extractedData?.client && extractedData.client !== "Non trouvé"
          ? `Projet ${extractedData.client}`
          : "Nouveau Projet - " + new Date().toLocaleDateString('fr-FR'),
        client: (extractedData?.client && extractedData.client !== "Non trouvé")
          ? extractedData.client
          : "Client Potentiel",
        date: validDate || new Date().toISOString(),
        status: "DRAFT",
        originalImage: imageUrl || null,
        quotePdf: pdfUrl || null,
        budget: (extractedData?.budget && extractedData.budget !== "Non trouvé")
          ? extractedData.budget
          : "À définir",
        quoteDetails: extractedData ? [
          { label: "Client", value: extractedData.client },
          { label: "Date", value: extractedData.date },
          { label: "Surface", value: extractedData.surface },
          { label: "Total TTC", value: extractedData.budget },
        ] : undefined,
        variations: [
          { name: "Sablage Naturel", color: "bg-orange-100", image: null },
          { name: "Lasure Chêne Clair", color: "bg-orange-200", image: null },
          { name: "Lasure Chêne Foncé", color: "bg-orange-900", image: null },
        ]
      };

      const createRes = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData)
      });

      const projectResult = await createRes.json();

      if (projectResult.success) {
        router.push(`/project/${projectResult.data.id}`);
      } else {
        console.error("Project creation details:", projectResult);
        alert(`Erreur lors de la création du projet: ${projectResult.details || projectResult.error}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Une erreur est survenue lors de l'envoi.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden selection:bg-blue-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-end p-6 pointer-events-none">
        <Link
          href="/dashboard"
          className="pointer-events-auto px-4 py-2 bg-white/50 backdrop-blur border border-slate-200 dark:bg-slate-900/50 dark:border-slate-800 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 transition-colors"
        >
          Accéder au Tableau de Bord
        </Link>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6 border border-blue-500/20">
            <Sparkles className="w-4 h-4" />
            <span>Nouvelle Génération de Visualisation BTP</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
            Visualisez vos rénovations <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              avant de commencer
            </span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
            Transformez vos devis et photos en visuels réalistes grâce à l'IA.
            Aidez vos clients à se projeter instantanément avec différentes
            finitions de matériaux.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2"
        >
          <div className="p-6">
            <UploadZone
              onFilesAdded={handleFilesAdded}
              onFileRemoved={handleFileRemoved}
              files={files}
              label={uploading ? "Envoi en cours..." : "Ajoutez vos documents"}
              subLabel={uploading ? "Veuillez patienter" : "Photos et devis (PDF, JPG, PNG)"}
              className="h-64"
            />

            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-center"
              >
                <button
                  onClick={handleCreateProject}
                  disabled={uploading}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                >
                  {uploading ? "Chargement..." : (
                    <>
                      Lancer le Projet
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          {[
            {
              title: "Import Rapide",
              desc: "Téléchargez simplement vos photos de chantier et le devis associé.",
            },
            {
              title: "Analyse IA",
              desc: "Notre IA analyse les matériaux et les surfaces à rénover.",
            },
            {
              title: "Rendu Réaliste",
              desc: "Générez des variations visuelles (couleurs, textures) en un clic.",
            },
          ].map((feature, i) => (
            <div key={i} className="group p-6 rounded-2xl hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="w-12 h-12 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {feature.desc}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
