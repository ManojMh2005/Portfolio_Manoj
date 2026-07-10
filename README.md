# Manoj M H — Portfolio (with a real backend)

A React + Vite portfolio site. The "backend" is Firebase — no server for you to
run or pay for. Firestore stores contact-form messages and a resume-download
counter; Firebase Authentication gates a private `/#admin` dashboard where you
can see both.

## Why Firebase (and not a custom Node server)

You already know Firebase deeply from Suraksha-Setu, so this reuses that
skill instead of introducing a new one. It also means:
- No server to deploy, patch, or pay to keep running
- Firestore security rules do the access control (public can write a message,
  only you — signed in — can read them)
- The whole site is still just static files, so it deploys anywhere
  (GitHub Pages, Vercel, Netlify, Firebase Hosting)

## 1. Create the Firebase project (~5 minutes)

1. Go to https://console.firebase.google.com → **Add project** → name it
   anything (e.g. `manoj-portfolio`).
2. **Build → Firestore Database → Create database** → start in
   **production mode** → pick a region close to you (e.g. `asia-south1`).
3. **Build → Authentication → Sign-in method** → enable **Email/Password**.
4. Still in Authentication → **Users** tab → **Add user** → use your own
   email and a strong password. This is the ONLY account that will ever be
   able to log into `/#admin` — there's no public sign-up.
5. Click the gear icon → **Project settings** → scroll to **Your apps** →
   click the `</>` (web) icon → register an app (nickname anything, no
   need for Firebase Hosting yet) → copy the `firebaseConfig` object shown.
6. Paste that config into `src/firebase.js`, replacing the placeholder
   `firebaseConfig` values.

## 2. Publish the security rules

In the Firebase console: **Firestore Database → Rules** → replace the
contents with everything in `firestore.rules` (in this project) → **Publish**.

This is what makes it safe to be a "real" backend:
- Anyone can submit the contact form or trigger a resume-download count
- Nobody can read messages, edit them, or delete them unless signed in
  as you

## 3. Run it locally

```bash
npm install
npm run dev
```

Open the URL it gives you. Try submitting the contact form, then go to
Firebase Console → Firestore Database → you should see a new document in
a `messages` collection appear instantly.

Visit `http://localhost:5173/#admin` and sign in with the account you
created in step 1.4 to see the dashboard.

## 4. Add your real resume

`public/resume.pdf` is already your current resume (from what you
uploaded). Replace that file any time you want to update it — the
"Resume" button on the site always points to `/resume.pdf`.

## 5. Build and deploy

```bash
npm run build
```

This outputs static files to `dist/`. Deploy that folder anywhere:

**Easiest — Firebase Hosting (same project, one command):**
```bash
npm install -g firebase-tools
firebase login
firebase init hosting   # choose "dist" as the public directory, single-page app: No
firebase deploy
```

**Or GitHub Pages** (same flow you used for the last static site):
push `dist/` to your `gh-pages` branch, or use the `gh-pages` npm package.

**Or Vercel/Netlify:** connect the repo, set build command `npm run build`,
output directory `dist`.

## Notes

- The `/#admin` route is a plain hash route (no separate backend route
  needed) — it works the same wherever you deploy the static files.
- If you ever want actual email notifications when someone submits the
  form (not just Firestore storage), the simplest add-on is a Firebase
  Cloud Function triggered on new documents in `messages`, using a
  service like Resend or SendGrid to email you. Ask if you want that
  wired up — it's a small addition on top of this.
