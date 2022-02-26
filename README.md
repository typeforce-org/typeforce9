# Typeforce 9 Microsite
This was originally a PHP application built on top of Matt Soria's starthere boilerplate.
I did the minimum possible to rerender the site and deploy to firebase:
- Converted `index.php` into index.html
- Add `serve` and `deploy` commands.
Note: `gulp` is not working.

# Install
```bash
npm install
```

# Build & Deploy
```bash
npm run serve # serve site on localhost for sanity check
npm run deploy # deploys to firebase
```