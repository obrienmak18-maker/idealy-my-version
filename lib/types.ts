export type View =
  | "studio"
  | "canvas"
  | "agents"
  | "connectors"
  | "activity"
  | "pricing"
  | "settings";

export type ConnectorCategory =
  | "code"
  | "deploy"
  | "data"
  | "billing"
  | "design"
  | "communication";

export type SimpleBrand = {
  title: string;
  hex: string;
  path: string;
};

export type Connector = {
  id: string;
  name: string;
  description: string;
  category: ConnectorCategory;
  brand: SimpleBrand;
  availability: "configured" | "planned";
  auth: "OAuth 2.0" | "Géré par Idealy";
  operations: string[];
};

export type Agent = {
  name: string;
  role: string;
  letter: string;
  color: string;
  detail: string;
};

export type ConversationPreview = {
  question: string;
  answer: string;
  kind: "greeting" | "question";
};

export type FlowStageData = {
  step: string;
  title: string;
  description: string;
  status: "done" | "active" | "next";
};
