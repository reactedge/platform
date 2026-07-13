| Concern                    | When Present in Core              | When Isolated            | Notes                   |
| -------------------------- | --------------------------------- | ------------------------ | ----------------------- |
| Google Maps API dependency | Script loaded globally            | Declared integration     | No hidden network       |
| Security dependency        | API key in theme                  | Runtime config injection | Safer key management    |
| Layout mixed up            | Embedded in CMS page builder      | Mounted via container    | Structural independence |
| CSS conflicts              | Map styles overridden             | Scoped CSS               | Reduced styling bleed   |
| Business logic coupled     | Region selection mixed with theme | Encapsulated behaviour   | Reusable across pages   |
