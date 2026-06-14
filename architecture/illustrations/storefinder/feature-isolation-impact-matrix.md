| Concern           | When Present in Core         | When Isolated           | Notes                      |
| ----------------- | ---------------------------- | ----------------------- | -------------------------- |
| Data processing   | Handled in backend templates | Controlled via contract | Cleaner separation         |
| Network calls     | API logic embedded in theme  | Explicit integration    | Transparent data flow      |
| State tangled     | Search state shared globally | Local state container   | No cross-page side effects |
| Layout mixed up   | Dependent on CMS grid        | Mounted independently   | Layout flexibility         |
| Schema complexity | Data format implicit         | Explicit contract model | Easier versioning          |
