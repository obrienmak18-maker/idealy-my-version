"use client";

import {
  Activity, ArrowRight, ChevronDown, CreditCard, GitBranch,
  MoreHorizontal, PanelLeftClose, PanelLeftOpen,
  Plus, Settings2, Sparkles, Workflow, Blocks,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import type { View } from "@/lib/types";
import { BrandMark } from "./shared";
import { connectors } from "@/lib/data";

type NavItem = { id: View; label: string; icon: LucideIcon; group: "create" | "manage" };

const navItems: NavItem[] = [
  { id: "studio", label: "Studio", icon: Sparkles, group: "create" },
  { id: "canvas", label: "Canvas", icon: Workflow, group: "create" },
  { id: "agents", label: "Équipe d'agents", icon: Blocks, group: "create" },
  { id: "connectors", label: "Connecteurs", icon: GitBranch, group: "manage" },
  { id: "activity", label: "Activité", icon: Activity, group: "manage" },
  { id: "pricing", label: "Offres", icon: CreditCard, group: "manage" },
  { id: "settings", label: "Paramètres", icon: Settings2, group: "manage" },
];

function NavButton({ active, icon: Icon, label, onClick, badge, collapsed }: {
  active: boolean; icon: LucideIcon; label: string; onClick: () => void; badge?: string; collapsed: boolean;
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

type ProjectSummary = { id: string; title: string };

export function Sidebar({
  view, navigate, sidebarOpen, setSidebarOpen, mobileMenuOpen,
  projectTitle, projects, onSelectProject,
}: {
  view: View;
  navigate: (v: View) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  mobileMenuOpen: boolean;
  projectTitle: string;
  projects: ProjectSummary[];
  onSelectProject: (id: string) => void;
}) {
  return (
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

      <button className="workspace-switcher" type="button">
        <span className="workspace-avatar">O</span>
        {sidebarOpen ? <><span className="workspace-meta"><strong>Mon espace</strong><small>Workspace personnel</small></span><ChevronDown size={15} className="muted-icon" /></> : null}
      </button>

      <button className="new-project-button" onClick={() => navigate("studio")} type="button">
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
        <nav className="nav-group" aria-label="Gestion de l'espace">
          {navItems.filter((item) => item.group === "manage").map((item) => (
            <NavButton key={item.id} active={view === item.id} icon={item.icon} label={item.label} collapsed={!sidebarOpen} onClick={() => navigate(item.id)} badge={item.id === "connectors" && sidebarOpen ? String(connectors.length) : undefined} />
          ))}
        </nav>

        {sidebarOpen ? (
          <div className="sidebar-projects">
            <div className="projects-heading"><span>RÉCENTS</span><button className="mini-icon" aria-label="Ajouter un projet" onClick={() => navigate("studio")} type="button"><Plus size={14} /></button></div>
            {projects.length > 0 ? (
              projects.slice(0, 5).map((proj, i) => (
                <button key={proj.id} className={`recent-project ${view === "canvas" && i === 0 ? "recent-project-active" : ""}`} onClick={() => { onSelectProject(proj.id); navigate("canvas"); }} type="button">
                  <span className={`recent-dot ${i % 2 === 0 ? "dot-violet" : "dot-green"}`} /><span>{proj.title}</span><MoreHorizontal size={15} className="recent-more" />
                </button>
              ))
            ) : (
              <button className="recent-project" onClick={() => navigate("canvas")} type="button">
                <span className="recent-dot dot-violet" /><span>{projectTitle}</span>
              </button>
            )}
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
  );
}
