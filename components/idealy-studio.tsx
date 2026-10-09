"use client";

import {
  Activity, ArrowRight, ArrowUpRight, Bell, Blocks,
  Check, CheckCheck, ChevronDown, ChevronRight, CircleHelp, Clock3, Code2, Command,
  Compass, CreditCard, Database, FileText, Filter,
  GitBranch, Globe, History, Keyboard, Layers, LayoutDashboard, ListTodo,
  LockKeyhole, Menu, Moon, MoreHorizontal, PanelLeftClose, PanelLeftOpen,
  Plus, Search, Settings2, ShieldCheck, Sparkles, Sun, WandSparkles, Workflow,
  X, Zap, Eye, SlidersHorizontal, Play, RefreshCw, ArrowUp, Paperclip,
  type LucideIcon,
} from "lucide-react";
import {
  siCanva, siDiscord, siFigma, siGithub, siGoogle, siNotion, siOpenai,
  siSlack, siStripe, siSupabase, siVercel,
} from "simple-icons";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { addEdge, Background, Controls, Handle, MiniMap, Position, ReactFlow, useEdgesState, useNodesState, type Connection, type Edge, type Node, type NodeProps } from "@xyflow/react";
import { Toaster, toast } from "sonner";

type View = "studio" | "canvas" | "agents" | "connectors" | "activity" | "pricing" | "settings";
type SimpleBrand = { title: string; hex: string; path: string };
type Connector = { name: string; description: string; category: "Build" | "Design" | "Data" | "Team"; brand: SimpleBrand; popular?: boolean };

const connectors: Connector[] = [
  { name: "GitHub", description: "Dépôts, branches et revues de code.", category: "Build", brand: siGithub, popular: true },
  { name: "Supabase", description: "Base de données, authentification et fichiers.", category: "Data", brand: siSupabase, popular: true },
  { name: "Vercel", description: "Aperçus et déploiements de votre application.", category: "Build", brand: siVercel, popular: true },
  { name: "Figma", description: "Maquettes, composants et design system.", category: "Design", brand: siFigma, popular: true },
  { name: "Canva", description: "Visuels, présentations et contenus de marque.", category: "Design", brand: siCanva },
  { name: "Stripe", description: "Paiements et gestion des abonnements.", category: "Data", brand: siStripe },
  { name: "Notion", description: "Notes, spécifications et documentation.", category: "Team", brand: siNotion },
  { name: "Slack", description: "Notifications et conversations d’équipe.", category: "Team", brand: siSlack },
  { name: "Google", description: "Services et fichiers Google Workspace.", category: "Team", brand: siGoogle },
  { name: "OpenAI", description: "Fournisseurs de modèles et outils IA.", category: "Build", brand: siOpenai },
  { name: "Discord", description: "Communauté et alertes de projet.", category: "Team", brand: siDiscord },
];

const navItems: { id: View; label: string; icon: LucideIcon; group: "create" | "manage" }[] = [
  { id: "studio", label: "Studio", icon: Sparkles, group: "create" },
  { id: "canvas", label: "Canvas", icon: Workflow, group: "create" },
  { id: "agents", label: "Équipe d’agents", icon: Blocks, group: "create" },
  { id: "connectors", label: "Connecteurs", icon: GitBranch, group: "manage" },
  { id: "activity", label: "Activité", icon: Activity, group: "manage" },
  { id: "pricing", label: "Offres", icon: CreditCard, group: "manage" },
  { id: "settings", label: "Paramètres", icon: Settings2, group: "manage" },
];

const agents = [
  { name: "Chief", role: "Orchestration", letter: "C", color: "violet", detail: "Découpe la demande en étapes et coordonne le travail." },
  { name: "Builder", role: "Ingénierie", letter: "B", color: "green", detail: "Structure le projet et prépare les composants fonctionnels." },
  { name: "Designer", role: "Interface", letter: "D", color: "pink", detail: "Traduit les objectifs en une expérience visuelle cohérente." },
  { name: "Specialist", role: "Expertise", letter: "S", color: "blue", detail: "Apporte une expertise ciblée au besoin du projet." },
  { name: "Reviewer", role: "Qualité", letter: "R", color: "amber", detail: "Vérifie les choix et repère les améliorations possibles." },
];

const activityItems = [
  { title: "Workspace initialisé", detail: "Structure de projet préparée localement", time: "À l’instant", icon: Layers, tint: "violet" },
  { title: "Palette de commandes disponible", detail: "Utilisez Ctrl K pour accéder rapidement aux actions", time: "Récemment", icon: Command, tint: "blue" },
  { title: "Connecteurs catalogués", detail: "11 services affichés, sans connexion externe active", time: "Récemment", icon: GitBranch, tint: "green" },
];

type FlowStageData = {
  step: string;
  title: string;
  description: string;
  status: "done" | "active" | "next";
};

const initialFlowNodes: Node<FlowStageData>[] = [
  { id: "scope", type: "stage", position: { x: 140, y: 24 }, data: { step: "01", title: "Définir le périmètre", description: "Clarifier l’objectif et les utilisateurs.", status: "done" } },
  { id: "design", type: "stage", position: { x: 140, y: 190 }, data: { step: "02", title: "Concevoir l’expérience", description: "Organiser les écrans, composants et états.", status: "active" } },
  { id: "build", type: "stage", position: { x: 140, y: 356 }, data: { step: "03", title: "Construire la solution", description: "Préparer l’interface et les comportements.", status: "next" } },
  { id: "review", type: "stage", position: { x: 140, y: 522 }, data: { step: "04", title: "Vérifier la qualité", description: "Accessibilité, responsive et cohérence.", status: "next" } },
];

const initialFlowEdges: Edge[] = [
  { id: "scope-design", source: "scope", target: "design", type: "smoothstep" },
  { id: "design-build", source: "design", target: "build", type: "smoothstep" },
  { id: "build-review", source: "build", target: "review", type: "smoothstep" },
];

