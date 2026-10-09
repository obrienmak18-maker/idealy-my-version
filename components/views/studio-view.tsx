"use client";

import {
  ArrowRight, ArrowUp, ArrowUpRight, Check, Keyboard, Layers,
  LayoutDashboard, Globe, ListTodo, MessageCircle, Paperclip,
  ShieldCheck, Sparkles, WandSparkles, Workflow, X,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Button as BaseButton } from "@base-ui/react/button";
import { useState } from "react";
import { BrandMark, AgentPortrait } from "./shared";
import { agents, templateCards, classifyPrompt } from "@/lib/data";
import type { ConversationPreview } from "@/lib/types";

const templateIcons: Record<string, LucideIcon> = { LayoutDashboard, Globe, ListTodo };
const templateTints: Record<string, string> = { violet: "tint-violet", green: "tint-green", blue: "tint-blue" };

export function StudioView({
  input, setInput, startProject,
}: {
  input: string;
  setInput: (v: string) => void;
  startProject: (prompt?: string) => void;
}) {
  const [conversationPreview, setConversationPreview] = useState<ConversationPreview | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleStart = () => {
    const chosen = input.trim();
    if (!chosen) return;
    const intent = classifyPrompt(chosen);
    if (intent !== "build") {
      setConversationPreview({
        question: chosen,
        kind: intent,
        answer: intent === "greeting"
          ? "Salut ! Je suis là. Tu peux me poser une question ou me décrire quelque chose que tu veux construire."
          : "Cette demande reste dans le chat rapide. Le moteur de chat n'est pas encore raccordé : aucun modèle IA n'a été appelé.",
      });
      setInput("");
      return;
    }
    setConversationPreview(null);
    startProject(chosen);
  };

  return (
    <div className="studio-page">
      <div className="welcome-kicker"><span className="live-pip" /> VOTRE ESPACE DE CRÉATION</div>
      <section className="hero-block">
        <div className="hero-mark"><BrandMark size={42} /></div>
        <h1>Une idée en tête ?<br /><span>Construisons-la ensemble.</span></h1>
        <p>Décrivez ce que vous imaginez. Idealy vous aide à organiser les prochaines étapes et à donner forme à votre projet.</p>
        <div className="hero-chips"><span><WandSparkles size={14} /> De l'idée au plan</span><span><Workflow size={14} /> Un canvas vivant</span><span><ShieldCheck size={14} /> Vous gardez le contrôle</span></div>
        <div className="hero-crew-row">
          <div className="hero-crew-avatars">{agents.map((agent) => <AgentPortrait key={agent.name} name={agent.name} size={27} />)}</div>
          <div><strong>5 rôles complémentaires</strong><span>Planifier · Concevoir · Construire · Vérifier</span></div>
        </div>
      </section>

      <form className="prompt-composer" onSubmit={(e) => { e.preventDefault(); handleStart(); }}>
        <div className="composer-topline"><span className="composer-dot" /><span>Nouvelle mission</span><span className="composer-note">Commencez simplement</span></div>
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setConversationPreview(null); }}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleStart(); } }}
          placeholder="J'aimerais créer une application qui aide les petites équipes à…"
          rows={3}
          aria-label="Décrivez votre idée"
        />
        <div className="composer-bottom">
          <div className="composer-tools">
            <button type="button" className="composer-tool"><Paperclip size={16} /><span>Ajouter</span></button>
            <button type="button" className="composer-tool"><Layers size={16} /><span>Contexte</span></button>
            <span className="composer-hint"><Keyboard size={13} /> Entrée pour envoyer</span>
          </div>
          <BaseButton type="submit" className="send-button" aria-label="Préparer le projet"><ArrowUp size={18} /><span>Commencer</span></BaseButton>
        </div>
      </form>

      <AnimatePresence>
        {conversationPreview ? (
          <motion.section className="fast-chat-preview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
            <div className="fast-chat-header">
              <span className="fast-chat-symbol"><MessageCircle size={16} /></span>
              <div><span className="eyebrow">{conversationPreview.kind === "greeting" ? "CHEMIN RAPIDE" : "MODE CONVERSATIONNEL"}</span><strong>{conversationPreview.kind === "greeting" ? "Réponse instantanée" : "Aucun canvas ni agent lancé"}</strong></div>
              <button className="mini-icon" type="button" aria-label="Fermer" onClick={() => setConversationPreview(null)}><X size={15} /></button>
            </div>
            <div className="fast-chat-turn"><span className="fast-chat-speaker">Vous</span><p>{conversationPreview.question}</p></div>
            <div className="fast-chat-turn fast-chat-assistant">
              <span className="fast-chat-avatar"><BrandMark size={19} /></span>
              <div><p>{conversationPreview.answer}</p><small>Prototype local · aucune IA appelée</small></div>
            </div>
          </motion.section>
        ) : null}
      </AnimatePresence>

      <div className="template-section">
        <div className="template-heading">
          <div><span className="eyebrow">POUR DÉMARRER PLUS VITE</span><h2>Ou partez d'un point de départ</h2></div>
          <button className="text-action" type="button">Explorer les modèles <ArrowRight size={14} /></button>
        </div>
        <div className="template-grid">
          {templateCards.map((template, index) => {
            const Icon = templateIcons[template.icon] ?? LayoutDashboard;
            const tintClass = templateTints[template.tint] ?? "tint-violet";
            return (
              <motion.button
                key={template.name}
                className={`template-card ${selectedTemplate === template.name ? "template-card-selected" : ""}`}
                onClick={() => { setSelectedTemplate(template.name); setInput(template.prompt); setConversationPreview(null); }}
                whileHover={{ y: -3 }} whileTap={{ scale: .99 }}
                type="button"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .055 }}
              >
                <div className="template-card-top">
                  <span className={`workspace-icon ${tintClass}`}><Icon size={17} /></span>
                  <span className="template-category">{template.category}</span>
                  <ArrowUpRight size={15} className="template-arrow" />
                </div>
                <strong>{template.name}</strong>
                <p>{template.description}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="bottom-note">
        <span className="tiny-spark"><BrandMark size={15} /></span>
        <span>Pas besoin d'avoir tout prévu. Votre idée peut évoluer en chemin.</span>
      </div>
    </div>
  );
}
