# cloud-cost-optimization-platform-cyberX
# CloudOpt — AWS Cloud Cost Optimization MVP

CloudOpt is a hackathon MVP that helps teams **discover cloud waste**, **understand weekly spend**, and **take safe remediation actions** (script-based) — all from a single, engineer-friendly dashboard.

**Focus (MVP): AWS only** — scanning and insights for **EC2, S3, and RDS** (+ common cost-leak resources like volumes/snapshots/EIPs).

---

## Why this exists

In real teams, multiple users spin up resources and forget them:
- Unused **snapshots / AMIs**
- Unattached **EBS volumes**
- Unassociated **Elastic IPs**
- Idle **EC2** / underutilized **RDS**
- Buckets without lifecycle policies

This creates “silent spend” that quietly pushes monthly bills up.

CloudOpt’s goal: **Find waste → quantify savings → generate actions → keep accounts clean**.

---

## What makes CloudOpt different (vs CloudWatch-only workflows)

CloudWatch is powerful, but cost cleanup typically requires:
- jumping service-by-service,
- manually interpreting metrics,
- and manually writing remediation steps.

CloudOpt provides:
- **Weekly cost & usage summary** (cost narrative, trends)
- **One-screen resource view** (EC2/S3/RDS findings together)
- **Confidence-based waste detection**
- **Remediation automation** via generated **Terraform / boto3 scripts**
- Optional guardrailed **auto-cleanup** based on policy/tag + time threshold

---

## Key features (MVP)

### ✅ Discovery & Insights
- AWS account connection (AssumeRole / IAM inputs)
- Scan coverage: **EC2 + S3 + RDS**
- Unused/idle detection (rules-driven)
- Estimated savings (per finding)

### ✅ Reporting & Governance
- Weekly cost summary (planned via Cost Explorer integration)
- Budget/usage threshold alerts (planned)

### ✅ Remediation
- Generate **Terraform** / **boto3** scripts for cleanup and infra actions
- Dry-run + approval-first flow (recommended for safety)
- Audit-friendly action history (UI pattern)

> Note: In hackathon demos, **Demo Mode** is often enabled to avoid handling real credentials live on stage.
> Live scanning can be connected through backend API routes / a worker service.

---

## Screens (UI)

1. **Connect AWS Account**
2. **Run Scan** (EC2 → S3 → RDS progress)
3. **Findings Dashboard** (filters, confidence, savings)
4. **Weekly Cost Report**
5. **Remediation** (script generation + approval)

---

## Process flow

```mermaid
flowchart TD
  U[User] --> C[Connect AWS Account]
  C --> S[Start Scan]
  S --> I[Discover Resources\nEC2/S3/RDS]
  I --> M[Fetch Metrics + Cost\nCloudWatch + Cost Explorer]
  M --> R[Rules Engine\nUnused/Idle Detection]
  R --> F[Findings + Savings Estimate]
  F --> G[Generate Terraform/boto3 Scripts]
  G --> A[Approval Gate]
  A --> X[Execute Action]
  X --> L[Audit Log + Notifications]
  L --> W[Weekly Report + Alerts]
Prerequisites

Node.js 18+ (recommended)

npm / pnpm
npm install
npm run dev
npm run build
npm start

