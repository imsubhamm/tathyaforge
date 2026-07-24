# Deploy the TathyaForge command center to EC2

Deploy only validated TathyaForge changes.

Target:

- SSH: `ssh -i ~/.ssh/zenxo-new-key.pem ubuntu@3.110.84.59`
- App: `/home/ubuntu/tathyaforge`
- PM2 process: `tathyaforge`

Required sequence:

1. Run `git status --short`, inspect the intended diff, and confirm generated
   research data and `.env` are not staged.
2. Run `npm run research:verify` and `npm run build`.
3. Inspect the EC2 Git status, PM2 state, and required environment-key presence
   without printing secret values.
4. Create a dated rollback archive of only the files being changed.
5. Transfer the validated application/workflow files. Preserve remote `.env`,
   `research-agent/data/`, pipeline state, unrelated apps, and PM2 processes.
6. On EC2, run the production build.
7. Restart only `pm2 restart tathyaforge --update-env`, then `pm2 save`.
8. Verify:
   - `https://tathyaforge.in/opportunities` returns 200;
   - `/api/opportunities` without a key returns 401;
   - the private on-server API returns the latest run and expected lead/demo
     counts without exposing the key.
9. Report the live URL and rollback archive.

Do not run `git reset --hard`, recursive deletion, broad rsync deletion, or any
command that can affect Kenzclub or another EC2 application.
