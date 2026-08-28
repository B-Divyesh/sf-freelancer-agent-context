export type Source = { id: string; label: string; account: string; kind: 'Git' | 'Drive' | 'Chat' | 'Folder' };
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
export type Session = { id: string; workspaceId: string; startedAt: string; sourceIds: string[]; checks: string[] };