function FlowStageCard({ data, selected }: NodeProps<Node<FlowStageData>>) {
  const statusLabel = data.status === "done" ? "Préparé" : data.status === "active" ? "Prochaine étape" : "À venir";
  return (
    <div className={`flow-node flow-node-${data.status} ${selected ? "flow-node-selected" : ""}`}>
      <Handle type="target" position={Position.Top} />
      <div className="flow-node-number">{data.status === "done" ? <Check size={14} /> : data.step}</div>
      <div className="flow-node-copy"><strong>{data.title}</strong><span>{data.description}</span></div>
      <span className="flow-node-status">{statusLabel}</span>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

const flowNodeTypes = { stage: FlowStageCard };

function BrandMark({ size = 22 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="idealy-gradient" x1="3" y1="5" x2="43" y2="43" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9B7BFF" />
          <stop offset="1" stopColor="#21C7A8" />
        </linearGradient>
      </defs>
      <path d="M24 2.5 30.6 17.4 45.5 24 30.6 30.6 24 45.5 17.4 30.6 2.5 24 17.4 17.4 24 2.5Z" fill="url(#idealy-gradient)" />
      <path d="M24 14.2 27.6 20.4 33.8 24 27.6 27.6 24 33.8 20.4 27.6 14.2 24 20.4 20.4 24 14.2Z" fill="white" fillOpacity=".94" />
    </svg>
  );
}

function BrandIcon({ brand, size = 23 }: { brand: SimpleBrand; size?: number }) {
  return (
    <svg aria-label={brand.title} role="img" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d={brand.path} />
    </svg>
  );
}

function NavButton({ active, icon: Icon, label, onClick, badge, collapsed = false }: {
  active: boolean; icon: LucideIcon; label: string; onClick: () => void; badge?: string; collapsed?: boolean;
}) {
  return (
    <button className={`nav-item ${active ? "nav-item-active" : ""}`} onClick={onClick} type="button" title={collapsed ? label : undefined} aria-label={label}>
      <Icon size={17} strokeWidth={active ? 2.1 : 1.8} />
      <span className={collapsed ? "nav-label-collapsed" : ""}>{label}</span>
      {badge && !collapsed ? <span className="nav-badge">{badge}</span> : null}
      {active ? <motion.span className="nav-active-edge" layoutId="nav-edge" /> : null}
    </button>
  );
}

function SectionHeading({ eyebrow, title, description, action }: {
  eyebrow?: string; title: string; description?: string; action?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {action ? <div className="section-action">{action}</div> : null}
    </div>
  );
}

function WorkspaceIcon({ icon: Icon, tint = "violet" }: { icon: LucideIcon; tint?: string }) {
  return <span className={`workspace-icon tint-${tint}`}><Icon size={17} /></span>;
}

function EmptyMark() {
  return <div className="empty-mark"><BrandMark size={31} /></div>;
}

export function IdealyStudio() {
  const [view, setView] = useState<View>("studio");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");
  const [activeCommandIndex, setActiveCommandIndex] = useState(0);
  const [input, setInput] = useState("");
  const [projectPrompt, setProjectPrompt] = useState("");
  const [projectTitle, setProjectTitle] = useState("Mon prochain projet");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [connectorQuery, setConnectorQuery] = useState("");
  const [connectorCategory, setConnectorCategory] = useState("Tous");
  const [selectedConnector, setSelectedConnector] = useState<Connector | null>(null);
  const [configuredConnectors, setConfiguredConnectors] = useState<string[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [language, setLanguage] = useState("Français");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsRead, setNotificationsRead] = useState(false);
  const [canvasTab, setCanvasTab] = useState<"Aperçu" | "Plan" | "Code" | "Données">("Plan");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAgentPanel, setShowAgentPanel] = useState(true);
  const [flowNodes, , onFlowNodesChange] = useNodesState(initialFlowNodes);
  const [flowEdges, setFlowEdges, onFlowEdgesChange] = useEdgesState(initialFlowEdges);
  const onFlowConnect = useCallback((connection: Connection) => setFlowEdges((current) => addEdge(connection, current)), [setFlowEdges]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((open) => {
          if (!open) {
            setCommandQuery("");
            setActiveCommandIndex(0);
          }
          return !open;
        });
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "j") {
        event.preventDefault();
        setView("studio");
        setInput("");
        setProjectPrompt("");
        setSelectedTemplate(null);
      }
      if (event.key === "Escape") {
        setCommandOpen(false);
        setNotificationsOpen(false);
        setSelectedConnector(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filteredConnectors = useMemo(() => connectors.filter((item) => {
    const matchesQuery = `${item.name} ${item.description}`.toLowerCase().includes(connectorQuery.toLowerCase());
    const matchesCategory = connectorCategory === "Tous" || item.category === connectorCategory;
    return matchesQuery && matchesCategory;
  }), [connectorQuery, connectorCategory]);

  const commands = useMemo(() => {
    const all = [
      { label: "Créer un nouveau projet", hint: "Nouvelle session", icon: Plus, action: () => { setView("studio"); setInput(""); setProjectPrompt(""); } },
      { label: "Ouvrir le canvas", hint: "Espace de travail", icon: Workflow, action: () => setView("canvas") },
      { label: "Voir les agents", hint: "Orchestration", icon: Blocks, action: () => setView("agents") },
      { label: "Gérer les connecteurs", hint: "Intégrations", icon: GitBranch, action: () => setView("connectors") },
      { label: "Voir l’activité", hint: "Historique", icon: History, action: () => setView("activity") },
      { label: "Changer l’apparence", hint: "Thème", icon: theme === "light" ? Moon : Sun, action: () => setTheme(theme === "light" ? "dark" : "light") },
      { label: "Ouvrir les paramètres", hint: "Préférences", icon: Settings2, action: () => setView("settings") },
    ];
    return all.filter((item) => item.label.toLowerCase().includes(commandQuery.toLowerCase()));
  }, [commandQuery, theme]);

  const startProject = useCallback((prompt?: string) => {
    const chosen = (prompt ?? input).trim();
    if (!chosen) {
      toast("Décrivez d’abord votre idée", { description: "Une phrase suffit pour commencer." });
      return;
    }
    setProjectPrompt(chosen);
    const firstWords = chosen.replace(/[.!?].*$/, "").split(/\s+/).slice(0, 5).join(" ");
    setProjectTitle(firstWords.length > 2 ? firstWords.charAt(0).toUpperCase() + firstWords.slice(1) : "Nouveau projet");
    setInput("");
    setView("canvas");
    toast.success("Votre espace de travail est prêt", {
      description: "Aperçu de démonstration : le moteur IA n’est pas encore connecté.",
    });
  }, [input]);

  const navigate = (next: View) => {
    setView(next);
    setMobileMenuOpen(false);
    setNotificationsOpen(false);
  };

  const handleConnect = (name: string) => {
    setConfiguredConnectors((current) => current.includes(name) ? current : [...current, name]);
    toast("Connecteur préparé", {
      description: `${name} est marqué « prêt à configurer » dans cette maquette. Aucun compte externe n’a été lié.`,
    });
  };


  useEffect(() => {
    if (!commandOpen) return;
    const onPaletteKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        setActiveCommandIndex((current) => {
          if (!commands.length) return 0;
          return event.key === "ArrowDown"
            ? (current + 1) % commands.length
            : (current - 1 + commands.length) % commands.length;
        });
      }
      if (event.key === "Enter" && commands[activeCommandIndex]) {
        event.preventDefault();
        commands[activeCommandIndex].action();
        setCommandOpen(false);
        setCommandQuery("");
      }
    };
    window.addEventListener("keydown", onPaletteKeyDown);
    return () => window.removeEventListener("keydown", onPaletteKeyDown);
  }, [activeCommandIndex, commandOpen, commands]);

  const templateCards = [
    { name: "Application web", category: "Produit", description: "Un produit complet avec comptes et espace personnel.", icon: LayoutDashboard, tint: "violet", prompt: "Construis une application web moderne avec un tableau de bord, une connexion et un espace personnel." },
    { name: "Site de marque", category: "Web", description: "Une présence claire, rapide et mémorable.", icon: Globe, tint: "green", prompt: "Crée un site de marque élégant, responsive, avec une page d’accueil, des offres et un formulaire de contact." },
    { name: "Outil interne", category: "Équipe", description: "Un espace de travail adapté à une équipe.", icon: ListTodo, tint: "blue", prompt: "Crée un outil interne simple pour organiser les projets, les tâches et les membres d’une équipe." },
  ];

  return (
    <div className="app-frame">
      <Toaster position="bottom-right" richColors closeButton theme={theme} />
      <aside className={`sidebar ${sidebarOpen ? "" : "sidebar-collapsed"} ${mobileMenuOpen ? "sidebar-mobile-open" : ""}`}>
        <div className="sidebar-brand-row">
          <button className="brand-lockup" onClick={() => navigate("studio")} type="button" aria-label="Accueil Idealy">
            <span className="brand-symbol"><BrandMark size={29} /></span>
            {sidebarOpen ? <span className="brand-type">idealy<span>.</span></span> : null}
          </button>
          {sidebarOpen ? (
            <button className="icon-button subtle" aria-label="Réduire la navigation" onClick={() => setSidebarOpen(false)} type="button"><PanelLeftClose size={17} /></button>
          ) : (
            <button className="icon-button subtle collapse-open" aria-label="Développer la navigation" onClick={() => setSidebarOpen(true)} type="button"><PanelLeftOpen size={17} /></button>
          )}
        </div>

        <button className="workspace-switcher" onClick={() => toast("Workspace personnel", { description: "La gestion multi-espace sera raccordée au compte existant." })} type="button">
          <span className="workspace-avatar">O</span>
          {sidebarOpen ? <><span className="workspace-meta"><strong>Mon espace</strong><small>Workspace personnel</small></span><ChevronDown size={15} className="muted-icon" /></> : null}
        </button>

        <button className="new-project-button" onClick={() => { navigate("studio"); setInput(""); setProjectPrompt(""); }} type="button">
          <Plus size={17} /><span>{sidebarOpen ? "Nouveau projet" : ""}</span>
          {sidebarOpen ? <kbd>Ctrl J</kbd> : null}
        </button>

        <div className="sidebar-scroll">
          {sidebarOpen ? <div className="nav-section-label">ESPACE DE CRÉATION</div> : null}
          <nav className="nav-group" aria-label="Espace de création">
            {navItems.filter((item) => item.group === "create").map((item) => (
              <NavButton key={item.id} active={view === item.id} icon={item.icon} label={item.label} collapsed={!sidebarOpen} onClick={() => navigate(item.id)} />
            ))}
          </nav>
          {sidebarOpen ? <div className="nav-section-label nav-section-second">VOTRE ESPACE</div> : null}
          <nav className="nav-group" aria-label="Gestion de l’espace">
            {navItems.filter((item) => item.group === "manage").map((item) => (
              <NavButton key={item.id} active={view === item.id} icon={item.icon} label={item.label} collapsed={!sidebarOpen} onClick={() => navigate(item.id)} badge={item.id === "connectors" ? (sidebarOpen ? "11" : undefined) : undefined} />
            ))}
          </nav>

          {sidebarOpen ? (
            <div className="sidebar-projects">
              <div className="projects-heading"><span>RÉCENTS</span><button className="mini-icon" aria-label="Ajouter un projet" onClick={() => navigate("studio")} type="button"><Plus size={14} /></button></div>
              <button className={`recent-project ${view === "canvas" ? "recent-project-active" : ""}`} onClick={() => navigate("canvas")} type="button">
                <span className="recent-dot dot-violet" /><span>{projectTitle}</span><MoreHorizontal size={15} className="recent-more" />
              </button>
              <button className="recent-project" onClick={() => toast("Aucun autre projet", { description: "Les projets sauvegardés apparaîtront ici une fois la persistance raccordée." })} type="button">
                <span className="recent-dot dot-green" /><span>Explorer Idealy</span>
              </button>
            </div>
          ) : null}
        </div>

        <div className="sidebar-bottom">
          {sidebarOpen ? (
            <div className="usage-card">
              <div className="usage-top"><span className="usage-stars"><Sparkles size={14} /></span><span>Un espace pour aller plus loin</span></div>
              <p>Les fonctionnalités avancées seront ajoutées progressivement.</p>
              <button type="button" onClick={() => navigate("pricing")}>Découvrir les offres <ArrowRight size={13} /></button>
            </div>
          ) : null}
          <button className="profile-row" onClick={() => navigate("settings")} type="button">
            <span className="profile-avatar">O</span>
            {sidebarOpen ? <><span className="profile-meta"><strong>Mon profil</strong><small>Paramètres du compte</small></span><MoreHorizontal size={17} /></> : null}
          </button>
        </div>
      </aside>
      {mobileMenuOpen ? <button className="mobile-scrim" aria-label="Fermer la navigation" onClick={() => setMobileMenuOpen(false)} type="button" /> : null}

      <main className="main-shell">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button mobile-menu-trigger" onClick={() => { setSidebarOpen(true); setMobileMenuOpen(!mobileMenuOpen); }} type="button" aria-label="Ouvrir la navigation"><Menu size={18} /></button>
            <div className="breadcrumb">
              <span className="breadcrumb-root">Idealy</span><ChevronRight size={13} />
              <span>{navItems.find((item) => item.id === view)?.label ?? "Studio"}</span>
              {view === "canvas" ? <><ChevronRight size={13} /><strong>{projectTitle}</strong></> : null}
            </div>
          </div>
          <div className="topbar-actions">
            <button className="command-trigger" type="button" onClick={() => { setCommandQuery(""); setActiveCommandIndex(0); setCommandOpen(true); }}>
              <Search size={15} /><span>Rechercher</span><kbd>Ctrl K</kbd>
            </button>
            <div className="topbar-divider" />
            <button className="icon-button top-action" type="button" aria-label="Aide" onClick={() => toast("Centre d’aide", { description: "La documentation Idealy sera reliée ici." })}><CircleHelp size={18} /></button>
            <div className="notification-wrap">
              <button className="icon-button top-action" type="button" aria-label="Notifications" onClick={() => setNotificationsOpen(!notificationsOpen)}><Bell size={18} />{!notificationsRead ? <i className="notification-dot" /> : null}</button>
              <AnimatePresence>
                {notificationsOpen ? (
                  <motion.div className="notification-popover" initial={{ opacity: 0, y: -6, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: .98 }} transition={{ duration: .16 }}>
                    <div className="popover-heading"><div><strong>Notifications</strong><span>Votre espace, en un coup d’œil</span></div><button className="mini-icon" onClick={() => setNotificationsRead(true)} type="button" title="Tout marquer comme lu"><CheckCheck size={15} /></button></div>
                    <div className="notification-item"><span className="notification-symbol"><Sparkles size={15} /></span><div><strong>Bienvenue dans le nouveau Studio</strong><p>Explorez le canvas et la palette de commandes.</p><small>À l’instant</small></div></div>
                    <div className="notification-item"><span className="notification-symbol green"><GitBranch size={15} /></span><div><strong>Connecteurs disponibles</strong><p>Préparez vos intégrations depuis le catalogue.</p><small>Récemment</small></div></div>
                    <button className="popover-footer" onClick={() => { setNotificationsRead(true); setNotificationsOpen(false); navigate("activity"); }} type="button">Voir toute l’activité <ArrowRight size={14} /></button>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
            <button className="theme-toggle" type="button" aria-label="Changer le thème" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>{theme === "light" ? <Moon size={16} /> : <Sun size={16} />}</button>
          </div>
        </header>

        <div className="content-scroll">
          <AnimatePresence mode="wait">
            <motion.div className="view-content" key={view} initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: .18, ease: "easeOut" }}>
              {view === "studio" ? (
                <div className="studio-page">
                  <div className="welcome-kicker"><span className="live-pip" /> VOTRE ESPACE DE CRÉATION</div>
                  <section className="hero-block">
                    <div className="hero-mark"><BrandMark size={42} /></div>
                    <h1>Une idée en tête ?<br /><span>Construisons-la ensemble.</span></h1>
                    <p>Décrivez ce que vous imaginez. Idealy vous aide à organiser les prochaines étapes et à donner forme à votre projet.</p>
                    <div className="hero-chips"><span><WandSparkles size={14} /> De l’idée au plan</span><span><Workflow size={14} /> Un canvas vivant</span><span><ShieldCheck size={14} /> Vous gardez le contrôle</span></div>
                  </section>

                  <form className="prompt-composer" onSubmit={(event) => { event.preventDefault(); startProject(); }}>
                    <div className="composer-topline"><span className="composer-dot" /><span>Nouvelle mission</span><span className="composer-note">Commencez simplement</span></div>
                    <textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); startProject(); } }} placeholder="J’aimerais créer une application qui aide les petites équipes à…" rows={3} aria-label="Décrivez votre idée" />
                    <div className="composer-bottom"><div className="composer-tools"><button type="button" className="composer-tool" onClick={() => toast("Ajout de fichier", { description: "Les pièces jointes seront reliées au stockage du projet." })}><Paperclip size={16} /><span>Ajouter</span></button><button type="button" className="composer-tool" onClick={() => toast("Contexte du projet", { description: "Le contexte sera sauvegardé lorsque la persistance sera raccordée." })}><Layers size={16} /><span>Contexte</span></button><span className="composer-hint"><Keyboard size={13} /> Entrée pour envoyer</span></div><BaseButton type="submit" className="send-button" aria-label="Préparer le projet"><ArrowUp size={18} /><span>Commencer</span></BaseButton></div>
                  </form>

                  <div className="template-section">
                    <div className="template-heading"><div><span className="eyebrow">POUR DÉMARRER PLUS VITE</span><h2>Ou partez d’un point de départ</h2></div><button className="text-action" onClick={() => toast("Galerie de modèles", { description: "Les modèles complets seront chargés depuis le catalogue Idealy." })} type="button">Explorer les modèles <ArrowRight size={14} /></button></div>
                    <div className="template-grid">
                      {templateCards.map((template, index) => (
                        <motion.button key={template.name} className={`template-card ${selectedTemplate === template.name ? "template-card-selected" : ""}`} onClick={() => { setSelectedTemplate(template.name); setInput(template.prompt); }} whileHover={{ y: -3 }} whileTap={{ scale: .99 }} type="button" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .055 }}>
                          <div className="template-card-top"><WorkspaceIcon icon={template.icon} tint={template.tint} /><span className="template-category">{template.category}</span><ArrowUpRight size={15} className="template-arrow" /></div>
                          <strong>{template.name}</strong><p>{template.description}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="bottom-note"><span className="tiny-spark"><BrandMark size={15} /></span><span>Pas besoin d’avoir tout prévu. Votre idée peut évoluer en chemin.</span><button type="button" onClick={() => navigate("agents")}>Comment ça fonctionne ? <ArrowRight size={13} /></button></div>
                </div>
              ) : null}

              {view === "canvas" ? (
                <div className="canvas-page">
                  <div className="canvas-title-row">
                    <div><div className="eyebrow">WORKSPACE / PROJET</div><h1>{projectTitle}</h1><p>{projectPrompt || "Votre espace de projet. Les prochaines étapes pourront être affinées ici."}</p></div>
                    <div className="canvas-title-actions"><span className="draft-status"><i /> Brouillon local</span><button className="outline-button" onClick={() => toast("Lien indisponible", { description: "Le partage sera activé une fois les comptes et droits raccordés." })} type="button"><ArrowUpRight size={15} /> Partager</button><button className="primary-button" onClick={() => toast("Aucune génération lancée", { description: "Le moteur IA n’est pas encore relié à cette interface." })} type="button"><Play size={15} /> Lancer</button></div>
                  </div>
                  <div className="canvas-toolbar"><div className="canvas-tabs">{(["Aperçu", "Plan", "Code", "Données"] as const).map((tab) => <button key={tab} onClick={() => setCanvasTab(tab)} className={canvasTab === tab ? "canvas-tab active" : "canvas-tab"} type="button">{tab === "Aperçu" ? <Eye size={14} /> : tab === "Plan" ? <Workflow size={14} /> : tab === "Code" ? <Code2 size={14} /> : <Database size={14} />}{tab}</button>)}</div><div className="canvas-toolbar-right"><span><span className="status-green-dot" /> Auto-layout</span><button className="mini-icon" type="button" onClick={() => toast("Canvas ajusté", { description: "La disposition actuelle est déjà centrée." })} aria-label="Recentrer le canvas"><RefreshCw size={15} /></button><button className="mini-icon" type="button" onClick={() => setShowAgentPanel(!showAgentPanel)} aria-label="Afficher ou masquer les agents"><SlidersHorizontal size={15} /></button></div></div>
                  <div className={`workspace-layout ${showAgentPanel ? "" : "workspace-layout-wide"}`}>
                    <section className="flow-canvas">
                      {canvasTab === "Code" ? (
                        <div className="code-placeholder"><div className="code-header"><span /><span /><span /><strong>project-plan.ts</strong></div><pre><code><span className="code-purple">export const</span> project = {'{'}{"\n"}  name: <span className="code-green">"{projectTitle}"</span>,{"\n"}  status: <span className="code-green">"draft"</span>,{"\n"}  stages: [<span className="code-green">"scope"</span>, <span className="code-green">"design"</span>,{"\n"}    <span className="code-green">"build"</span>, <span className="code-green">"review"</span>],{"\n"}  aiConnected: <span className="code-orange">false</span>,{"\n"}{'}'};</code></pre><div className="code-footnote"><LockKeyhole size={14} /> Exemple de structure — pas un fichier réellement généré.</div></div>
                      ) : canvasTab === "Données" ? (
                        <div className="canvas-empty-state"><div className="large-outline-icon"><Database size={24} /></div><h3>Les données de votre projet apparaîtront ici</h3><p>Connectez une base de données pour explorer les tables et les relations. Aucun service n’est encore relié.</p><button className="outline-button" onClick={() => navigate("connectors")} type="button">Voir les connecteurs <ArrowRight size={14} /></button></div>
                      ) : canvasTab === "Aperçu" ? (
                        <div className="preview-mock">
                          <div className="preview-browser"><div className="browser-dots"><i /><i /><i /></div><div className="browser-address"><LockKeyhole size={11} /> preview.idealy.local / {projectTitle.toLowerCase().replace(/\s+/g, "-")}</div><button className="mini-icon" title="Ouvrir les options" onClick={() => toast("Aperçu de démonstration", { description: "Aucun site n’est déployé pour le moment." })} type="button"><MoreHorizontal size={15} /></button></div>
                          <div className="preview-content"><div className="preview-nav"><span className="preview-logo"><BrandMark size={20} /> {projectTitle.split(" ").slice(0, 2).join(" ")}</span><div><span>Fonctionnalités</span><span>À propos</span><button onClick={() => toast("Aperçu uniquement", { description: "Les liens du site seront actifs lorsque le projet sera construit." })} type="button">Commencer <ArrowRight size={12} /></button></div></div><div className="preview-hero"><span className="preview-eyebrow"><Sparkles size={12} /> LE POINT DE DÉPART</span><h2>Les bonnes idées<br /><span>méritent de prendre forme.</span></h2><p>{projectPrompt || "Un espace clair pour transformer votre intention en une expérience utile, soignée et simple à utiliser."}</p><button type="button" onClick={() => toast("Ceci est une maquette", { description: "Le site réel sera construit par les agents une fois le moteur raccordé." })}>Découvrir le projet <ArrowRight size={14} /></button><div className="preview-orbit"><div className="preview-orbit-inner"><BrandMark size={54} /></div><span className="orbit-chip chip-one"><Sparkles size={13} /> Idée</span><span className="orbit-chip chip-two"><Layers size={13} /> Structure</span><span className="orbit-chip chip-three"><Check size={13} /> Clarté</span></div></div><div className="preview-bottom-cards"><div><Layers size={17} /><strong>Une base claire</strong><span>Une structure pensée pour évoluer.</span></div><div><Zap size={17} /><strong>Moins de friction</strong><span>Le bon chemin, étape par étape.</span></div><div><ShieldCheck size={17} /><strong>Vous gardez la main</strong><span>Chaque choix reste visible.</span></div></div></div>
                        </div>
                      ) : (
                        <div className="plan-canvas plan-canvas-interactive">
                          <div className="plan-canvas-heading"><div><span className="eyebrow">FLUX DU PROJET</span><h2>De l’idée à la livraison</h2></div><span className="plan-count">4 étapes · déplaçables</span></div>
                          <div className="reactflow-wrapper">
                            <ReactFlow
                              nodes={flowNodes}
                              edges={flowEdges}
                              onNodesChange={onFlowNodesChange}
                              onEdgesChange={onFlowEdgesChange}
                              onConnect={onFlowConnect}
                              nodeTypes={flowNodeTypes}
                              fitView
                              fitViewOptions={{ padding: 0.18 }}
                              minZoom={0.35}
                              maxZoom={1.4}
                              proOptions={{ hideAttribution: true }}
                            >
                              <Background color="var(--line-strong)" gap={19} size={1} />
                              <Controls position="bottom-right" />
                              <MiniMap position="bottom-left" pannable zoomable maskColor="rgba(120,90,210,.08)" />
                            </ReactFlow>
                          </div>
                          <div className="plan-footer-note"><Sparkles size={15} /><span>Déplacez les étapes et reliez les nœuds. Ce canvas est interactif ; l’orchestrateur réel n’est pas encore connecté.</span></div>
                        </div>
                      )}
                    </section>
                    {showAgentPanel ? <aside className="agent-rail"><div className="agent-rail-header"><div><span className="eyebrow">ORCHESTRATION</span><h3>Équipe Idealy</h3></div><button className="mini-icon" onClick={() => navigate("agents")} type="button" aria-label="Voir l’équipe"><ArrowUpRight size={15} /></button></div><div className="agent-running-note"><span className="agent-pulse"><span /></span><div><strong>En attente de lancement</strong><span>Prête à recevoir votre mission</span></div></div><div className="agent-list">{agents.map((agent) => <button className="agent-mini-row" key={agent.name} onClick={() => navigate("agents")} type="button"><span className={`agent-avatar agent-${agent.color}`}>{agent.letter}</span><span className="agent-mini-meta"><strong>{agent.name}</strong><small>{agent.role}</small></span><span className="agent-idle">Repos</span></button>)}</div><div className="rail-divider" /><div className="rail-block-title"><span>CONTEXTE DU PROJET</span><button type="button" className="mini-icon" onClick={() => toast("Contexte", { description: "Les éléments de contexte seront conservés avec le projet." })}><Plus size={14} /></button></div><button className="context-entry" onClick={() => toast("Brief", { description: projectPrompt || "Aucun brief ajouté pour le moment." })} type="button"><FileText size={16} /><span><strong>Brief du projet</strong><small>{projectPrompt ? "1 élément de contexte" : "Aucun brief enregistré"}</small></span><ChevronRight size={14} /></button><button className="context-entry" onClick={() => navigate("connectors")} type="button"><GitBranch size={16} /><span><strong>Connecteurs</strong><small>{configuredConnectors.length} préparé(s)</small></span><ChevronRight size={14} /></button><div className="rail-bottom-tip"><Sparkles size={15} /><span>Les agents démarreront quand l’orchestration sera connectée.</span></div></aside> : null}
                  </div>
                </div>
              ) : null}

              {view === "agents" ? (
                <div className="standard-page">
                  <SectionHeading eyebrow="ORCHESTRATION" title="Une équipe, cinq rôles." description="Chaque agent a une responsabilité claire. L’orchestrateur les coordonnera selon le besoin réel du projet." action={<button className="outline-button" onClick={() => navigate("canvas")} type="button"><Workflow size={15} /> Ouvrir le canvas</button>} />
                  <div className="agent-intro-card"><div className="agent-intro-mark"><BrandMark size={40} /></div><div><span className="eyebrow">IDÉE → PLAN → CONSTRUCTION</span><h2>Pas cinq chatbots indépendants. Une équipe coordonnée.</h2><p>Chief répartit le travail, les spécialistes interviennent au bon moment et Reviewer vérifie la cohérence avant de faire avancer le projet.</p></div><div className="agent-intro-flow"><span>Chief</span><ArrowRight size={14} /><span>Spécialistes</span><ArrowRight size={14} /><span>Reviewer</span></div></div>
                  <div className="agents-grid">{agents.map((agent, index) => <motion.article key={agent.name} className="agent-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .05 }}><div className="agent-card-top"><span className={`agent-avatar agent-avatar-large agent-${agent.color}`}>{agent.letter}</span><span className="agent-status-idle"><i /> En attente</span></div><span className="eyebrow">AGENT 0{index + 1}</span><h3>{agent.name}</h3><div className="agent-role">{agent.role}</div><p>{agent.detail}</p><div className="agent-card-footer"><span><Clock3 size={13} /> Non lancé</span><button className="mini-icon" onClick={() => toast(agent.name, { description: "La fiche détaillée sera reliée à la configuration de l’orchestrateur." })} type="button" aria-label={`Détails de ${agent.name}`}><ArrowUpRight size={15} /></button></div></motion.article>)}</div>
                  <div className="notice-row"><ShieldCheck size={17} /><div><strong>Exécution réelle désactivée dans cette maquette</strong><span>Aucun agent n’est présenté comme actif. Les états évolueront en fonction des événements réels de l’orchestrateur.</span></div></div>
                </div>
              ) : null}

              {view === "connectors" ? (
                <div className="standard-page">
                  <SectionHeading eyebrow="ÉCOSYSTÈME" title="Tout votre espace, connecté." description="Choisissez les services qui aideront Idealy à travailler avec vos outils existants." action={<button className="outline-button" onClick={() => toast("Catalogue actualisé", { description: "Le catalogue local contient les services inclus dans cette maquette." })} type="button"><RefreshCw size={15} /> Actualiser</button>} />
                  <div className="connectors-summary"><div className="connector-summary-icon"><GitBranch size={20} /></div><div><strong>Vos outils, au même endroit.</strong><span>Les marques sont affichées avec leurs logos. Aucune connexion externe n’est active dans cette version.</span></div><div className="connector-summary-count"><strong>11</strong><span>services listés</span></div></div>
                  <div className="connector-controls"><label className="connector-search"><Search size={16} /><input value={connectorQuery} onChange={(event) => setConnectorQuery(event.target.value)} placeholder="Rechercher un connecteur…" aria-label="Rechercher un connecteur" /><kbd>/</kbd></label><div className="filter-group"><Filter size={14} />{["Tous", "Build", "Design", "Data", "Team"].map((cat) => <button key={cat} onClick={() => setConnectorCategory(cat)} type="button" className={connectorCategory === cat ? "filter-chip active" : "filter-chip"}>{cat}</button>)}</div></div>
                  <div className="connectors-grid">{filteredConnectors.map((connector, index) => <motion.article className="connector-card" key={connector.name} initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .025 }}><div className="connector-card-top"><div className="connector-brand" style={{ color: `#${connector.brand.hex}` }}><BrandIcon brand={connector.brand} size={25} /></div><div className="connector-card-heading"><strong>{connector.name}</strong><span>{connector.category}</span></div>{connector.popular ? <span className="popular-dot" title="Connecteur populaire" /> : null}</div><p>{connector.description}</p><div className="connector-card-bottom"><span className={configuredConnectors.includes(connector.name) ? "connector-ready" : "connector-available"}><i />{configuredConnectors.includes(connector.name) ? "Prêt à configurer" : "Disponible"}</span><button className="connector-action" onClick={() => setSelectedConnector(connector)} type="button">{configuredConnectors.includes(connector.name) ? "Gérer" : "Configurer"} <ArrowUpRight size={13} /></button></div></motion.article>)}</div>
                  {filteredConnectors.length === 0 ? <div className="no-results"><Search size={22} /><strong>Aucun connecteur trouvé</strong><span>Essayez un autre nom ou changez de catégorie.</span><button className="text-action" onClick={() => { setConnectorQuery(""); setConnectorCategory("Tous"); }} type="button">Effacer les filtres</button></div> : null}
                  <div className="connector-bottom-note"><LockKeyhole size={14} /> Les autorisations OAuth et les clés d’accès seront ajoutées côté serveur. Aucun secret ne doit être placé dans le navigateur.</div>
                </div>
              ) : null}

              {view === "activity" ? (
                <div className="standard-page">
                  <SectionHeading eyebrow="JOURNAL DU WORKSPACE" title="Tout ce qui se passe, au même endroit." description="Un historique lisible pour garder le contexte des projets et des actions." action={<button className="outline-button" onClick={() => { setNotificationsRead(true); toast.success("Notifications marquées comme lues"); }} type="button"><CheckCheck size={15} /> Tout marquer comme lu</button>} />
                  <div className="activity-layout"><div className="activity-timeline"><div className="timeline-date">AUJOURD’HUI</div>{activityItems.map((item) => <div className="timeline-item" key={item.title}><div className={`timeline-icon tint-${item.tint}`}><item.icon size={16} /></div><div className="timeline-content"><strong>{item.title}</strong><span>{item.detail}</span><small><Clock3 size={12} /> {item.time}</small></div><button className="mini-icon" onClick={() => toast(item.title, { description: item.detail })} type="button" aria-label={`Détails : ${item.title}`}><MoreHorizontal size={16} /></button></div>)}</div><aside className="activity-side-card"><div className="activity-side-illustration"><Activity size={28} /></div><h3>Gardez le fil.</h3><p>Les générations, changements de fichiers, validations d’agents et événements de connecteurs apparaîtront ici une fois les services raccordés.</p><button className="outline-button full-width" onClick={() => navigate("canvas")} type="button">Retour au workspace <ArrowRight size={14} /></button></aside></div>
                </div>
              ) : null}

              {view === "pricing" ? (
                <div className="standard-page pricing-page">
                  <SectionHeading
                    eyebrow="OFFRES IDEALY"
                    title="Un espace qui grandit avec vos projets."
                    description="Les offres et tarifs proviennent de la configuration produit existante. Choisissez une période pour comparer les tarifs affichés."
                  />
                  <div className="pricing-note">
                    <LockKeyhole size={16} />
                    <span><strong>Aucun paiement actif dans cette version.</strong> Les offres et tarifs sont affichés à titre informatif. Aucun checkout, abonnement ou changement de forfait ne sera lancé depuis cette interface.</span>
                  </div>
                  <div className="billing-switch-row">
                    <div className="billing-switch" aria-label="Période de facturation">
                      <button type="button" onClick={() => setBillingCycle("monthly")} className={billingCycle === "monthly" ? "billing-switch-active" : ""} aria-pressed={billingCycle === "monthly"}>Mensuel</button>
                      <button type="button" onClick={() => setBillingCycle("yearly")} className={billingCycle === "yearly" ? "billing-switch-active" : ""} aria-pressed={billingCycle === "yearly"}>Annuel <span>2 mois offerts</span></button>
                    </div>
                    <span className="billing-switch-caption">{billingCycle === "yearly" ? "Facturation annuelle en une fois" : "Facturation au mois"}</span>
                  </div>
                  <div className="pricing-grid">
                    {[
                      {
                        name: "Découverte (Genin)", key: "free", text: "Explorez Idealy, concevez vos premières idées et découvrez l’escouade multi-agents.",
                        icon: Compass, tint: "green", monthly: 0, annual: 0, points: "200 Power Points / mois", cap: "Plafond du portefeuille : 250 Power Points",
                        features: ["Jusqu’à 3 projets", "1 mission active", "Accès aux 4 Voies et orchestration multi-agents", "VFS et export ZIP du projet", "Aperçu temps réel du code généré"],
                        action: "Offre Découverte",
                      },
                      {
                        name: "Professionnel (Pro)", key: "pro", text: "Pour les créateurs, freelances et développeurs qui construisent des applications réelles.",
                        icon: Zap, tint: "violet", monthly: 19, annual: 190.8, points: "2 500 Power Points / mois", cap: "Plafond du portefeuille : 3 500 Power Points",
                        features: ["Projets illimités", "Jusqu’à 5 missions actives", "Intégration GitHub OAuth et synchronisation des branches", "VFS jusqu’à 300 fichiers par mission", "Modèles IA avancés", "Support prioritaire"],
                        action: "Voir les détails",
                      },
                      {
                        name: "Business (Team)", key: "business", text: "Pour les startups, agences et équipes qui ont besoin d’une capacité de génération soutenue.",
                        icon: Blocks, tint: "blue", monthly: 49, annual: 490.8, points: "4 000 Power Points / mois", cap: "Plafond du portefeuille : 7 000 Power Points",
                        features: ["Projets illimités", "Jusqu’à 20 missions actives", "VFS jusqu’à 1 000 fichiers par mission", "Accès anticipé aux connecteurs MCP et aux intégrations cloud", "Boucle d’auto-correction Reviewer en 3 passes", "SLA annoncé à 99,9 % et support direct ingénierie"],
                        action: "Voir les détails",
                      },
                      {
                        name: "Enterprise", key: "enterprise", text: "Pour les organisations qui ont besoin de quotas, de gouvernance et d’un accompagnement sur mesure.",
                        icon: ShieldCheck, tint: "amber", monthly: null, annual: null, points: null, cap: null,
                        features: ["Quotas et espaces sur mesure", "Gouvernance et sécurité", "Conditions et accompagnement sur mesure"],
                        action: "Offre sur mesure",
                      },
                    ].map((plan, index) => {
                      const value = billingCycle === "yearly" ? plan.annual : plan.monthly;
                      const numeric = typeof value === "number";
                      const monthlyEquivalent = plan.key === "pro" ? 15.9 : plan.key === "business" ? 40.9 : typeof value === "number" ? value : 0;
                      return (
                        <motion.article className={`pricing-card ${index === 1 ? "pricing-card-featured" : ""}`} key={plan.key} initial={{ opacity: 0, y: 9 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .05 }}>
                          <div className="pricing-card-top">
                            <WorkspaceIcon icon={plan.icon} tint={plan.tint} />
                            {index === 1 ? <span className="popular-plan-label">Le plus choisi</span> : index === 2 ? <span className="popular-plan-label business-plan-label">Haute capacité</span> : null}
                          </div>
                          <h2>{plan.name}</h2>
                          <p>{plan.text}</p>
                          <div className="price-display">
                            {numeric ? (
                              <>
                                <div className="price-line"><strong>{billingCycle === "yearly" && plan.key !== "free" ? `${monthlyEquivalent.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €` : `${value.toLocaleString("fr-FR")} €`}</strong><span>/ mois</span></div>
                                {plan.key === "free" ? <span className="price-billing-note">Gratuit, sans engagement</span> : billingCycle === "yearly" ? <span className="price-billing-note">Soit {(value as number).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} € facturés par an</span> : <span className="price-billing-note">Facturation mensuelle</span>}
                              </>
                            ) : <><div className="price-line"><strong>Sur devis</strong></div><span className="price-billing-note">Conditions à définir avec l’équipe</span></>}
                          </div>
                          {plan.points ? <div className="power-allocation"><span className="power-allocation-icon"><Zap size={14} /></span><span><strong>{plan.points}</strong><small>{plan.cap}</small></span></div> : <div className="power-allocation power-allocation-custom"><span className="power-allocation-icon"><Settings2 size={14} /></span><span><strong>Capacité personnalisée</strong><small>Montant à définir</small></span></div>}
                          <div className="pricing-divider" />
                          <ul>{plan.features.map((feature) => <li key={feature}><Check size={15} />{feature}</li>)}</ul>
                          <button className={index === 1 ? "primary-button full-width" : "outline-button full-width"} onClick={() => toast("Paiement désactivé", { description: "Cette maquette n’ouvre pas de checkout et ne modifie aucun abonnement. Les tarifs visibles proviennent de la configuration produit d’Idealy." })} type="button">{plan.action} <ArrowRight size={14} /></button>
                        </motion.article>
                      );
                    })}
                  </div>
                  <p className="pricing-footnote">Source produit actuelle : Découverte 0 € et 200 Power Points/mois ; Pro 19 €/mois ou 190,80 €/an ; Business 49 €/mois ou 490,80 €/an ; Enterprise sur mesure. Cette page n’active aucun paiement.</p>
                </div>
              ) : null}
              {view === "settings" ? (
                <div className="standard-page settings-page">
                  <SectionHeading eyebrow="PRÉFÉRENCES" title="Un workspace à votre façon." description="Les préférences visuelles sont interactives dans cette maquette. Les préférences de compte seront sauvegardées après raccordement." />
                  <div className="settings-layout"><div className="settings-nav"><div className="settings-nav-title">PRÉFÉRENCES</div><span className="settings-nav-active"><SlidersHorizontal size={15} /> Général</span><button type="button" onClick={() => navigate("connectors")}><GitBranch size={15} /> Connecteurs</button><button type="button" onClick={() => navigate("pricing")}><CreditCard size={15} /> Offre et facturation</button><button type="button" onClick={() => toast("Sécurité du compte", { description: "Les paramètres d’authentification restent ceux du projet d’origine." })}><ShieldCheck size={15} /> Sécurité</button></div><div className="settings-content"><section className="settings-section"><div className="settings-section-heading"><div><h2>Apparence</h2><p>Choisissez le thème de votre espace de travail.</p></div><span className="settings-mini-tag">Instantané</span></div><div className="theme-options"><button className={theme === "light" ? "theme-option theme-option-selected" : "theme-option"} onClick={() => setTheme("light")} type="button"><div className="theme-preview light-preview"><div /><span /></div><span><strong>Clair</strong><small>Clair et lumineux</small></span>{theme === "light" ? <Check size={16} /> : null}</button><button className={theme === "dark" ? "theme-option theme-option-selected" : "theme-option"} onClick={() => setTheme("dark")} type="button"><div className="theme-preview dark-preview"><div /><span /></div><span><strong>Sombre</strong><small>Confort en faible lumière</small></span>{theme === "dark" ? <Check size={16} /> : null}</button></div></section><section className="settings-section"><div className="settings-section-heading"><div><h2>Langue de l’interface</h2><p>Le catalogue de langues sera étendu à l’ensemble des écrans.</p></div></div><label className="select-setting"><Globe size={16} /><select value={language} onChange={(event) => { setLanguage(event.target.value); toast("Langue sélectionnée", { description: "La traduction complète sera raccordée au système i18n existant." }); }}><option>Français</option><option disabled>English — traduction complète à venir</option><option disabled>Español — traducción completa próximamente</option></select><ChevronDown size={15} /></label><p className="settings-help">La langue française reste active. Les autres langues seront activées quand chaque écran disposera de sa traduction complète.</p></section><section className="settings-section"><div className="settings-section-heading"><div><h2>Raccourcis</h2><p>Les actions principales sont accessibles au clavier.</p></div></div><div className="shortcut-row"><span>Ouvrir la palette de commandes</span><kbd>Ctrl K</kbd></div><div className="shortcut-row"><span>Aller au canvas</span><button className="shortcut-action" onClick={() => navigate("canvas")} type="button">Ouvrir <ArrowRight size={13} /></button></div></section><div className="settings-save-row"><span><ShieldCheck size={14} /> Les préférences de cette maquette restent locales.</span><button className="primary-button" onClick={() => toast.success("Préférences appliquées", { description: "Le thème est appliqué à l’interface actuelle." })} type="button">Terminé <Check size={15} /></button></div></div></div>
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>

        <footer className="statusbar"><div className="statusbar-left"><span className="status-green-dot" /><span>Workspace disponible</span><span className="statusbar-divider" /><span className="statusbar-disclaimer">Mode prototype</span></div><div className="statusbar-right"><span><LockKeyhole size={12} /> Aucune API connectée</span><button type="button" onClick={() => navigate("activity")}><Activity size={12} /> Journal</button><span>v0.1</span></div></footer>
      </main>

      <AnimatePresence>
        {commandOpen ? (
          <motion.div className="overlay-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setCommandOpen(false); }}>
            <motion.div className="command-dialog" initial={{ opacity: 0, y: -12, scale: .985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: .985 }} transition={{ duration: .16 }} role="dialog" aria-modal="true" aria-label="Palette de commandes">
              <div className="command-search-row"><Search size={19} /><input autoFocus placeholder="Que souhaitez-vous faire ?" value={commandQuery} onChange={(event) => { setCommandQuery(event.target.value); setActiveCommandIndex(0); }} /><kbd>ESC</kbd><button className="mini-icon" onClick={() => setCommandOpen(false)} aria-label="Fermer" type="button"><X size={16} /></button></div>
              <div className="command-section-label">ACTIONS RAPIDES</div>
              <div className="command-results">{commands.map((cmd, index) => <button type="button" key={cmd.label} className={`command-result ${activeCommandIndex === index ? "command-result-active" : ""}`} onMouseEnter={() => setActiveCommandIndex(index)} onClick={() => { cmd.action(); setCommandOpen(false); setCommandQuery(""); }}><span className="command-result-icon"><cmd.icon size={16} /></span><span>{cmd.label}</span><small>{cmd.hint}</small><ArrowRight size={14} className="command-result-arrow" /></button>)}
                {commands.length === 0 ? <div className="command-no-results">Aucune action trouvée pour « {commandQuery} ».</div> : null}
              </div>
              <div className="command-footer"><span><kbd>↑</kbd><kbd>↓</kbd> naviguer</span><span><kbd>↵</kbd> sélectionner</span><span><kbd>esc</kbd> fermer</span></div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {selectedConnector ? (
          <motion.div className="overlay-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedConnector(null); }}>
            <motion.div className="connector-dialog" role="dialog" aria-modal="true" aria-labelledby="connector-dialog-title" initial={{ opacity: 0, y: 18, scale: .985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .985 }} transition={{ duration: .18 }}>
              <button className="dialog-close icon-button" onClick={() => setSelectedConnector(null)} type="button" aria-label="Fermer"><X size={17} /></button>
              <div className="connector-dialog-brand" style={{ color: `#${selectedConnector.brand.hex}` }}><BrandIcon brand={selectedConnector.brand} size={34} /></div>
              <span className="eyebrow">CONNECTEUR / {selectedConnector.category.toUpperCase()}</span>
              <h2 id="connector-dialog-title">Configurer {selectedConnector.name}</h2>
              <p>{selectedConnector.description} L’autorisation et les secrets d’accès devront être configurés de façon sécurisée côté serveur.</p>
              <div className="connector-dialog-checks"><div><Check size={15} /><span>Logo et fiche de service prêts</span></div><div><Check size={15} /><span>Emplacement de configuration prévu</span></div><div><LockKeyhole size={15} /><span>OAuth et clés API non connectés</span></div></div>
              <button className="primary-button full-width" onClick={() => { handleConnect(selectedConnector.name); setSelectedConnector(null); }} type="button">{configuredConnectors.includes(selectedConnector.name) ? "Confirmer l’état de préparation" : "Marquer comme prêt à configurer"} <ArrowRight size={15} /></button>
              <button className="dialog-cancel" onClick={() => setSelectedConnector(null)} type="button">Annuler</button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
