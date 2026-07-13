| Concern                | When Present in Core          | When Isolated              | Notes                      |
| ---------------------- | ----------------------------- | -------------------------- | -------------------------- |
| State tangled          | Deep session coupling         | Managed internally         | Decouples scheduling logic |
| Business logic coupled | Embedded in backend templates | Encapsulated via contract  | Feature portability        |
| Schema complexity      | Spread across DB + templates  | Defined via contract model | Clear data boundary        |
| Layout mixed up        | Grid collisions               | Self-contained structure   | Cleaner integration        |
| Performance impact     | Heavy calendar logic global   | Loaded only when required  | Scoped performance cost    |
