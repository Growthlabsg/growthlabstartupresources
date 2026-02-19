# Fix Vercel build: "Couldn't find any pages or app directory"

Vercel builds from your **GitHub repo**. The build fails because the repo doesn’t contain the `app` folder yet. Push your full app (including `app/` and `components/`) to GitHub.

## Steps (run from this project root)

```bash
# 1. Initialize git and add the remote
git init
git remote add origin https://github.com/Growthlabsg/growthlabstartupresources.git

# 2. Fetch existing repo and use it as base (keeps README, etc.)
git fetch origin
git branch -M main
git reset origin/main

# 3. Add everything (app, components, config, etc.)
git add .
git status   # confirm you see app/ and components/

# 4. Commit and push
git commit -m "Add Next.js app and components for Vercel build"
git push -u origin main
```

If you get "failed to push some refs" because the remote has different history:

```bash
git push -u origin main --force
```

## After pushing

1. On GitHub, open the repo and confirm you see the **app** and **components** folders.
2. In Vercel: Project → Settings → General → **Root Directory** should be empty (or `.`).
3. Trigger a new deploy. The build should succeed.
