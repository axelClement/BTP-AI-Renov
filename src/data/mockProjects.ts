export type ProjectStatus = "Draft" | "Review" | "Completed" | "In Progress";

export interface Variation {
    id: string;
    name: string;
    color: string;
    image: string;
}

export interface Project {
    id: string;
    title: string;
    client: string;
    date: string;
    originalImage: string;
    status: ProjectStatus;
    budget: string;
    quotePdf?: string;
    quoteDetails?: { label: string; value: string }[];
    variations?: Variation[];
}

export const MOCK_PROJECTS: Project[] = [
    {
        id: "demo-123",
        title: "Rénovation Extérieure - Chalet de Montagne",
        client: "Famille Martin",
        date: "28 Dec 2025",
        originalImage: "/facade_chalet.png",
        status: "In Progress",
        budget: "22 500 €",
        quotePdf: "devis_ravalement_chalet_bois.pdf",
        quoteDetails: [
            { label: "Surface", value: "180 m²" },
            { label: "Type", value: "Traitement Bois & Façade" },
            { label: "Budget", value: "22 500 €" },
        ],
        variations: [
            { id: "v1", name: "Lasure Chêne Doré (Satiné)", color: "bg-amber-400", image: "/facade_chalet_IA_lasure_chene.png" },
            { id: "v2", name: "Peinture Gris Ardoise", color: "bg-slate-600", image: "/facade_chalet_IA_peinture_gris_ardoise.png" },
            { id: "v3", name: "Aspect Bois Vieilli", color: "bg-stone-400", image: "/facade_chalet_IA_bois_veilli.png" },
            { id: "v4", name: "Rénovation Poncage + Lasure Neutre", color: "bg-amber-100", image: "/facade_chalet_IA_poncage_lasure_neutre.png" },
        ]
    },
    {
        id: "chalet-yeti",
        title: "Rénovation Chalet Yeti",
        client: "SCI Chalet Yeti",
        date: "01 Jan 2026",
        originalImage: "/facade_chalet_2_original.jpg",
        status: "Draft",
        budget: "A définir",
        quotePdf: "devis_ravalement_chalet_yeti.pdf",
        quoteDetails: [
            { label: "Surface", value: "480 m²" },
            { label: "Type", value: "Ravalement façade bois (3 étages)" },
        ],
        variations: [
            { id: "y1", name: "Lasure Incolore", color: "bg-amber-100", image: "/facade_chalet_2_ia_lasure_incolore.png" },
            { id: "y2", name: "Ponçage + Lasure Chêne", color: "bg-amber-600", image: "/facade_chalet_2_ia_poncage_lasure_chene.png" },
            { id: "y3", name: "Saturateur Chêne", color: "bg-orange-700", image: "/facade_chalet_2_ia_saturateur_chene.png" },
        ]
    },
    {
        id: "villa-sud",
        title: "Ravalement Villa Provençale",
        client: "M. Dubois",
        date: "15 Jan 2026",
        originalImage: "https://images.unsplash.com/photo-1513584685908-95c9e2d01361?q=80&w=2058&auto=format&fit=crop",
        status: "Draft",
        budget: "18 000 €",
    },
    {
        id: "immeuble-centre",
        title: "Façade Immeuble Haussmannien",
        client: "Syndic Le Parc",
        date: "10 Feb 2026",
        originalImage: "https://images.unsplash.com/photo-1574362848149-11496d93e7c7?q=80&w=1984&auto=format&fit=crop",
        status: "Review",
        budget: "145 000 €",
    },
    {
        id: "penthouse",
        title: "Terrasse Penthouse Moderne",
        client: "Sophie L.",
        date: "05 Mar 2026",
        originalImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
        status: "Completed",
        budget: "35 000 €",
    },
];
