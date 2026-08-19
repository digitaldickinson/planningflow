# Planning & Licensing Story Walkthrough

An interactive tool for working out whether a planning or licensing lead is a
story, routine, or needs a phone call no database can replace.

## Structure

```
index.html        page shell
css/style.css      all styling
js/data.js         the decision tree (questions, steps, verdicts)
js/app.js          rendering and interaction logic
images/            reference photos of real notices
```

## Running locally

No build step. From this folder:

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Publishing to GitHub Pages

1. Create a new repository on GitHub (public, since Pages needs a public repo
   unless you're on a paid plan) and push this folder to it:

   ```
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```

2. On GitHub, go to the repo's **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to "Deploy from a branch".
4. Set **Branch** to `main` and folder to `/ (root)`, then **Save**.
5. GitHub will publish at `https://<your-username>.github.io/<repo-name>/`
   within a minute or two.

Adding more images later: drop them in `images/`, then reference them from
`js/data.js` (either as `thumb` on a question option, or as `image: { src,
alt, caption }` on a step node).
