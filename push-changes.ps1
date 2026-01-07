cd c:\MUMBSO

# Configure git user
git config user.email "developer@mumbso.org"
git config user.name "MUMBSO Developer"

# Add all changes
git add -A

# Commit changes
git commit -m "Update MUMBSO website with enhanced features and design improvements

- Replace Heart icons with Stethoscope medical icons for medical branding
- Update full organization name to Maseno University Medical Biotechnology Students Organization
- Complete color system overhaul for perfect dark and light mode support
- Improve contrast ratios and text visibility across all pages
- Enhanced Support Us section with donation tiers system
- Add Support Us call-to-action to homepage
- Update navigation labels and footer links
- Remove lovable-tagger dependency"

# Push to GitHub
git push origin main

Write-Host "Changes pushed to GitHub successfully!"
