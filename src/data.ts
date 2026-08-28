import type { AppState, Workspace } from './types';

export const sampleWorkspaces: Workspace[] = [
  {
    id: 'northstar', name: 'Northstar Coffee', code: 'NS',
    brief: 'Ship the wholesale reorder portal. Keep the checkout copy direct and friendly.',
    voice: 'Short sentences. Use “shops”, not “partners”. Never promise same-day delivery.',
    sources: [
      { id: 'ns-git', label: 'northstar/reorder', account: 'dev@northstar.example', kind: 'Git', connector: 'codex', folder: '/projects/northstar-reorder' },
      { id: 'ns-drive', label: 'Wholesale briefs', account: 'sam@northstar.example', kind: 'Drive', connector: 'claude', folder: '/projects/northstar-briefs' }
    ],
    rules: [
      { id: 'ns-secret', term: 'NS_LIVE_KEY', replacement: '[REDACTED KEY]' },
      { id: 'ns-other', term: 'Juniper Legal', replacement: '[OTHER CLIENT]' }
    ], updatedAt: '2026-08-28T08:45:00.000Z'
  },
  {
    id: 'juniper', name: 'Juniper Legal', code: 'JL',
    brief: 'Prepare the intake prototype for solo legal practices. No production client records.',
    voice: 'Precise and calm. Explain each legal term the first time it appears.',
    sources: [
      { id: 'jl-git', label: 'juniper/intake', account: 'contractor@juniper.example', kind: 'Git', connector: 'codex', folder: '/projects/juniper-intake' },
      { id: 'jl-chat', label: 'Product channel', account: 'contractor-jl', kind: 'Chat', connector: 'gemini', folder: '/projects/juniper-notes' }
    ],
    rules: [
      { id: 'jl-secret', term: 'JUNIPER_TOKEN', replacement: '[REDACTED TOKEN]' },
      { id: 'jl-other', term: 'Northstar Coffee', replacement: '[OTHER CLIENT]' }
    ], updatedAt: '2026-08-27T15:10:00.000Z'
  }
];

export const sampleState = (): AppState => ({ workspaces: structuredClone(sampleWorkspaces), activeId: 'northstar', sessions: [] });
export const emptyState = (): AppState => ({ workspaces: [], activeId: null, sessions: [] });
