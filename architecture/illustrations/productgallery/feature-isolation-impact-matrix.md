| Concern                | When Present in Core            | When Isolated                     | Notes                      |
| ---------------------- | ------------------------------- | --------------------------------- | -------------------------- |
| Security dependency    | Captcha logic embedded in theme | Declared integration (Cloudflare) | Explicit security boundary |
| Network calls          | Form submission handled ad-hoc  | Controlled submission path        | Predictable integration    |
| Validation logic       | Mixed in PHP/JS                 | Widget-contained                  | Reduces duplication        |
| Business logic coupled | Hard-coded routing              | Contract-driven endpoint          | Safer evolution            |
| State tangled          | Global form handlers            | Internalised state                | Clear lifecycle            |
