export type Connector = 'codex' | 'claude' | 'gemini';
export type Source = {
  id: string;
  label: string;
  account: string;
  kind: 'Git' | 'Drive' | 'Chat' | 'Folder';
  connector: Connector;
  folder: string;
};
export type Rule = { id: string; term: string; replacement: string };
export type Workspace = {
  id: string;
  name: string;
  code: string;
  brief: string;
  voice: string;
  sources: Source[];
  rules: Rule[];
  updatedAt: string;
};
export type AppState = { workspaces: Workspace[]; activeId: string | null; sessions: Session[] };
export type LaunchOutcome = {
  sourceId: string;
  connector: Connector;
  profileDir: string;
  contextPath: string;
  launchedAt: string;
};
export type Session = {
  id: string;
  workspaceId: string;
  startedAt: string;
  sourceIds: string[];
  checks: string[];
  /** Sample records are never presented as native launch provenance. */
  status: 'sample' | 'launched' | 'legacy-unverified';
  launches: LaunchOutcome[];
};
