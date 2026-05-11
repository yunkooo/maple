---
name: gstack-cso
description: |
  Project-local /cso security audit skill inspired by garrytan/gstack. Use when the user asks for /cso,
  security audit, OWASP review, STRIDE threat model, vulnerability scan, or dependency supply-chain review.
---

# /cso — Chief Security Officer Audit

## Purpose

Run a read-only security audit and produce a clear security posture report. Think like an attacker, report like a defender.

Do not modify project code during `/cso`. The output is findings, evidence, exploit scenarios, and remediation guidance.

## Supported invocations

- `/cso`: full audit, low-noise mode, report only findings with confidence 8/10 or higher.
- `/cso --comprehensive`: broader audit, include lower-confidence suspicious items as `TENTATIVE`.
- `/cso --infra`: focus on infrastructure, CI/CD, secrets, deploy, containers, and configuration.
- `/cso --code`: focus on application code, auth, input handling, data flow, and OWASP issues.
- `/cso --supply-chain`: focus on dependencies, lockfiles, install scripts, and package-manager risk.
- `/cso --owasp`: focus on OWASP Top 10.
- `/cso --diff`: focus on current branch changes only when git context is available.

If multiple incompatible scope flags are provided, stop and ask the user to choose one scope.

## Audit workflow

### 1. Build the security mental model

- Identify the stack from files such as `package.json`, `tsconfig.json`, framework configs, server routes, API handlers, and deploy configs.
- Identify trust boundaries: browser to server, unauthenticated to authenticated, user to admin, app to third-party API, CI to deployment.
- Identify sensitive data: tokens, user data, payment data, credentials, API keys, session data, and logs.
- Summarize the architecture before listing findings.

### 2. Map attack surface

Look for:

- Public routes and API endpoints
- Authenticated routes
- Admin-only paths
- File upload or import paths
- Webhook receivers
- External API integrations
- Background jobs
- Browser storage and token handling
- CI/CD workflows
- Docker, deployment, and environment config

### 3. Check secrets and credential exposure

Inspect tracked files and relevant history when appropriate:

- `.env`, `.env.*`, config files, CI files, JSON/YAML/TOML files
- Known token prefixes such as `AKIA`, `sk-`, `ghp_`, `github_pat_`, `xoxb-`
- Inline secrets in CI instead of secret stores
- Missing or incomplete `.gitignore` coverage for local env files

Do not test discovered credentials against live services.

### 4. Check dependency and package-manager supply chain

For Node/npm projects, check:

- Whether lockfiles are present and tracked
- Whether package-manager config reduces fresh-package risk, for example `min-release-age`
- Whether install scripts such as `postinstall`, `preinstall`, or `prepare` exist in direct dependencies
- Whether `npm audit` or equivalent output is available if the user approves running it
- Whether dependency risk is actually reachable from app code before reporting as a major finding

### 5. Check CI/CD and infrastructure

Review:

- GitHub Actions and other CI workflows
- `pull_request_target` usage
- Unpinned third-party actions
- Secrets exposed to forked PRs
- Deployment scripts
- Dockerfiles and compose files
- Production vs local-only configuration

Report CI/CD issues only when a realistic untrusted-input or privilege-escalation path exists.

### 6. Check application security

Use framework-aware judgment. Prioritize:

- Broken access control
- Missing server-side authorization
- SQL/NoSQL injection
- Command injection
- SSRF where attacker controls host or protocol
- XSS escape hatches such as `dangerouslySetInnerHTML`
- Insecure direct object references
- Unsafe file upload handling
- Webhook handlers without signature verification
- Sensitive data in logs or browser storage
- Prompt injection and unsafe tool use if AI/LLM code exists

Do not flag React text rendering as XSS by default. Do not flag client-side auth checks as sufficient or insufficient without checking server enforcement.

### 7. Apply false-positive filtering

Default `/cso` mode is low-noise:

- Report only findings with confidence 8/10 or higher.
- Each finding must have a concrete exploit scenario.
- Suppress theoretical hardening advice unless it blocks a realistic attack.
- Suppress issues in tests, fixtures, docs, or local-only dev files unless they are used in production.
- Suppress generic DoS/rate-limit concerns unless there is concrete financial, auth, data, or availability impact.

For `/cso --comprehensive`, include suspicious lower-confidence issues as `TENTATIVE`, clearly separated from verified findings.

### 8. Verify candidates

Before reporting a finding:

- Trace the data flow.
- Check whether validation, escaping, authorization, or signature verification exists elsewhere.
- Confirm whether the vulnerable code path is reachable.
- Check for variants of the same pattern after one finding is verified.

Mark each finding as:

- `VERIFIED`: confirmed by code/config tracing.
- `UNVERIFIED`: likely pattern but reachability is not fully proven.
- `TENTATIVE`: comprehensive-mode suspicion below the normal confidence gate.

## Report format

Use this structure:

```text
SECURITY POSTURE REPORT

Architecture summary:
- ...

Attack surface:
- Public endpoints:
- Auth boundaries:
- External integrations:
- CI/CD:
- Secret management:

Findings:

## Finding 1: title

- Severity: CRITICAL | HIGH | MEDIUM | LOW
- Confidence: N/10
- Status: VERIFIED | UNVERIFIED | TENTATIVE
- Category: Secrets | Supply Chain | CI/CD | Auth | OWASP | Infrastructure | LLM Security
- Location: file:line
- Description:
- Exploit scenario:
- Impact:
- Recommendation:

No high-confidence findings:
- If no finding passes the confidence gate, say so directly.
- Mention important residual risks or skipped checks.

Disclaimer:
This is an AI-assisted first-pass security audit, not a substitute for a professional penetration test.
```

## Operating rules

- Read before judging.
- Prefer fewer real findings over many speculative findings.
- Never claim a vulnerability without an exploit path.
- Never modify code during `/cso` unless the user explicitly switches from audit to remediation.
- If a tool or command would be slow, destructive, network-heavy, or externally visible, ask before running it.
- If a check is skipped, state why.
