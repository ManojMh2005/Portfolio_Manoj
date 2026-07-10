// ---------------------------------------------------------------
// Firebase is the "backend" for this portfolio:
//   - Firestore stores contact messages + a resume-download counter
//   - Firebase Auth (email/password) gates the /#admin dashboard
//
// SETUP (one-time):
//   1. Go to https://console.firebase.google.com -> Create project
//   2. Build > Firestore Database -> Create database (production mode)
//   3. Build > Authentication -> Sign-in method -> enable Email/Password
//      -> Users tab -> Add user (this is YOUR admin login, e.g. your email + a password)
//   4. Project settings (gear icon) > General > "Your apps" > Add app > Web
//      -> copy the firebaseConfig object it gives you and paste it below
//   5. Publish the security rules in firestore.rules (see that file's comments)
// ---------------------------------------------------------------

import { initializeApp } from "firebase/app";
import {
  getFirestore, collection, addDoc, serverTimestamp,
  query, orderBy, onSnapshot, doc, setDoc, increment, onSnapshot as onSnap,
} from "firebase/firestore";
import {
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged,
} from "firebase/auth";
import emailjs from "@emailjs/browser";

// TODO: replace with your own Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyA7RGvLloHcQYbeSeoKbsBTvAxq5X1iFnA",
  authDomain: "manoj-portfolio-96513.firebaseapp.com",
  projectId: "manoj-portfolio-96513",
  storageBucket: "manoj-portfolio-96513.firebasestorage.app",
  messagingSenderId: "351150460733",
  appId: "1:351150460733:web:54685f0567b3259e1bff54",
  measurementId: "G-MR586BGD74"
};

// TODO: replace with your own EmailJS values (see README "Email notifications" section)
const EMAILJS_SERVICE_ID = "service_u8gm78n";
const EMAILJS_TEMPLATE_ID = "template_qfxbrxs";
const EMAILJS_AUTOREPLY_TEMPLATE_ID = "template_qtha0pq";
const EMAILJS_PUBLIC_KEY = "_h-bCYyUkZHu4Nl42";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

/** Save a contact form submission to Firestore ("messages" collection). */
export async function submitContactMessage({ name, email, message }) {
  await addDoc(collection(db, "messages"), {
    name,
    email,
    message,
    createdAt: serverTimestamp(),
  });
}

/**
 * Send yourself a real email via EmailJS when someone submits the form.
 * Best-effort: if EmailJS isn't configured yet, or the request fails,
 * this throws — callers should catch it separately from the Firestore
 * write so a failed email never blocks the message from being saved.
 */
export async function sendContactEmail({ name, email, message }) {
  if (EMAILJS_SERVICE_ID === "YOUR_SERVICE_ID") {
    throw new Error("EmailJS not configured yet — see README.");
  }
  await emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    { from_name: name, from_email: email, message },
    { publicKey: EMAILJS_PUBLIC_KEY }
  );
}

/**
 * Send an automatic "thanks, I got your message" reply back to the client.
 * Uses a separate EmailJS template whose "To Email" field is set to
 * {{to_email}} so it goes to the client, not to you. Best-effort, same
 * pattern as sendContactEmail — never blocks the "message sent" confirmation.
 */
export async function sendAutoReply({ name, email, message }) {
  if (EMAILJS_SERVICE_ID === "YOUR_SERVICE_ID") {
    throw new Error("EmailJS not configured yet — see README.");
  }
  await emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_AUTOREPLY_TEMPLATE_ID,
    { to_name: name, to_email: email, client_message: message },
    { publicKey: EMAILJS_PUBLIC_KEY }
  );
}

/** Increment the resume download counter (stats/resume doc, field: count). */
export async function logResumeDownload() {
  const ref = doc(db, "stats", "resume");
  await setDoc(ref, { count: increment(1), lastDownload: serverTimestamp() }, { merge: true });
}

/** Live-subscribe to all contact messages, newest first. Admin-only (see rules). */
export function subscribeToMessages(callback) {
  const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

/** Live-subscribe to the resume download counter. Admin-only (see rules). */
export function subscribeToResumeStats(callback) {
  const ref = doc(db, "stats", "resume");
  return onSnap(ref, (snap) => {
    callback(snap.exists() ? snap.data().count || 0 : 0);
  });
}

export function adminLogin(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function adminLogout() {
  return signOut(auth);
}

export function watchAuth(callback) {
  return onAuthStateChanged(auth, callback);
}
