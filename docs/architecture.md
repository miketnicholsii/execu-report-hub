# CFS Status Tracker Architecture

## Architecture Summary
- **Frontend:** React + TypeScript SPA with route-based portfolio and customer pages (`/` and `/customers/:slug`).
- **Data services:** Normalization and audit library in `src/lib/cfs/*`.
- **Import layer:** raw rows are immutable; normalized entities are derived and carry source trace.
- **Persistence target:** Prisma schema for `source_imports`, `raw_source_rows`, `tracker_items`, `action_items`, `customers`, `projects`, `deliverables`.

## Import Pipeline Approach
1. Ingest workbook/PDF file and register a `SourceImport` record.
2. Parse each source tab/page into immutable `RawSourceRow` records.
3. Normalize rows into `TrackerItem` objects preserving source metadata.
4. Extract first-class `ActionItem` rows from `next_steps`, notes, waiting statuses, and deployment signals.
5. Run audits (`raw vs normalized`, missing status/owner, duplicates, unmapped, empty export).
6. Publish rows to UI and CSV exports.

## Normalization Logic
- Sheet mapping:
  - Open → active/open work
  - Complete → completed items
  - Deployments → deployed code changes
  - Pending Deployment → pending deployment queue
  - Archive → historical items
- Empty/ambiguous values are retained and flagged via `review_flag` and `Needs Review` bucket.
- Original wording is carried in `raw_record` and descriptive fields.

## Status Mapping Logic
- Source statuses map to standardized display buckets with regex-based rules.
- If explicit status cannot be mapped, fallback uses source-sheet semantics.
- Fully ambiguous rows map to `Needs Review` and stay visible.

## Route Structure
- `/`: Portfolio home with KPI summary, audit panel, customer links, CSV exports.
- `/customers/:customerSlug`: Customer tracker with filters, sections, source trace, action board, and CSV downloads.

## UI Plan
- Executive strip on portfolio for total counts and risk indicators.
- Customer breakout pages with section blocks: active/open, action items, pending deployment, completed, deployed, archive, milestones, review queue.
- Source tab filter to preserve workbook tab context.

## CSV Export Plan
- Portfolio:
  - all standardized tracker rows
  - all action items
  - deployment + pending deployment summary
- Per customer:
  - standardized tracker rows
  - action items only
  - raw source rows
- All exports include source trace fields (`source_file`, `source_sheet`, `source_row`, `raw_record`, `imported_at`).
