| Concern                | When Present in Core              | When Isolated                | Notes                      |
| ---------------------- | --------------------------------- | ---------------------------- | -------------------------- |
| Business logic coupled | Campaign logic inside theme files | Controlled via JSON contract | Marketing autonomy         |
| Layout mixed up        | Depends on homepage layout        | Independent mount            | Safer homepage redesign    |
| Performance impact     | Large JS bundled in theme         | Loaded only when needed      | Reduces global bundle size |
| State tangled          | Slider state in global JS         | Internalised state           | Fewer side effects         |
| CSS conflicts          | Shared animation rules            | Scoped animation styles      | Less regression risk       |
