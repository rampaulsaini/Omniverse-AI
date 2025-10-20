#!/bin/bash
# -----------------------------
# vigilant-dashboard.sh
# -----------------------------

# 1️⃣ Backup current dashboard
BACKUP_DIR="backup_dashboard_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r earnings-dashboard.html scripts assets "$BACKUP_DIR"
echo "✅ Backup created at $BACKUP_DIR"

# 2️⃣ Verify SSH access
echo "=== SSH Verification ==="
ssh -T git@github.com || echo "❌ SSH connection failed!"

# 3️⃣ Verify GPG signing
echo "=== GPG Verification ==="
gpg --list-secret-keys --keyid-format=long
TEMP_FILE="gpg_test.txt"
echo "Vigilant Mode Test" > $TEMP_FILE
git add $TEMP_FILE
GPG_KEY_ID=$(gpg --list-secret-keys --keyid-format=long | grep sec | awk '{print $2}' | cut -d'/' -f2)
if [ -z "$GPG_KEY_ID" ]; then
    echo "❌ No GPG key found!"
else
    git commit -S -m "GPG test commit" || echo "❌ GPG commit failed."
fi
git reset HEAD $TEMP_FILE
rm -f $TEMP_FILE

# 4️⃣ Verify HTTPS / PAT
echo "=== HTTPS/PAT Verification ==="
git ls-remote https://github.com/rampaulsaini/Omniverse-AI.git || echo "❌ HTTPS/PAT not working"

# 5️⃣ Auto-restore if workflow fails
WORKFLOW_LOG=".github/workflows/earnings.yml"
if grep -q "fail" "$WORKFLOW_LOG"; then
    echo "⚠️ Workflow failure detected, restoring backup..."
    cp -r "$BACKUP_DIR"/* .
    git add .
    git commit -m "Auto-restore dashboard after workflow failure"
    git push origin main
    echo "✅ Backup restored successfully"
fi

echo "🎉 Vigilant Mode checks complete. Dashboard is protected and auto-restore enabled."
