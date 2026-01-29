#!/bin/bash

echo "🔍 TalosPro Admin Portal - Full QA Audit"
echo "========================================="
echo ""

# Check all HTML files exist
echo "📄 Checking HTML files..."
for file in index.html welcome.html dashboard.html users.html subscriptions.html settings.html; do
  if [ -f "$file" ]; then
    echo "✓ $file exists"
  else
    echo "✗ $file MISSING"
  fi
done
echo ""

# Check for broken links
echo "🔗 Checking for broken links in HTML..."
grep -rn 'href="\(/\|\.\.\/\)' *.html | grep -v node_modules | head -20
echo ""

# Check for inconsistent button classes
echo "🎨 Checking button consistency..."
echo "Primary buttons:"
grep -o 'btn-primary' *.html | sort | uniq -c
echo "Secondary buttons:"
grep -o 'btn-secondary' *.html | sort | uniq -c
echo "Ghost buttons:"
grep -o 'btn-ghost' *.html | sort | uniq -c
echo ""

# Check for logo consistency
echo "🖼️ Checking logo usage..."
grep -n '<img[^>]*logo' *.html | head -10
echo ""

# Check for hardcoded API URLs
echo "🌐 Checking API base URLs..."
grep -n 'API_BASE' *.html
echo ""

# Check for console.log (debug code)
echo "🐛 Checking for debug code..."
grep -c 'console.log' *.html
echo ""

echo "✅ Basic audit complete. Review output above."

