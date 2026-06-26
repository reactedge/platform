| Concern                | When Present in Core        | When Isolated           | Notes                     |
| ---------------------- | --------------------------- | ----------------------- | ------------------------- |
| State tangled          | Deep session + global state | Event-based boundary    | Controlled interaction    |
| Business logic coupled | Theme-level cart mutation   | Contract-driven events  | Behavioural isolation     |
| Schema drift           | Implicit payload structure  | Versioned event surface | Deterministic integration |
| Network dependency     | Global cart API calls       | Explicit integration    | Transparent behaviour     |
| CSS bleed              | Header layout dependency    | Scoped styling          | Safer header changes      |

