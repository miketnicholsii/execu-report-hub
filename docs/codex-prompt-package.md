# Codex Prompt Package

## Computerway Food Systems — RM-Level Customer Detail

### Purpose
Provide a Codex-ready implementation prompt that explicitly requires RM detail for each customer, while packaging current tracker context into a single handoff document.

### Included source trackers
- `Consolidated Catfish - Issue Tracker(4).xlsx`
- `Case Farms - Open Items(1).xlsx`
- `Braswell - Open Items(4).xlsx`
- `Banks Cold Storage - Issue Tracker(4).xlsx`

### Current open item snapshot
| Customer | Open Items | Open RM / Ref Items | Open Non-RM Items | Primary Source Sheet |
|---|---:|---:|---:|---|
| Consolidated Catfish | 23 | 18 | 5 | Open |
| Case Farms | 25 | 10 | 15 | Open |
| Braswell | 23 | 13 | 10 | Open |
| Banks Cold Storage | 14 | 13 | 1 | Open |

---

## Codex Implementation Prompt

Build a production-grade Computerway Food Systems (CFS) customer, initiative, and RM tracking platform.

The implementation must explicitly include RM-level detail for each customer and preserve a clean path for non-RM contextual work items. Use uploaded Excel trackers as source inputs and normalize them into a standardized, graphable, editable system.

### Mandatory source files
- Consolidated Catfish - Issue Tracker(4).xlsx
- Case Farms - Open Items(1).xlsx
- Braswell - Open Items(4).xlsx
- Banks Cold Storage - Issue Tracker(4).xlsx

### Primary objective
Create a polished CFS portfolio dashboard that gives macro and micro visibility:
1. Portfolio view across all customers
2. Customer view with initiative callouts
3. Initiative view with milestone/install context
4. RM-level and non-RM work-item detail
5. Weekly summary rollups for beginning, middle, and end of week
6. One-click export to Excel / CSV / PDF
7. Redmine export and re-import workflow for richer reporting

### Non-negotiable RM detail requirement
For every customer page, show a dedicated RM detail section that includes (for each RM):
- RM number
- Title/topic
- Associated initiative
- Current status
- Last acted upon date
- Target / ETA
- Notes
- Next steps
- Owner / assignee (if available)
- Blocked / stale / due-soon indicators
- Install-related, deployment-related, or general support classification
- Export eligibility for Redmine reporting

If a customer item has no RM, track it as a standardized contextual work item with the same operational fields where possible:
- Title
- Customer
- Initiative
- Status
- Last acted upon
- Summary / details
- Next steps
- Notes
- Target / ETA
- Source file / sheet
- Whether it should become an RM later

### Required hierarchy
Portfolio Dashboard -> Customer -> Initiative -> RM or Context Work Item -> Detailed Reporting / Export

### Top-level routes
- `/dashboard`
- `/weekly-summaries`
- `/customers`
- `/customers/:customerId`
- `/initiatives`
- `/initiatives/:initiativeId`
- `/redmine`
- `/redmine/:rmNumber`
- `/work-items`
- `/work-items/:workItemId`
- `/key-dates`
- `/reports`
- `/exports`
- `/settings`

### Required entities
- Customer
- Initiative
- RedmineTicket
- ContextWorkItem
- ActionItem
- Deliverable
- Milestone
- InstallRecord
- DeploymentRecord
- Risk
- Blocker
- WeeklySummary
- Renewal
- LinkedReference
- UpdateLog

### Required standard fields
All major records should support these where relevant:
- `id`
- `customerId`
- `initiativeId`
- `title`
- `status`
- `health`
- `priority`
- `owner`
- `summary`
- `openQuestions`
- `nextSteps`
- `blockers`
- `lastActedUpon`
- `createdAt`
- `updatedAt`
- `dueDate`
- `targetDate`
- `sourceFile`
- `sourceSheet`
- `rawSourceRow` / source reference
- `exportable`

### Standard enums
**Statuses**
- Not Started
- Discovery
- In Progress
- In Testing
- Ready for Deployment
- Deployed
- Blocked
- Closed
- On Hold

**Health**
- Healthy
- Watch
- At Risk
- Critical

**Priority**
- Low
- Medium
- High
- Urgent

**Initiative Types**
- Enhancement
- Bug / Fix
- Upgrade
- Deployment
- Integration
- Infrastructure
- Reporting
- Renewal
- Internal Improvement
- Discovery / Spec
- Install / Go-Live
- Support / Maintenance

### Weekly summary framework
Support summary records for:
- Beginning of Week
- Mid-Week
- End of Week

Each summary must roll up at:
- Portfolio level
- Customer level
- Initiative level

Each summary must allow:
- Key highlights
- Open questions
- Next steps
- Blockers
- Notable progress
- Key date changes
- RM updates
- Owner
- Timestamp

### Portfolio dashboard requirements
Show:
- Active customers
- Active initiatives
- Open RM count
- Open non-RM work-item count
- Overdue action count
- Blocked item count
- At-risk item count
- Installs in progress
- Deployments upcoming
- Weekly highlights
- Key dates this week / month
- Top blockers
- Top open questions
- Next steps by owner
- Primary customer/initiative callouts
- Miscellaneous customer deliverables

