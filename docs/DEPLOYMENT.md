# Deploying NEMO-RED

This is a server-backed Next.js application. A static export cannot run the inference routes. Hosting the web app outside Nebius is compatible with the stated technology requirement when the actual inference uses NVIDIA models on Nebius Token Factory; document that architecture clearly.

## Node host

1. Deploy the repository root containing `package.json` to a Node.js 22.13+ host.
2. Install with `npm ci`; build with `npm run build`; start with `npm start -- -H 0.0.0.0 -p 3000`.
3. Set runtime environment variables from `.env.example` using the host's secret settings. Do not upload `.env.local` to a public repo or image.
4. Allow up to 180 seconds for attack/immunize requests. A turn makes several sequential model calls. Hosting platforms may override the route duration setting.
5. Enable HTTPS, a spending limit on the inference account, and host-level rate controls. Ensure judges can access the app free through December 15, 2026 at noon Pacific.
6. Test from an incognito browser: connection, live attack, findings, patch/replay where applicable, report download, and a mobile viewport.

## Container

A multi-stage Dockerfile builds Next.js standalone output and runs it as an unprivileged user. `.dockerignore` excludes credentials and local artifacts.

```bash
docker build -t nemored .
docker run --rm -p 3000:3000 --env-file .env.local nemored
```

The container receives secrets only at runtime. Configure the hosting provider to send traffic to port 3000. Docker execution has not been verified unless recorded separately in the validation notes.

## Publishing source

Review `git diff`, confirm that no secrets or private transcripts are staged, commit the changes, and push to the existing repository remote. Confirm the repository is public and that its root README and MIT license render correctly. Local changes alone do not update the public submission repository.

## Evidence status

A successful `/api/status` response proves a short model completion, not the entire adversarial workflow. Sample fixtures and mocked browser checks demonstrate UI behavior only. Record a live complete workflow before calling the submission ready.
