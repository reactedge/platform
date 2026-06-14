| Concern           | When Present in Core     | When Isolated              | Notes                   |
| ----------------- | ------------------------ | -------------------------- | ----------------------- |
| Schema complexity | Menu tree deeply coupled | Structured contract schema | Deterministic rendering |
| State tangled     | Global hover handlers    | Internalised state         | Less JS collision       |
| Layout mixed up   | Theme header dependency  | Independent mount          | Easier header redesign  |
| CSS bleed         | Global nav styling       | Scoped styling             | Reduces regressions     |
| Performance       | Large menu JS global     | Loaded only when present   | Smaller global bundle   |
