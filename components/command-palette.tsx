"use client";

import { ArrowRight, Plus, Search, Settings2, Sun, Moon, History, CreditCard, Workflow, Blocks, GitBranch, X, type LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { View } from "@/lib/types";

type Command = { label: string; hint: string; icon: LucideIcon; action: () => void };

export function CommandPalette({
  open, setOpen, theme, setTheme, navigate,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  theme: "light" | "dark";
  setTheme: (t: "light" | "dark") => void;
  navigate: (v: View) => void;
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const commands: Command[] = [
    { label: "Créer un nouveau projet", hint: "Nouvelle session", icon: Plus, action: () => navigate("studio") },
    { label: "Ouvrir le canvas", hint: "Espace de travail", icon: Workflow, action: () => navigate("canvas") },
    { label: "Voir les agents", hint: "Orchestration", icon: Blocks, action: () => navigate("agents") },
    { label: "Gérer les connecteurs", hint: "Intégrations", icon: GitBranch, action: () => navigate("connectors") },
    { label: "Voir l'activité", hint: "Historique", icon: History, action: () => navigate("activity") },
    { label: "Consulter les offres", hint: "Power et capacités", icon: CreditCard, action: () => navigate("pricing") },
    { label: "Changer l'apparence", hint: "Thème", icon: theme === "light" ? Moon : Sun, action: () => setTheme(theme === "light" ? "dark" : "light") },
    { label: "Ouvrir les paramètres", hint: "Préférences", icon: Settings2, action: () => navigate("settings") },
  ];

  const filtered = commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((cur) => {
          if (!filtered.length) return 0;
          return e.key === "ArrowDown" ? (cur + 1) % filtered.length : (cur - 1 + filtered.length) % filtered.length;
        });
      }
      if (e.key === "Enter" && filtered[activeIndex]) {
        e.preventDefault();
        filtered[activeIndex].action();
        setOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, activeIndex, filtered, setOpen]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="overlay-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <motion.div className="command-dialog" initial={{ opacity: 0, y: -12, scale: .985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: .985 }} transition={{ duration: .16 }} role="dialog" aria-modal="true" aria-label="Palette de commandes">
            <div className="command-search-row">
              <Search size={19} />
              <input autoFocus placeholder="Que souhaitez-vous faire ?" value={query} onChange={(e) => { setQuery(e.target.value); setActiveIndex(0); }} />
              <kbd>ESC</kbd>
              <button className="mini-icon" onClick={() => setOpen(false)} aria-label="Fermer" type="button"><X size={16} /></button>
            </div>
            <div className="command-section-label">ACTIONS RAPIDES</div>
            <div className="command-results">
              {filtered.map((cmd, i) => (
                <button type="button" key={cmd.label} className={`command-result ${activeIndex === i ? "command-result-active" : ""}`} onMouseEnter={() => setActiveIndex(i)} onClick={() => { cmd.action(); setOpen(false); setQuery(""); }}>
                  <span className="command-result-icon"><cmd.icon size={16} /></span>
                  <span>{cmd.label}</span>
                  <small>{cmd.hint}</small>
                  <ArrowRight size={14} className="command-result-arrow" />
                </button>
              ))}
              {filtered.length === 0 ? <div className="command-no-results">Aucune action trouvée pour « {query} ».</div> : null}
            </div>
            <div className="command-footer"><span><kbd>↑</kbd><kbd>↓</kbd> naviguer</span><span><kbd>↵</kbd> sélectionner</span><span><kbd>esc</kbd> fermer</span></div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
