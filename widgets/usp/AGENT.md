## Deployment Contract

The widget contract must conform to `WidgetConfigSchema`.

Reference example:

```json
{
  "data": {
    "slides": [
      {
        "text": "Over 20 years experience"
      }
    ]
  },
  "settings": {
    "mode": {
      "desktop": "static",
      "tablet": "slider",
      "mobile": "slider"
    },
    "theme": "light"
  }
}
```

## Assumptions

The self-healing workflow operates under the following assumptions:

### Platform Assumptions

The following components are assumed to be healthy:

* Widget runtime
* Deployment platform
* Build pipeline
* Zod validation library
* Node.js runtime
* Storage layer
* Observability infrastructure

### Scope

The self-healing workflow is responsible for repairing contract-related defects.

Examples:

* Missing required fields
* Invalid enum values
* Structural contract issues
* Constraint violations

### Out Of Scope

The self-healing workflow does not attempt to repair:

* Platform outages
* Infrastructure failures
* Runtime defects
* Widget implementation defects
* Third-party dependency defects
* Network failures
* Site outages

These incidents must be escalated for manual investigation.

### Principle

The self-healing workflow should only attempt repairs when the root cause is believed to be the contract itself.

When confidence is low, the workflow must:

* Preserve the Last Known Valid Contract
* Notify the team
* Escalate for review

## Contract Validation

The deployment contract must pass validation against:

```text
WidgetConfigSchema
```

The schema is the authoritative source of truth for:

* Required fields
* Allowed values
* Minimum and maximum constraints
* Default values
* Structural validation

Agents should not duplicate schema rules.

## Recovery Strategy

## Self-Healing Workflow

### 1. Validate Contract

Validate the deployment contract against the widget's Zod schema.

```ts
WidgetConfigSchema.safeParse(contract)
```

### 2. Collect Validation Errors

If validation fails:

* Collect all Zod validation errors
* Extract the failing path
* Extract the failing constraint
* Generate an incident

Example:

```json
{
  "path": ["data", "slides"],
  "code": "too_small"
}
```

### 3. Resolve Repair Rules

For each validation error:

* Search the widget repair registry
* Determine whether a repair rule exists

Example:

```text
too_small:data.slides
```

maps to:

```text
Generate default slide
```

### 4. Evaluate Repairability

If one or more validation errors cannot be repaired:

```text
Mark Incident As Unresolved
Restore Last Known Valid Contract
Notify Team
Escalate For Review
```

### 5. Approval

Before repairs are executed:

* Notify the team
* Present the repair plan
* Await approval

If approval is denied:

* Notify the team
* Record the decision
* Restore the Last Known Valid Contract
* Mark the incident as unresolved
* Terminate the self-healing process

### 6. Apply Repairs

For each repairable validation error:

* Execute the repair rule
* Update the contract
* Record the change

Example:

```text
Slide count below minimum
↓
Insert placeholder slide
```

### 7. Revalidate

Re-run schema validation.

```ts
WidgetConfigSchema.safeParse(contract)
```

### 8. Resolution

If validation succeeds:

```text
Mark Incident As Resolved
Store New Valid Contract
Notify Team
```

If validation still fails:

```text
Mark Incident As Unresolved
Restore Last Known Valid Contract
Notify Team
Escalate For Review
```

## Repair Registry

Each widget maintains a registry of repair strategies.

Example:

```ts
{
  'too_small:data.slides': repairMissingSlides,
  'invalid_enum_value:settings.theme': repairTheme,
  'too_big:data.slides.*.text': repairLongText
}
```

The registry defines how validation failures can be automatically repaired.

## Success Criteria

A contract is considered healed when:

* All validation errors are resolved
* WidgetConfigSchema validation succeeds
* A valid contract is produced
* Required approvals have been obtained
* The contract can be used by the widget

## Contract History

The platform must maintain a Last Known Valid Contract (LKVC).

The LKVC represents the most recent contract that:

* Passed WidgetConfigSchema validation
* Accepted by the platform
* Produced a valid widget

The LKVC is used as the rollback target when:

* Validation cannot be repaired
* Repairs are rejected
* Repairs fail validation
* Deployment fails after repair

## Observability

The self-healing workflow should emit:

- contract.validation.started
- contract.validation.failed
- repair.plan.generated
- repair.approved
- repair.executed
- contract.validation.succeeded
- contract.rollback.executed
- incident.escalated