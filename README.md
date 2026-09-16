# Journal Entry Monitor — Analytical List Page

Read-only **Fiori Elements Analytical List Page + Object Page** for SAP universal journal line items.

Field names come from the real OData V2 metadata `API_JOURNALENTRYITEMBASIC_SRV`. Time is `LedgerFiscalYear` / `FiscalPeriod` / `FiscalYearPeriod`. The technical key is `ID`.

## Run locally

```bash
npm install
npm start
```

Opens [http://localhost:8082/index.html](http://localhost:8082/index.html).

The companion **List Report** lives in [mindtek-journalentry-monitor](https://github.com/igormuntoreanu/mindtek-journalentry-monitor) on port 8081.

## Mock server

`webapp/localService/mockserver.js` uses `sap/ui/core/util/MockServer` with a copy of the SAP EDMX and 420 mock journal items. The OData model runs in **client** operation mode so the ALP chart can aggregate locally.

```bash
npm run generate-mockdata
```
