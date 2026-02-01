# TalosPro Subscription System - Status Report

## Current Implementation

### ✅ Working Features
1. **List subscriptions** - View all active subscriptions in a table
2. **Row click** - Entire row is clickable
3. **Search** - Filter subscriptions by user email/plan
4. **Icons** - View and Settings icons visible

### ❌ Missing Features (TODO)
1. **Subscription Detail Modal** - Currently shows alert "Coming soon"
2. **Change Plan** - No UI to upgrade/downgrade users
3. **Change Status** - No UI to pause/cancel/activate
4. **Billing History** - No transaction log view
5. **Payment Method** - Can't view/update payment info

---

## Auto User Creation (Telegram/WhatsApp)

### ✅ ALREADY WORKING!

When someone messages TalosPro on Telegram:
1. System checks if user exists (by telegramId)
2. If NOT exists → Creates user automatically with:
   - `tier: 'free'`
   - `dailyLimit: 50`
   - `messagesTotal: 0`
   - `messagesToday: 0`
3. User can immediately start chatting
4. First 50 messages/day are free

**Code location:** `services/user-service.js` → `getOrCreateUser()`

**Platforms supported:**
- ✅ WhatsApp (via whatsappPhone)
- ✅ Telegram (via telegramId)
- ✅ Slack (via slackId)
- ✅ Discord (via discordId)

---

## What Needs to Be Built

### 1. Subscription Detail Modal
**When clicking on a subscription row, show:**
- User info (name, email, phone)
- Current plan & status
- Start date, next billing date
- Total spent, last payment
- Message usage (today, total)
- Actions:
  - Change plan (dropdown: free/basic/pro/enterprise)
  - Change status (dropdown: active/paused/canceled)
  - View billing history
  - Cancel subscription

### 2. Backend Endpoints Needed
```
PUT /api/admin/subscriptions/:id/plan
PUT /api/admin/subscriptions/:id/status
GET /api/admin/subscriptions/:id/history
```

---

## Quick Implementation Plan

**Time estimate: 30-45 minutes**

1. Create subscription modal in subscriptions.html (15 min)
2. Add backend endpoints in admin.js (15 min)
3. Wire up change plan/status actions (10 min)
4. Test and deploy (5 min)

**Want me to build this now?**
