"use client";

import { ArrowRight, ArrowUpRight, Check, ChevronRight, Code as Code2, Database, Eye, FileText, GitBranch, Layers, LockKeyhole, MoveHorizontal as MoreHorizontal, Play, RefreshCw, ShieldCheck, SlidersHorizontal, Sparkles, Workflow, Zap } from "lucide-react";
import {
  addEdge, Background, Controls, Handle, MiniMap, Position, ReactFlow,
  useEdgesState, useNodesState,
  type Connection, type Edge, type Node, type NodeProps,
} from "@xyflow/react";
import { useCallback, useState } from "react";
import { BrandMark, AgentPortrait } from "./shared";
import { agents } from "@/lib/data";
import type { FlowStageData } from "@/lib/types";

const initialFlowNodes: Node<FlowStageData>[] = [
  { id: "scope", type: "stage", position: { x: 140, y: 24 }, data: { step: "01", title: "Définir le périmètre", description: "Clarifier l'objectif et les utilisateurs.", status: "done" } },
  { id: "design", type: "stage", position: { x: 140, y: 190 }, data: { step: "02", title: "Concevoir l'expérience", description: "Organiser les écrans, composants et états.", status: "active" } },
  { id: "build", type: "stage", position: { x: 140, y: 356 }, data: { step: "03", title: "Construire la solution", description: "Préparer l'interface et les comportements.", status: "next" } },
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

type CanvasTab = "Aperçu" | "Plan" | "Code" | "Données";

export function CanvasView({
  projectTitle, projectPrompt, navigate, configuredConnectorCount,
}: {
  projectTitle: string;
  projectPrompt: string;
  navigate: (v: "connectors" | "agents") => void;
  configuredConnectorCount: number;
}) {
  const [canvasTab, setCanvasTab] = useState<CanvasTab>("Plan");
  const [showAgentPanel, setShowAgentPanel] = useState(true);
  const [flowNodes, , onFlowNodesChange] = useNodesState(initialFlowNodes);
  const [flowEdges, setFlowEdges, onFlowEdgesChange] = useEdgesState(initialFlowEdges);
  const onFlowConnect = useCallback((c: Connection) => setFlowEdges((cur) => addEdge(c, cur)), [setFlowEdges]);

  const tabs: CanvasTab[] = ["Aperçu", "Plan", "Code", "Données"];

  return (
    <div className="canvas-page">
      <div className="canvas-title-row">
        <div>
          <div className="eyebrow">WORKSPACE / PROJET</div>
          <h1>{projectTitle}</h1>
          <p>{projectPrompt || "Votre espace de projet. Les prochaines étapes pourront être affinées ici."}</p>
        </div>
        <div className="canvas-title-actions">
          <span className="draft-status"><i /> Brouillon local</span>
          <button className="outline-button" type="button"><ArrowUpRight size={15} /> Partager</button>
          <button className="primary-button" type="button"><Play size={15} /> Lancer</button>
        </div>
      </div>

      <div className="canvas-toolbar">
        <div className="canvas-tabs">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setCanvasTab(tab)} className={canvasTab === tab ? "canvas-tab active" : "canvas-tab"} type="button">
              {tab === "Aperçu" ? <Eye size={14} /> : tab === "Plan" ? <Workflow size={14} /> : tab === "Code" ? <Code2 size={14} /> : <Database size={14} />}
              {tab}
            </button>
          ))}
        </div>
        <div className="canvas-toolbar-right">
          <span><span className="status-green-dot" /> Auto-layout</span>
          <button className="mini-icon" type="button" aria-label="Recentrer"><RefreshCw size={15} /></button>
          <button className="mini-icon" type="button" onClick={() => setShowAgentPanel(!showAgentPanel)} aria-label="Afficher les agents"><SlidersHorizontal size={15} /></button>
        </div>
      </div>

      <div className={`workspace-layout ${showAgentPanel ? "" : "workspace-layout-wide"}`}>
        <section className="flow-canvas">
          {canvasTab === "Code" ? (
            <div className="code-placeholder">
              <div className="code-header"><span /><span /><span /><strong>project-plan.ts</strong></div>
              <pre><code><span className="code-purple">export const</span> project = {'{'}{"\n"}  name: <span className="code-green">"{projectTitle}"</span>,{"\n"}  status: <span className="code-green">"draft"</span>,{"\n"}  stages: [<span className="code-green">"scope"</span>, <span className="code-green">"design"</span>,{"\n"}    <span className="code-green">"build"</span>, <span className="code-green">"review"</span>],{"\n"}  aiConnected: <span className="code-orange">false</span>,{"\n"}{'}'};</code></pre>
              <div className="code-footnote"><LockKeyhole size={14} /> Exemple de structure — pas un fichier réellement généré.</div>
            </div>
          ) : canvasTab === "Données" ? (
            <div className="canvas-empty-state">
              <div className="large-outline-icon"><Database size={24} /></div>
              <h3>Les données de votre projet apparaîtront ici</h3>
              <p>Connectez une base de données pour explorer les tables et les relations.</p>
              <button className="outline-button" onClick={() => navigate("connectors")} type="button">Voir les connecteurs <ArrowRight size={14} /></button>
            </div>
          ) : canvasTab === "Aperçu" ? (
            <div className="preview-mock">
              <div className="preview-browser">
                <div className="browser-dots"><i /><i /><i /></div>
                <div className="browser-address"><LockKeyhole size={11} /> preview.idealy.local / {projectTitle.toLowerCase().replace(/\s+/g, "-")}</div>
                <button className="mini-icon" type="button"><MoreHorizontal size={15} /></button>
              </div>
              <div className="preview-content">
                <div className="preview-nav">
                  <span className="preview-logo"><BrandMark size={20} /> {projectTitle.split(" ").slice(0, 2).join(" ")}</span>
                  <div><span>Fonctionnalités</span><span>À propos</span><button type="button">Commencer <ArrowRight size={12} /></button></div>
                </div>
                <div className="preview-hero">
                  <span className="preview-eyebrow"><Sparkles size={12} /> LE POINT DE DÉPART</span>
                  <h2>Les bonnes idées<br /><span>méritent de prendre forme.</span></h2>
                  <p>{projectPrompt || "Un espace clair pour transformer votre intention en une expérience utile, soignée et simple à utiliser."}</p>
                  <button type="button">Découvrir le projet <ArrowRight size={14} /></button>
                  <div className="preview-orbit">
                    <div className="preview-orbit-inner"><BrandMark size={54} /></div>
                    <span className="orbit-chip chip-one"><Sparkles size={13} /> Idée</span>
                    <span className="orbit-chip chip-two"><Layers size={13} /> Structure</span>
                    <span className="orbit-chip chip-three"><Check size={13} /> Clarté</span>
                  </div>
                </div>
                <div className="preview-bottom-cards">
                  <div><Layers size={17} /><strong>Une base claire</strong><span>Une structure pensée pour évoluer.</span></div>
                  <div><Zap size={17} /><strong>Moins de friction</strong><span>Le bon chemin, étape par étape.</span></div>
                  <div><ShieldCheck size={17} /><strong>Vous gardez la main</strong><span>Chaque choix reste visible.</span></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="plan-canvas plan-canvas-interactive">
              <div className="plan-canvas-heading">
                <div><span className="eyebrow">FLUX DU PROJET</span><h2>De l'idée à la livraison</h2></div>
                <span className="plan-count">4 étapes · déplaçables</span>
              </div>
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
              <div className="plan-footer-note"><Sparkles size={15} /><span>Déplacez les étapes et reliez les nœuds. Ce canvas est interactif.</span></div>
            </div>
          )}
        </section>

        {showAgentPanel ? (
          <aside className="agent-rail">
            <div className="agent-rail-header">
              <div><span className="eyebrow">ORCHESTRATION</span><h3>Équipe Idealy</h3></div>
              <button className="mini-icon" onClick={() => navigate("agents")} type="button" aria-label="Voir l'équipe"><ArrowUpRight size={15} /></button>
            </div>
            <div className="agent-running-note">
              <span className="agent-pulse"><span /></span>
              <div><strong>En attente de lancement</strong><span>Prête à recevoir votre mission</span></div>
            </div>
            <div className="agent-list">
              {agents.map((agent) => (
                <button className="agent-mini-row" key={agent.name} onClick={() => navigate("agents")} type="button">
                  <AgentPortrait name={agent.name} size={31} />
                  <span className="agent-mini-meta"><strong>{agent.name}</strong><small>{agent.role}</small></span>
                  <span className="agent-idle">Repos</span>
                </button>
              ))}
            </div>
            <div className="rail-divider" />
            <div className="rail-block-title"><span>CONTEXTE DU PROJET</span></div>
            <button className="context-entry" type="button">
              <FileText size={16} /><span><strong>Brief du projet</strong><small>{projectPrompt ? "1 élément" : "Aucun brief"}</small></span><ChevronRight size={14} />
            </button>
            <button className="context-entry" onClick={() => navigate("connectors")} type="button">
              <GitBranch size={16} /><span><strong>Connecteurs</strong><small>{configuredConnectorCount} préparé(s)</small></span><ChevronRight size={14} />
            </button>
            <div className="rail-bottom-tip"><Sparkles size={15} /><span>Les agents démarreront quand l'orchestration sera connectée.</span></div>
          </aside>
        ) : null}
      </div>
    </div>
  );
}
