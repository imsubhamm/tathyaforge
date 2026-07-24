# Run the TathyaForge daily opportunity researcher

Execute the complete daily workflow. Do not stop after producing a spreadsheet.
The command center is the primary product; Excel is only an optional export.

1. Read `research-agent/README.md`, `config.json`, and the Cursor research rule.
2. Initialize the database with `npm run research:init`.
3. Determine today's date in Asia/Kolkata and create
   `research-agent/runs/YYYY-MM-DD/`.
4. Research current public sources for businesses inside India and within 400 km
   of postal code 713359.
5. Produce up to 20 genuinely qualified, non-duplicate opportunities. Do not
   pad weak leads.
6. For each lead capture:
   - business, city, state, industry, distance evidence;
   - observed problem and the currently visible solution;
   - proposed TathyaForge solution;
   - public professional/business contact details;
   - budget low/high in INR, reasoning, and confidence;
   - all scoring components, priority, conversion reasoning;
   - public source URLs, supported claims, and observation date.
7. Create private concept demos for the strongest five leads.
8. Write a valid `leads.json` compatible with `/api/opportunities`.
9. Update SQLite only after validating each record and deduplicating it.
10. Run `npm run research:verify`.
11. Run `npm run build` to prove the command center can consume the newest run.
12. Email the internal summary and available report attachments with
    `npm run research:send -- <attachments>`.

Never contact prospects. Never deploy prospect demos. Never print or commit
secrets or generated research data. Finish with counts, top five leads, coverage
limitations, validation results, and notification status.