### Customer page requirements
For each customer page show:
- Customer summary
- Health and status
- Owner
- Primary initiatives
- Key highlights
- Open questions
- Next steps
- Active RM table
- Active non-RM work-item table
- Deliverables
- Key dates
- Install / deployment milestones
- Recent activity
- Last acted upon rollup
- Export actions

### Initiative page requirements
For each initiative show:
- Title
- Customer
- Type
- Summary
- Business goal
- Technical goal
- Phase
- Health
- Percent complete
- Owner
- Milestone list
- Install dates
- Deployment dates
- Related RMs
- Related work items
- Open questions
- Next steps
- Blockers
- Risks
- Last acted upon
- Gantt-ready schedule data

### RM detail page requirements
For each RM include:
- `rmNumber`
- Title
- Customer
- Initiative
- Type
- Status
- Health
- Priority
- Severity
- Owner
- Summary
- Business context
- Technical context
- Notes
- Next steps
- Blockers
- Last acted upon
- Due date
- Target release / ETA
- Source workbook references
- Imported Redmine detail fields
- Exportability flag
- Update history

### Context work-item page requirements
For non-RM items include:
- Title
- Customer
- Initiative
- Category
- Status
- Health
- Priority
- Summary
- Details / context
- Notes
- Next steps
- Blockers
- Last acted upon
- Due date / target
- Source workbook references
- `shouldBecomeRM`

### Key date / install requirements
Track full install and deployment lifecycle where available:
- Discovery
- Spec complete
- Development start
- Testing start
- Travel date
- Washdown date
- Install date
- Test run date
- Startup date
- Go-live date
- Deployment date
- Hypercare
- Follow-up review

Provide:
- Key date tables
- Timeline views
- Gantt charts
- Overdue indicators
- Dependency callouts

### Inline editing requirements
Allow inline editing for:
- Status
- Health
- Owner
- Next steps
- Open questions
- Summary
- Notes
- Dates
- Initiative assignment
- RM assignment
- Deliverables
- Action items

### Export requirements
Support one-click export to:
- Excel
- CSV
- PDF

Exportable views:
- Full portfolio
- Weekly summary
- Customer summary
- Initiative detail
- RM detail
- Non-RM work-item detail
- Key-date report
- Install report
- Action-item report
- Redmine export package

### Redmine export / import workflow
Implement a Redmine export manager that can:
- Detect RM references from all trackers
- Normalize them
- Deduplicate them
- Group by customer
- Group by initiative
- Group by owner
- Group by status
- Export as comma-separated, line-separated, and grouped outputs
- Export to CSV / Excel / PDF
- Support copy-to-clipboard helper outputs

Implement a re-import flow so externally generated Redmine report data can come back into the app and update:
- Status
- Owner / assignee
- Updated date
- Summary / notes
- Priority
- Next steps
- Richer RM metrics

### Data ingestion requirements
Parse uploaded Excel files directly. Do not rely on manual re-entry when source data exists in trackers.

Parsers must:
- Read workbook/sheet names
- Extract rows from `Open`, `Complete`, `Deployments`, and `Archive` sheets where relevant
- Preserve raw source values
- Normalize statuses and dates
- Infer RM vs non-RM items
- Infer customer from workbook
- Infer likely initiative clusters from topic/context when possible
- Flag uncertain mappings for review (rather than hiding them)

### Reporting / charting requirements
Implement charts for:
- Open RMs by customer
- Open RMs by initiative
- Items by status
- Items by health
- Overdue actions by owner
- Stale items aging
- Installs by phase
- Milestones due soon
- Blocked items by customer
- Primary initiative health
- Weekly summary trends

### Industry-standard PM enhancements
Include:
- Stale-item detection
- Overdue next-step detection
- Milestone slippage indicators
- Dependency visibility
- Risk register
- Blocker register
- Owner accountability rollups
- Activity freshness indicators
- Install readiness indicators
- Deployment readiness indicators
- Change log / update history
- Quick filters for Needs Attention, Stale, Blocked, At Risk, Due Soon

### UX / visual requirements
UI should feel premium, simple, and highly organized (not generic admin).

Use:
- Strong typography
- Clear summary cards
- Clean tables
- Restrained color palette
- Sticky filters
- Elegant graphs
- Executive summary mode
- Operational detail mode
- Clear drilldown navigation
- Print-friendly layouts

### Build order
1. Schema and enums
2. Workbook ingestion and normalization
3. Seed/imported dataset service
4. Portfolio dashboard
5. Customer pages
6. Initiative pages
7. RM pages
8. Context work-item pages
9. Key-date and Gantt views
10. Export layer
11. Redmine export/import workflow
12. Inline editing and audit logging
13. Reporting polish

### Final expectation
Deliver a comprehensive CFS project-status system that explicitly preserves RM-level detail for each customer, while also supporting non-RM contextual work, standardized metrics, executive reporting, and exportable operational detail.

---

## Appendix A — Current Open Tracker Rows to Preserve
Use this appendix as a compact source-context snapshot. It is not a substitute for direct workbook ingestion.

Codex should parse uploaded Excel files directly and treat the appendix as guidance for expected customer-by-customer RM coverage.

> Full detailed row-level appendix content is intentionally maintained in the source handoff document and tracker workbooks to avoid drift. Keep this appendix synchronized from workbook imports during implementation.
