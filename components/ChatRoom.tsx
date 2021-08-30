import {
  FormEvent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import firebase from "firebase";
import "firebase/firestore";
import Chat from "./Chat";

const ChatRoom = (props: {
  db: firebase.firestore.Firestore;
  user: firebase.User;
}) => {
  const db = props.db;
  const { uid, displayName, photoURL } = props.user;

  /* In order to automatically scroll back after a message is sent,
     the useRef hook is used to reference the DOM element where
     the sent message is near */

  const scrollSpace: MutableRefObject<any> = useRef();

  // To control the state of a message, the useState hook is used

  const [newMessage, setNewMessage] = useState("");

  // The submit handler that will be triggered when the user sends a message

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    // Sends the sent message to the firestore message database of the app

    db.collection("messages").add({
      message: newMessage,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      displayName,
      photoURL,
    });

    // Deletes/empty out the input value after the message is sent

    setNewMessage("");

    // Auto scroll into view when a message is sent

    scrollSpace.current.scrollIntoView({ behavior: "smooth" });
  };

  // useState is used to manage the state of the messages

  const [messages, setMessages] = useState([]);

  /* The code inside of the useEffect hook will collect all the messages
     from the database, sorts it by the newest date/time created, limits
     it to 100 messages, and then display it */

  useEffect(() => {
    db.collection("messages")
      .orderBy("createdAt")
      .limit(100)
      .onSnapshot((querySnapShot: any) => {
        /* Fetches all the messages from the database with its id and stores
           it in the variable data */

        const data = querySnapShot.docs.map((doc: any) => ({
          ...doc.data(),
          id: doc.id,
        }));

        // Updates the state of the messages according to the fetched data

        setMessages(data);
      });
  }, [db]);

  return (
    <main id="chat-room">
      <ul>
        {messages.map((message: any) => (
          // Renders a chat for every chat in the messages database

          <>
            <Chat key={message.id} message={message} userId={uid} />
            <br />
            <br />
          </>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={(event) => setNewMessage(event.target.value)}
          placeholder="Type your message"
        />
        <button type="submit" disabled={!newMessage}>
          Send
        </button>
      </form>
      <section ref={scrollSpace}></section>
    </main>
  );
};

export default ChatRoom;
