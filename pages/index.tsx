import { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import Head from "next/head";
import Image from "next/image";
import ChatRoom from "../components/ChatRoom";
import config from "../components/config";

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
            <div className="header">
              <div className="logo">
                <a href="/">SC</a>
              </div>
              <button className="signout-button" onClick={signOut}>
                Sign Out
              </button>
            </div>
            <ChatRoom user={isUser} db={db} />
          </>
        ) : (
          <section id="sign-in">
            <Image
              src="/Schwarzchat-modified.png"
              alt="logo"
              width={240}
              height={240}
            />
            <br />
            <br />
            <button onClick={signInwithGoogle}>
              Sign Up and Login with Google
            </button>
          </section>
        )}
      </div>
    </>
  );
};

export default Home;
