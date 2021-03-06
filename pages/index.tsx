import { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import Head from "next/head";
import ChatHeader from "../components/ChatHeader";
import ChatRoom from "../components/ChatRoom";
import SignInScreen from "./signInScreen";
import config from "../config";

// Firebase app configurations

const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
  measurementId: config.measurementId,
};

// Checks if app is already initialized

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

// Get Auth and Firestore instance

const auth = firebase.auth();
const db = firebase.firestore();

const Home = () => {
  /* To check if a User is logged in or not, use the useState hook and
     the onAuthStateChanged method from Firebase */

  const [isUser, setUser] = useState(() => auth.currentUser);

  /* useEffect will auto-check the state of the isUser 
     and update the state accordingly */

  useEffect(() => {
    auth.onAuthStateChanged((isUser: any) => {
      if (isUser) setUser(isUser);
      else setUser(null);
    });
  }, []);

  const signInwithGoogle = async () => {
    // Declare a google auth provider and use the device's language

    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    auth.useDeviceLanguage();

    await auth.signInWithPopup(googleAuthProvider);
  };

  const signOut = async () => {
    await firebase.auth().signOut();
  };

  return (
    // This is the main tree of the app

    <>
      <Head>
        <link
          rel="shortcut icon"
          href="Schwarzchat-modified.png"
          type="image/x-icon"
        />

        <title>SchwarzChat</title>
      </Head>
      <div className="container">
        {/* Checks if user is logged in or not */}

        {isUser ? (
          <>
            <ChatHeader onClick={signOut} />
            <ChatRoom user={isUser} db={db} />
          </>
        ) : (
          <SignInScreen onClick={signInwithGoogle} />
        )}
      </div>
    </>
  );
};

export default Home;
