./lib/firebase.ts:4:1
Module not found: Can't resolve '../firebase-applet-config.json'
  2 | import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
  3 | import { getFirestore } from 'firebase/firestore';
> 4 | import firebaseConfig from '../firebase-applet-config.json';
    | ^
  5 |
  6 | const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  7 | export const auth = getAuth(app);

https://nextjs.org/docs/messages/module-not-found

Import trace for requested module:
./app/layout.tsx
