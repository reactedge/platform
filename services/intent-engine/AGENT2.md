## Gap Repair Agent — Spec v1
### High-Level Aim

Transform evaluation reports into concrete, structured improvement actions that can be:
- prioritised
- tracked
- eventually applied to the system
The agent does not modify the system directly.
It produces actionable recommendations.

### Non-Functional Constraint
- asynchronous (same as Agent 1)
- no runtime impact
- deterministic-first (LLM only if needed, but bounded)
