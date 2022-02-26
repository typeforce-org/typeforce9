This was originally a PHP application built on top of Matt Soria's starthere boilerplate.
I did the minimum possible to rerender the site and deploy to firebase:
- Converted `index.php` into index.html
- Updated gulp for modern Node, troubleshooting `gulp build` (but not `gulp watch`)
- Add `serve` and `deploy` commands.

# Install
```bash
npm install
```

# Build & Deploy
```bash
npm run build # runs gulp process to build assets
npm run serve # serve site on localhost
npm run deploy # deploys to firebase
```