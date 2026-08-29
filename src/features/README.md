# Features

Milestone builders move view orchestration into route-sized modules here:
`landing`, `demo`, `workspace`, `session`, `delivery`, and `account`. A feature
depends on components and typed services; it does not access browser storage,
the network, or Tauri globals directly.
