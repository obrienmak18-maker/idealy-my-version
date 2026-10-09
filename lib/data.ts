import { siFigma, siGithub, siNotion, siStripe, siSupabase, siVercel } from "simple-icons";
import type { Agent, Connector, ConnectorCategory } from "./types";

export const connectorCategoryLabels: Record<ConnectorCategory, string> = {
  code: "Code & Git",
  deploy: "Déploiement",
  data: "Données & Cloud",
  billing: "Paiements",
  design: "Design & médias",
  communication: "Communication",
};

export const connectors: Connector[] = [
  { id: "canva", name: "Canva", description: "Importer, transformer et exporter des designs sélectionnés par l'utilisateur.", category: "design", brand: { title: "Canva", hex: "00C4CC", path: "" }, availability: "planned", auth: "OAuth 2.0", operations: ["Lister les designs autorisés", "Lire un design sélectionné", "Créer un design", "Exporter un design"] },
  { id: "github", name: "GitHub", description: "Lire un dépôt sélectionné et publier du code ou des issues après confirmation.", category: "code", brand: siGithub, availability: "configured", auth: "OAuth 2.0", operations: ["Lister les dépôts autorisés", "Lire un dépôt sélectionné", "Créer une branche", "Ouvrir une pull request"] },
  { id: "google-drive", name: "Google Drive", description: "Lister les fichiers Drive explicitement autorisés par le compte Google connecté.", category: "data", brand: { title: "Google Drive", hex: "4285F4", path: "" }, availability: "planned", auth: "OAuth 2.0", operations: ["Lister les fichiers autorisés", "Lire les métadonnées d'un fichier sélectionné"] },
  { id: "vercel", name: "Vercel", description: "Créer des previews et déclencher un déploiement après validation de l'utilisateur.", category: "deploy", brand: siVercel, availability: "planned", auth: "OAuth 2.0", operations: ["Lister les projets Vercel", "Lire le statut d'un déploiement", "Créer une preview", "Déployer en production"] },
  { id: "supabase", name: "Supabase", description: "Lire les ressources du projet Idealy et gérer les données selon les policies RLS.", category: "data", brand: siSupabase, availability: "configured", auth: "Géré par Idealy", operations: ["Lire une mission de l'utilisateur", "Lire les fichiers d'une mission", "Ajouter un événement de mission"] },
  { id: "figma", name: "Figma", description: "Lire des fichiers de design sélectionnés et récupérer leurs métadonnées ou assets.", category: "design", brand: siFigma, availability: "planned", auth: "OAuth 2.0", operations: ["Lire un fichier sélectionné", "Exporter les assets sélectionnés"] },
  { id: "notion", name: "Notion", description: "Lire ou écrire des pages et bases explicitement partagées avec l'intégration.", category: "data", brand: siNotion, availability: "planned", auth: "OAuth 2.0", operations: ["Rechercher les pages partagées", "Lire une page sélectionnée", "Ajouter du contenu à une page"] },
  { id: "slack", name: "Slack", description: "Lire un contexte autorisé et envoyer des messages uniquement après confirmation.", category: "communication", brand: { title: "Slack", hex: "4A154B", path: "" }, availability: "planned", auth: "OAuth 2.0", operations: ["Lister les canaux autorisés", "Envoyer un message après confirmation"] },
  { id: "stripe", name: "Stripe", description: "Lire l'état de facturation Idealy sans exposer de données sensibles au navigateur.", category: "billing", brand: siStripe, availability: "configured", auth: "Géré par Idealy", operations: ["Lire l'abonnement courant", "Lire une facture"] },
];

export const agents: Agent[] = [
  { name: "Chief", role: "Orchestration", letter: "C", color: "violet", detail: "Découpe la demande en étapes et coordonne le travail." },
  { name: "Builder", role: "Ingénierie", letter: "B", color: "green", detail: "Structure le projet et prépare les composants fonctionnels." },
  { name: "Designer", role: "Interface", letter: "D", color: "pink", detail: "Traduit les objectifs en une expérience visuelle cohérente." },
  { name: "Specialist", role: "Expertise", letter: "S", color: "blue", detail: "Apporte une expertise ciblée au besoin du projet." },
  { name: "Reviewer", role: "Qualité", letter: "R", color: "amber", detail: "Vérifie les choix et repère les améliorations possibles." },
];

export type AgentLook = { skin: string; hair: string; outfit: string; accent: string; backdrop: string };

