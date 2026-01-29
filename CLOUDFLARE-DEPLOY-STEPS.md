# Cloudflare Pages Deployment - Manual Steps

## Current Status
- Wrangler CLI waiting for OAuth completion
- Browser opened to Cloudflare signup/login
- Admin portal ready to deploy from: https://github.com/raven-singh-ai/talos-admin

## Quick Deploy via GitHub (RECOMMENDED - 2 minutes)

1. **Complete Cloudflare signup** (if browser is open):
   - Use: raven@supr.ae
   - Password: rszzonxFFA21!
   - Verify email

2. **Create Pages project from GitHub**:
   - Go to: https://dash.cloudflare.com/pages
   - Click "Create a project"
   - Click "Connect to Git"
   - Authorize GitHub (raven-singh-ai account)
   - Select repository: `talos-admin`
   - Build settings:
     - Framework preset: None
     - Build command: (leave empty)
     - Build output directory: `/`
   - Click "Save and Deploy"

3. **Get deployment URL**:
   - Should be: `talos-admin.pages.dev`
   - Test immediately from UAE

4. **Add custom domain** (if .pages.dev works):
   - Pages project → Custom domains
   - Add: `admin.talospro.ai`
   - Copy DNS records
   - Update at GoDaddy

## Alternative: CLI Deploy (after OAuth completes)

If wrangler login succeeds, run:
```bash
cd ~/dev/talos-admin
npx wrangler pages deploy . --project-name talos-admin
```

## Why Cloudflare for UAE
- Different IP ranges than Vercel/Railway
- UAE data centers (better latency)
- Less likely to be ISP-blocked
