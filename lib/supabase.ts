import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Project = {
  id: string;
  title: string;
  prompt: string;
  stage: string;
  status: string;
  canvas_data: { nodes: unknown[]; edges: unknown[] } | null;
  created_at: string;
  updated_at: string;
};

export type ActivityRow = {
  id: string;
  project_id: string | null;
  title: string;
  detail: string;
  icon: string;
  tint: string;
  created_at: string;
};

export type ConnectorConfigRow = {
  id: string;
  connector_id: string;
  connector_name: string;
  configured: boolean;
  created_at: string;
};
