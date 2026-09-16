# Prompt for Cursor

Copy everything below into Cursor, and attach the file `API_JOURNALENTRYITEMBASIC_SRV.edmx` to the chat.

---

I'm building a portfolio piece to showcase SAP Fiori/UI5 skills: a **read-only Fiori Elements List Report + Object Page** app called **"Journal Entry Monitor"**, themed around SAP Finance (universal journal line items).

## Data source

I've attached the real SAP OData V2 metadata file `API_JOURNALENTRYITEMBASIC_SRV.edmx` (SAP's "Journal Entry Item – Basic" API). Use it as the **source of truth** for entity names, field names, types, and cardinalities — don't invent your own field names.

Key entities in the metadata:
- `A_JournalEntryItemBasic` — the main flat entity (journal line items), this is the List Report's collection
- `A_CompanyCode`, `A_CostCenter`, `A_ProfitCenter`, `A_GLAccountInChartOfAccounts` — reference/master data entities, reachable via navigation properties `to_CompanyCode`, `to_CurrentCostCenter`, `to_CurrentProfitCenter`, `to_GLAccountInChartOfAccounts`

This service is **read-only** in real life (only `Capabilities.ReadRestrictions` annotations exist, no create/update/delete) — keep it that way in the app. No CRUD, no draft handling. This is a monitoring/reporting app, not a data-entry app.

## Tech stack

- SAPUI5 / Fiori Elements, OData V2 (matching the metadata's protocol), latest stable UI5 version
- `sap.fe.templates.ListReport` + `sap.fe.templates.ObjectPage` (metadata-driven, annotation-based — not freestyle views)
- Local **Mock Server** (`sap/ui/core/util/MockServer`) using the provided `.edmx` as `metadata.xml`, so the app runs standalone with `ui5 serve` / VS Code Live Preview, no real backend needed
- Local **UI annotations file** (since the real SAP metadata has no `UI.*` vocabulary terms) — add these yourself as a separate local annotations XML, referenced from `manifest.json`, to drive `LineItem`, `SelectionFields`, `HeaderInfo`, `Facets`, `Identification`, `DataPoint`, `Criticality`, `FieldGroup`

## Mock data requirements

Generate realistic, internally consistent mock data (300–500 rows minimum) for `A_JournalEntryItemBasic` plus matching rows in the reference entities:

- Spread across **multiple company codes** — mix a UK one and a Brazilian one (e.g. `UK01` / `BR01`) with matching currencies (GBP, BRL) alongside a EUR/USD one, to reflect a real multi-country group
- Multiple **fiscal years/periods** (last 2–3 years) and posting dates
- A realistic spread of **GL accounts**: revenue accounts, expense accounts (COGS, payroll, rent, utilities), balance sheet accounts (AR, AP, cash) — with sensible account number ranges (SAP convention: 4xxxxx revenue, 5xxxxx expense, etc.)
- Mix of **debit and credit postings** so amounts naturally include negative values (credit side) — this is what drives the red/negative-value styling below
- Several **cost centers and profit centers** with names, not just codes
- A few **outlier/edge rows** on purpose: unusually large amounts, a couple of "obsolete"/reversed items (there's a `JrnlEntryItemObsoleteReason` field in the metadata — use it), a null cost center here and there, to make filtering/empty states meaningful to demo

## List Report requirements

- **Filter bar**: Company Code, Fiscal Year, Posting Date (range), Cost Center, Profit Center, GL Account, Ledger — with value help (F4) dialogs backed by the reference entities where possible
- **Table columns**: document number, posting date, GL account (code + description), cost/profit center, amount in transaction currency, amount in company code currency, debit/credit indicator
- **Negative/credit amounts styled in red** — use `Criticality` annotation (or a calculated `Negative`/`Positive` DataField state) on the amount column so Fiori Elements renders it in the standard semantic red/green, not custom CSS
- **Status/semantic icon column** for the obsolete/reversed indicator (ObjectStatus with icon + criticality, not just plain text)
- **KPI header / DataPoint**: a couple of aggregate tags above the table (e.g. total posted amount, count of reversed items) using `UI.DataPoint` + `UI.HeaderInfo`
- **Multi-dimensional/Analytical List Page (ALP) toggle**: let me switch between table view and a chart view (bar chart: amount by GL account, or by cost center) — this is a key differentiator, please implement it properly with `sap.fe.templates.ListReport` ALP configuration, not a hacked-in chart
- **Variant management**: standard SmartVariantManagement so filter/sort/column setups can be saved
- **Excel export**: use the standard Fiori Elements table toolbar export-to-spreadsheet capability (`sap.ui.export`/`Table Personalization`) — should work out of the box if properly annotated, just make sure it's enabled and column headers are meaningful
- **PDF export**: Fiori Elements has no native PDF export, so add a custom toolbar action button that generates a PDF of the current table selection (client-side, e.g. via `pdfmake`) — keep it visually consistent with Fiori (standard button, icon, busy indicator while generating)
- **Empty/error states**: use `sap.m.IllustratedMessage` for "no data" and error scenarios, not a blank table

## Object Page requirements

- Header: document number, company code, posting date, total amount with currency, obsolete/status indicator
- Facets/sections:
  - General Information (main journal item fields)
  - Company Code section (via `to_CompanyCode` navigation)
  - Cost Center / Profit Center section (via navigation)
  - GL Account section (via `to_GLAccountInChartOfAccounts` navigation)
- Use `Identification`/`FieldGroup` annotations to organize fields cleanly, not one giant flat list

## Extra creative touches (nice-to-have, use judgment)

- Currency-aware number formatting (right-aligned, correct decimals per currency, `sap:unit`/`sap:semantics="currency-code"` respected)
- Grouping/sorting by GL account or cost center in the table
- "Share" menu (send as email / save as tile) in the shell if easy to wire up
- Responsive behavior — table should degrade gracefully on tablet/phone widths
- Sensible `i18n.properties` for all labels (no hardcoded strings), proper accessibility labels

## What I do NOT want

- No create/edit/delete anywhere, no draft indicator
- No custom freestyle SAPUI5 views where a Fiori Elements annotation would do the same job — I want this to demonstrate the annotation-driven Fiori Elements approach, since that's the industry-standard way these apps get built
- No exotic third-party UI kits — stick to `sap.m`/`sap.fe`/`sap.ui.comp` controls so it looks and behaves like a real Fiori app

## Deliverable structure

Please scaffold a clean project:
```
webapp/
  Component.js
  manifest.json
  localService/
    metadata.xml         <- from the attached .edmx
    mockdata/
      A_JournalEntryItemBasic.json
      A_CompanyCode.json
      A_CostCenter.json
      A_ProfitCenter.json
      A_GLAccountInChartOfAccounts.json
  annotations/
    annotations.xml      <- local UI annotations
  i18n/
    i18n.properties
README.md                <- how to run it locally (ui5 serve command, mock server explanation)
```

Ask me questions if anything about the annotation structure or mock data volume is unclear before you start generating hundreds of rows.
