//https://firebase.google.com/docs/auth/web/google-signin?hl=en&authuser=0#web-version-9_1

import {
  GoogleAuthProvider,
  getAuth,
  signInWithRedirect,
  signOut as signOutAlias,
} from "firebase/auth";
import { app } from "./index";

const provider = new GoogleAuthProvider();

const auth = getAuth(app);
auth.useDeviceLanguage();

const signIn = () => {
  signInWithRedirect(auth, provider);
};

const signOut = () => {
  return signOutAlias(auth);
  //   .then(() => {
  //     // Sign-out successful.
  //   })
  //   .catch((error) => {
  //     // An error happened.
  //   });
};

export { auth, signIn, signOut };
