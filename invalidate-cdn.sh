#!/bin/bash
# Force Vercel CDN cache invalidation
# Run after deployment to ensure immediate propagation

set -e

echo "🔄 Invalidating Vercel CDN cache..."

# Purge the deployment cache via Vercel API
if [ -n "$VERCEL_TOKEN" ]; then
  echo "✅ Using Vercel API to purge cache..."
  
  # Get deployment URL
  DEPLOYMENT_URL=$(vercel ls --scope cashlab -t "$VERCEL_TOKEN" -y | grep "app.talospro.ai" | head -1 | awk '{print $2}')
  
  if [ -n "$DEPLOYMENT_URL" ]; then
    echo "📡 Deployment URL: $DEPLOYMENT_URL"
    
    # Purge cache via API
    curl -X DELETE \
      "https://api.vercel.com/v12/purge?url=$DEPLOYMENT_URL" \
      -H "Authorization: Bearer $VERCEL_TOKEN" \
      -H "Content-Type: application/json"
    
    echo ""
    echo "✅ CDN cache purged!"
  else
    echo "⚠️  Could not find deployment URL"
  fi
else
  echo "⚠️  VERCEL_TOKEN not set - cache invalidation skipped"
  echo "   Set VERCEL_TOKEN in your environment to enable auto-purge"
fi

echo ""
echo "💡 Manual cache bypass:"
echo "   1. Open incognito window"
echo "   2. Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)"
echo "   3. Wait 2-3 minutes for global CDN propagation"
