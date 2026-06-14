| Concern                | When Present in the Core System           | When Isolated in the Widget       | Notes                       |
| ---------------------- | ----------------------------------------- | --------------------------------- | --------------------------- |
| Schema complexity      | Mixed into theme templates and CMS fields | Encapsulated inside widget config | Reduces template sprawl     |
| Business logic coupled | Tied to theme rendering logic             | Defined via contract              | Makes messaging portable    |
| Layout mixed up        | Influenced by global layout grid          | Self-contained block              | Safer to reposition         |
| CSS bleed              | Affected by global theme resets           | Scoped styling                    | Visual consistency improves |
| State tangled          | Depends on theme JS                       | Localised state                   | No global dependencies      |
