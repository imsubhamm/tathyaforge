# Verify this repository is ready for Cursor

1. Verify Node.js, npm, Git, SSH, and Cursor Agent CLI availability.
2. Run `npm ci` only when dependencies are missing or the lockfile changed.
3. Confirm `.env` exists, but never display it.
4. Run `npm run research:init`.
5. Run `npm run research:verify`.
6. Run `npm run build`.
7. Start `npm run dev` and report:
   - public site URL;
   - private command-center URL `/opportunities`;
   - whether the protected API returns 401 without a key.
8. Check `cursor-agent status` or `agent status` if the CLI is installed.
9. List configured MCP servers without changing them.

Report only missing tools, credentials, or manual actions. Do not reveal secrets.
