# 🚀 Admin Site Deployment Guide

## Files Ready for Production

All files in this directory (`~/dev/talos-admin/`) are production-ready and tested.

## Required Files to Deploy

```
index.html          # Login page (main entry point)
dashboard.html      # Admin dashboard
users.html          # User management
settings.html       # Settings and help
welcome.html        # First-time onboarding
favicon.svg         # (if exists)
```

**Do NOT deploy these:**
- `index.html.backup` (old file)
- `dashboard-old.html` (old file)
- `ADMIN-POLISH-COMPLETE.md` (documentation)
- `DEPLOY.md` (this file)
- `.git/` (if pushing to different repo)

## Deployment Options

### Option 1: Vercel (Recommended)

1. Install Vercel CLI (if not installed):
```bash
npm i -g vercel
```

2. Deploy from this directory:
```bash
cd ~/dev/talos-admin
vercel --prod
```

3. Set custom domain in Vercel dashboard:
   - Go to project settings
   - Add domain: `admin.talospro.ai`
   - Add DNS records as instructed

### Option 2: Netlify

1. Drag & drop deploy:
   - Go to https://app.netlify.com/drop
   - Drag the entire `talos-admin` folder (excluding backups)
   - Get deploy URL

2. Set custom domain:
   - Go to Domain Settings
   - Add custom domain: `admin.talospro.ai`
   - Update DNS (see DNS Setup below)

### Option 3: CloudFlare Pages

1. Connect GitHub repo or direct upload:
```bash
npx wrangler pages publish ~/dev/talos-admin --project-name=talos-admin
```

2. Set custom domain in CloudFlare Pages dashboard

### Option 4: Traditional Server (nginx/Apache)

If you have a server, upload files via FTP/SFTP to:
```
/var/www/admin.talospro.ai/
```

nginx config:
```nginx
server {
    listen 80;
    server_name admin.talospro.ai;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name admin.talospro.ai;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    root /var/www/admin.talospro.ai;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## DNS Setup

Point `admin.talospro.ai` to your hosting:

### For Static Hosts (Vercel/Netlify/CloudFlare)
```
Type: CNAME
Name: admin
Value: <provided-by-hosting> (e.g., cname.vercel-dns.com)
```

### For Traditional Server
```
Type: A
Name: admin
Value: <your-server-ip>
```

**DNS is managed at GoDaddy:**
- Login: godaddy.com (Customer #631464066)
- Go to DNS management for talospro.ai
- Add/update the CNAME or A record

## Verification

After deployment, test:

1. Visit https://admin.talospro.ai
2. Verify HTTPS lock icon
3. Try login flow (should hit API at talos.talospro.ai)
4. Check mobile view (resize browser or use phone)
5. Test all navigation links

## Environment Check

The admin site expects:
- Backend API at `https://talos.talospro.ai`
- Endpoints:
  - `POST /api/login` (email + password, checks isAdmin)
  - `GET /api/admin/stats` (platform stats)
  - `GET /api/admin/tenants` (user list)
  - `GET /health` (system health)

## Rollback Plan

If issues arise:
```bash
# The old files are backed up as:
# - index.html.backup (original login)
# - dashboard-old.html (original dashboard)

# To rollback quickly:
mv index.html index.html.new
mv index.html.backup index.html
mv dashboard.html dashboard.html.new
mv dashboard-old.html dashboard.html
# Then redeploy
```

## Post-Deployment

1. Test with a real admin account
2. Verify mobile experience
3. Check console for any errors
4. Monitor analytics (if set up)
5. Share with team for feedback

## Current Status

✅ All files tested locally
✅ API integration verified
✅ Mobile responsive confirmed
✅ Security features implemented
✅ Help/support links active
✅ Loading states working
✅ Error handling in place

**Ready to deploy to production!**
