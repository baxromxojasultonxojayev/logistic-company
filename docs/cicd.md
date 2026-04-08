# BSM-LOGISTICS — CI/CD with GitHub Actions

Pushing to `main` automatically builds the Next.js static site and deploys it to the Ubuntu VDS via rsync. No manual steps needed after initial setup.

---

## How it works

```
git push → main
    │
    ▼
GitHub Actions runner (ubuntu-latest)
    ├── npm ci          (install deps)
    ├── npm run build   (produces out/)
    └── rsync out/ → deploy@95.130.227.123:/var/www/bsm/frontend/out/
```

Nginx on the server picks up the new files immediately — no process restart needed.

---

## One-time setup

### 1. Add GitHub repository secrets

Go to **GitHub → your repo → Settings → Secrets and variables → Actions → New repository secret**.

Add these three secrets:

| Secret name        | Value                |
|--------------------|----------------------|
| `SERVER_HOST`      | `95.130.227.123`     |
| `SERVER_USER`      | `root` or `deploy`   |
| `SERVER_PASSWORD`  | Your SSH password    |

---

## Workflow file

Located at `.github/workflows/deploy.yml`. It runs on every push to `main`:

```yaml
on:
  push:
    branches:
      - main
```

Steps:
1. Checkout code
2. Setup Node.js 20 with npm cache
3. `npm ci` — clean install
4. `npm run build` — outputs `out/` (static export)
5. Configure SSH with the private key from secrets
6. `rsync -avz --delete out/` → server

`--delete` removes files from the server that no longer exist in the build, keeping the deployment clean.

---

## Verifying a deployment

After a push to `main`, go to **GitHub → Actions** to watch the run. A green checkmark means the new build is live.

To verify manually:

```bash
curl http://95.130.227.123/
# Should return the updated HTML
```

---

## Rollback

GitHub Actions does not keep old builds on the server. To roll back:

```bash
# On your local machine — checkout the previous commit
git checkout <previous-commit-sha>
npm run build
rsync -avz --delete out/ deploy@95.130.227.123:/var/www/bsm/frontend/out/
```

Or revert the commit and push to `main` — the CI pipeline will redeploy automatically.

---

## Troubleshooting

| Problem | Check |
|---------|-------|
| `Permission denied (publickey)` | The public key is not in `~/.ssh/authorized_keys` on the server, or `SERVER_USER` secret is wrong |
| `Host key verification failed` | Transient issue — re-run the job; `ssh-keyscan` runs fresh each time |
| Build fails | Check the **Actions** log for the error — usually a TypeScript or missing env variable issue |
| Files not updating on site | Check Nginx is serving from `/var/www/bsm/frontend/out/` and the rsync step completed without errors |
