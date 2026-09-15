# Deployment verification manifest

## Policy
- The Ollama autonomous agent must verify deployment configuration, environment variables, and official platform documentation before attempting fixes.
- Whenever a deployment fails, the agent should capture the exact error message, identify the likely root cause, and apply the smallest verified fix.
- For Vercel, GitHub Actions, and other host platforms, the agent should prefer the official platform docs and the repository's deployment workflow files over guesswork.

## Detected deployment surfaces
- GitHub Actions: .github/workflows/ci-cd.yml
- GitHub Actions: .github/workflows/deploy.yml
- GitHub Actions: .github/workflows/docker-build-push.yml
- GitHub Actions: .github/workflows/publish-q-alpha.yml
- GitHub Actions: .github/workflows/publish-releases-realtime.yml
- GitHub Actions: .github/workflows/vercel-autofix.yml
- Netlify: netlify.toml
- Vercel: vercel.json, .github/workflows/deploy.yml, .github/workflows/vercel-autofix.yml, app/api/deploy/route.ts

## Verification checklist
- Confirm build and install commands are valid for the current repository state.
- Verify required environment variables are present for the target platform before deployment.
- Check deployment logs and route health after a deploy or redeploy attempt.
- Re-run verification after each fix until deployment health is confirmed.

## Official references
- Vercel: https://vercel.com/docs (Use official Vercel documentation for deployments, redeployments, environment variables, and build settings.)
- GitHub Actions: https://docs.github.com/actions (Use GitHub Actions documentation for workflow reliability, secrets, and deployment automation.)
- Netlify: https://docs.netlify.com/ (Use Netlify docs for deployment configuration, environment handling, and redeploys.)
- Render: https://render.com/docs (Use Render docs for service deployments, health checks, and runtime environment configuration.)
- Railway: https://docs.railway.app/ (Use Railway docs for environment provisioning and staging deployment flows.)
- Fly.io: https://fly.io/docs/ (Use Fly.io docs for app deployment, scaling, and runtime health checks.)
