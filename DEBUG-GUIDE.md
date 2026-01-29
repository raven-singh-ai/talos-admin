# 🐛 DEBUG GUIDE - TalosPro Admin Portal

**Date:** Jan 29, 2026 @ 20:00 UTC+4  
**Status:** Debug build deployed with comprehensive logging

---

## 🚨 ISSUE SUMMARY

### Issue #1: Logo showing as TEXT
**Symptom:** Seeing "TalosPro Admin" text instead of purple crystal logo  
**Root cause:** Logo image (logo.svg) not loading in browser

### Issue #2: Users list empty
**Symptom:** "Unable to load users. Please refresh the page."  
**Root cause:** API fetch failing (401/403/500 or network error)

---

## 🔍 STEP-BY-STEP DEBUGGING

### STEP 1: Open Browser Console
```
1. Visit https://admin.talospro.ai
2. Press F12 (or Cmd+Option+I on Mac)
3. Click "Console" tab
4. Keep it open while testing
```

### STEP 2: Check Logo Loading
**In Console, run this:**
```javascript
// Check if logo element exists
const logo = document.querySelector('img[alt*="TalosPro"]');
console.log('Logo element:', logo);
console.log('Logo src:', logo?.src);
console.log('Logo complete:', logo?.complete);
console.log('Logo naturalHeight:', logo?.naturalHeight);

// Try to load logo manually
fetch('/logo.svg')
  .then(r => {
    console.log('Logo fetch status:', r.status);
    console.log('Logo content-type:', r.headers.get('content-type'));
    return r.text();
  })
  .then(svg => console.log('Logo SVG length:', svg.length))
  .catch(e => console.error('Logo fetch error:', e));
```

**Expected output:**
```
Logo element: <img src="logo.svg" ...>
Logo src: https://admin.talospro.ai/logo.svg
Logo complete: true
Logo naturalHeight: 100 (or some number > 0)
Logo fetch status: 200
Logo content-type: image/svg+xml
Logo SVG length: 3024
```

**If logo.complete = false OR naturalHeight = 0:**
- Logo failed to load
- Check Network tab for logo.svg request
- Look for CORS errors, 404, or blocked requests

---

### STEP 3: Login & Check Token
```javascript
// After logging in, check token
console.log('Admin token:', localStorage.getItem('adminToken'));
console.log('Admin user:', localStorage.getItem('adminUser'));

// Token should look like: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
// If null/undefined → login failed
```

---

### STEP 4: Test Users API Manually
**Run this in Console (AFTER login):**
```javascript
const API_BASE = 'https://talos-backend.vercel.app';
const token = localStorage.getItem('adminToken');

fetch(`${API_BASE}/api/admin/users`, {
  headers: { 'Authorization': `Bearer ${token}` }
})
  .then(async r => {
    console.log('API Status:', r.status);
    console.log('API Headers:', Object.fromEntries(r.headers));
    const data = await r.json();
    console.log('API Response:', data);
    return data;
  })
  .catch(e => console.error('API Error:', e));
```

**Expected output:**
```json
API Status: 200
API Response: {
  "users": [
    { "id": "...", "name": "...", "email": "...", ... },
    { "id": "...", "name": "...", "email": "...", ... },
    { "id": "...", "name": "...", "email": "...", ... }
  ]
}
```

**Common errors:**
- `401 Unauthorized` → Token invalid/expired (re-login needed)
- `403 Forbidden` → Token valid but not admin
- `500 Internal Server Error` → Backend issue
- `TypeError: Failed to fetch` → Network/CORS issue

---

### STEP 5: Check Automatic Debug Logs
**After deployment completes, refresh page and look for these logs:**

```
[DEBUG] Fetching users from: https://talos-backend.vercel.app/api/admin/users
[DEBUG] Token exists: true
[DEBUG] Response status: 200
[DEBUG] Users data: { users: [...] }
```

**If you see:**
```
[ERROR] API error: 401 Unauthorized
```
→ Token expired, needs re-login

```
[ERROR] API error: 500 ...
```
→ Backend issue (need to check backend logs)

```
[FATAL] Load users error: TypeError: Failed to fetch
```
→ Network/CORS issue (check Network tab)

---

## 📸 WHAT TO SEND ME

### For Logo Issue:
1. Screenshot showing "TalosPro Admin" text
2. Console output from STEP 2 commands
3. Network tab filtered for "logo" (show status codes)

### For Users Issue:
1. Screenshot of error message
2. Console output from STEP 4 commands
3. All `[DEBUG]` and `[ERROR]` logs from console
4. Network tab showing `/api/admin/users` request (status, headers, response)

---

## 🔧 QUICK FIXES

### Logo not loading?
**Try CDN directly:**
```javascript
// Change all logos to CDN
document.querySelectorAll('img[src*="logo.svg"]').forEach(img => {
  img.src = 'https://talospro.ai/logos-final/talos-crystal-gradient.svg';
});
```

### Token expired?
```javascript
// Clear and re-login
localStorage.clear();
location.href = '/';
```

### API not responding?
```javascript
// Check backend health
fetch('https://talos-backend.vercel.app/health')
  .then(r => r.json())
  .then(console.log);
```

---

## 🚀 AFTER DEPLOYMENT

**Wait for:**
1. Vercel deployment to complete (~30 seconds)
2. Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
3. Clear cache if needed: `Cmd+Shift+Delete` → Clear cached images/files

**Then run all steps above and send me:**
- Console logs (copy all text)
- Network tab screenshot
- What you're seeing vs what should appear

---

**Raven standing by** 🪶