export const agentLooks: Record<string, AgentLook> = {
  Chief: { skin: "#e9b795", hair: "#382653", outfit: "#7660df", accent: "#c7b8ff", backdrop: "#f0ecff" },
  Builder: { skin: "#c88d6d", hair: "#2c2928", outfit: "#24a986", accent: "#b6f0dd", backdrop: "#e4f8f1" },
  Designer: { skin: "#e9b394", hair: "#94436f", outfit: "#d776b6", accent: "#ffd1ed", backdrop: "#fff0fa" },
  Specialist: { skin: "#b77b5a", hair: "#20324e", outfit: "#5488df", accent: "#bdd4ff", backdrop: "#eaf2ff" },
  Reviewer: { skin: "#f0c29b", hair: "#78501f", outfit: "#d39a39", accent: "#ffe4a7", backdrop: "#fff4dc" },
};

export const templateCards = [
  { name: "Application web", category: "Produit", description: "Un produit complet avec comptes et espace personnel.", icon: "LayoutDashboard", tint: "violet", prompt: "Construis une application web moderne avec un tableau de bord, une connexion et un espace personnel." },
  { name: "Site de marque", category: "Web", description: "Une présence claire, rapide et mémorable.", icon: "Globe", tint: "green", prompt: "Crée un site de marque élégant, responsive, avec une page d'accueil, des offres et un formulaire de contact." },
  { name: "Outil interne", category: "Équipe", description: "Un espace de travail adapté à une équipe.", icon: "ListTodo", tint: "blue", prompt: "Crée un outil interne simple pour organiser les projets, les tâches et les membres d'une équipe." },
];

export const pricingPlans = [
  {
    name: "Découverte", key: "free", text: "Explorez Idealy, concevez vos premières idées et découvrez l'escouade multi-agents.",
    icon: "Compass", tint: "green", monthly: 0, annual: 0, points: "200 Power Points / mois", cap: "Plafond : 250 Power Points",
    features: ["Jusqu'à 3 projets", "1 mission active", "Accès aux 4 Voies et orchestration multi-agents", "VFS et export ZIP du projet", "Aperçu temps réel du code généré"],
    action: "Offre Découverte",
  },
  {
    name: "Professionnel", key: "pro", text: "Pour les créateurs, freelances et développeurs qui construisent des applications réelles.",
    icon: "Zap", tint: "violet", monthly: 19, annual: 190.8, points: "2 500 Power Points / mois", cap: "Plafond : 3 500 Power Points",
    features: ["Projets illimités", "Jusqu'à 5 missions actives", "Intégration GitHub OAuth et synchronisation des branches", "VFS jusqu'à 300 fichiers par mission", "Modèles IA avancés", "Support prioritaire"],
    action: "Voir les détails",
  },
  {
    name: "Business", key: "business", text: "Pour les startups, agences et équipes qui ont besoin d'une capacité de génération soutenue.",
    icon: "Blocks", tint: "blue", monthly: 49, annual: 490.8, points: "4 000 Power Points / mois", cap: "Plafond : 7 000 Power Points",
    features: ["Projets illimités", "Jusqu'à 20 missions actives", "VFS jusqu'à 1 000 fichiers par mission", "Accès anticipé aux connecteurs MCP et aux intégrations cloud", "Boucle d'auto-correction Reviewer en 3 passes", "SLA annoncé à 99,9 % et support direct ingénierie"],
    action: "Voir les détails",
  },
  {
    name: "Enterprise", key: "enterprise", text: "Pour les organisations qui ont besoin de quotas, de gouvernance et d'un accompagnement sur mesure.",
    icon: "ShieldCheck", tint: "amber", monthly: null as number | null, annual: null as number | null, points: null as string | null, cap: null as string | null,
    features: ["Quotas et espaces sur mesure", "Gouvernance et sécurité", "Conditions et accompagnement sur mesure"],
    action: "Offre sur mesure",
  },
];

export function classifyPrompt(text: string): "greeting" | "question" | "build" {
  const cleaned = text.trim().toLowerCase().replace(/[.!?,]+$/g, "");
  const withoutGreeting = cleaned.replace(/^(hey|hi|hello|salut|bonjour|bonsoir|coucou|yo)[,\s!]+/i, "").trim();
  const greetingPattern = /^(hey|hi|hello|salut|bonjour|bonsoir|coucou|yo|hola|ca va|ça va|how are you|good morning|good evening)(?:\s+(there|idealy|tout le monde))?$/i;
  if (greetingPattern.test(cleaned)) return "greeting";

  const hasBuildIntent = /\b(crée|créer|créez|construis|construire|développe|développer|génère|générer|fabrique|conçois|réalise|implémente|produis|build|create|make|develop|generate|implement|code)\b/i.test(withoutGreeting);
  const startsAsQuestion = /^(comment|pourquoi|qu['']est-ce|qu['']est ce|explique|what is|what's|why|how does|how do|explain|peux-tu m'expliquer|peux tu m'expliquer|can you explain|could you explain)\b/i.test(withoutGreeting);
  const asksQuestion = withoutGreeting.endsWith("?") || startsAsQuestion;

  if (asksQuestion && !hasBuildIntent) return "question";
  return "build";
}
