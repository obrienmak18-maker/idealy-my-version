"use client";

import { Bell, CheckCheck, ChevronRight, Circle as CircleHelp, Menu, Moon, Search, Sun, ArrowRight, Sparkles, GitBranch } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { View } from "@/lib/types";

const navLabels: Record<View, string> = {
  studio: "Studio",
  canvas: "Canvas",
  agents: "Équipe d'agents",
  connectors: "Connecteurs",
  activity: "Activité",
  pricing: "Offres",
  settings: "Paramètres",
};

export function Topbar({
  view, theme, setTheme, projectTitle, notificationsOpen, setNotificationsOpen,
  notificationsRead, setNotificationsRead, navigate, openCommand,
  setMobileMenuOpen, setSidebarOpen, mobileMenuOpen,
}: {
  view: View;
  theme: "light" | "dark";
  setTheme: (t: "light" | "dark") => void;
  projectTitle: string;
  notificationsOpen: boolean;
  setNotificationsOpen: (v: boolean) => void;
  notificationsRead: boolean;
  setNotificationsRead: (v: boolean) => void;
  navigate: (v: View) => void;
  openCommand: () => void;
  setMobileMenuOpen: (v: boolean) => void;
  setSidebarOpen: (v: boolean) => void;
  mobileMenuOpen: boolean;
}) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="icon-button mobile-menu-trigger" onClick={() => { setSidebarOpen(true); setMobileMenuOpen(!mobileMenuOpen); }} type="button" aria-label="Ouvrir la navigation"><Menu size={18} /></button>
        <div className="breadcrumb">
          <span className="breadcrumb-root">Idealy</span><ChevronRight size={13} />
          <span>{navLabels[view]}</span>
          {view === "canvas" ? <><ChevronRight size={13} /><strong>{projectTitle}</strong></> : null}
        </div>
      </div>
      <div className="topbar-actions">
        <button className="command-trigger" type="button" onClick={openCommand}>
          <Search size={15} /><span>Rechercher</span><kbd>Ctrl K</kbd>
        </button>
        <div className="topbar-divider" />
        <button className="icon-button top-action" type="button" aria-label="Aide"><CircleHelp size={18} /></button>
        <div className="notification-wrap">
          <button className="icon-button top-action" type="button" aria-label="Notifications" onClick={() => setNotificationsOpen(!notificationsOpen)}><Bell size={18} />{!notificationsRead ? <i className="notification-dot" /> : null}</button>
          <AnimatePresence>
            {notificationsOpen ? (
              <motion.div className="notification-popover" initial={{ opacity: 0, y: -6, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: .98 }} transition={{ duration: .16 }}>
                <div className="popover-heading"><div><strong>Notifications</strong><span>Votre espace, en un coup d'œil</span></div><button className="mini-icon" onClick={() => setNotificationsRead(true)} type="button" title="Tout marquer comme lu"><CheckCheck size={15} /></button></div>
                <div className="notification-item"><span className="notification-symbol"><Sparkles size={15} /></span><div><strong>Bienvenue dans le nouveau Studio</strong><p>Explorez le canvas et la palette de commandes.</p><small>À l'instant</small></div></div>
                <div className="notification-item"><span className="notification-symbol green"><GitBranch size={15} /></span><div><strong>Connecteurs disponibles</strong><p>Préparez vos intégrations depuis le catalogue.</p><small>Récemment</small></div></div>
                <button className="popover-footer" onClick={() => { setNotificationsRead(true); setNotificationsOpen(false); navigate("activity"); }} type="button">Voir toute l'activité <ArrowRight size={14} /></button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        <button className="theme-toggle" type="button" aria-label="Changer le thème" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>{theme === "light" ? <Moon size={16} /> : <Sun size={16} />}</button>
      </div>
    </header>
  );
}
