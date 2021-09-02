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
import Message from "./Message";
import jQuery from "jquery";
import ChatForm from "./ChatForm";

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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // Sends the sent message to the firestore message database of the app

    // Checks if the message length is empty
    if (newMessage.length !== 0)
      await db.collection("messages").add(
        Object({
          contentType: "",
          message: newMessage,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          uid,
          displayName,
          photoURL,
        })
      );
    else {
      /* If the message type is a file, we set a timestamp and a reference
         to the app's storage */

      let timestamp = Number(new Date());
      let storageRef: firebase.storage.Reference = firebase
        .storage()
        .ref(timestamp.toString());

      // I use jQuery to make it easier to access the DOM elements and file

      let $ = jQuery;
      let file_data: any = $("#file-input").prop("files")[0];

      // Push data to firebase storage\

      await storageRef.put(file_data);

      // Get the reference ad the url of the file we uploaded earlier

      firebase
        .storage()
        .refFromURL(`gs://schwarzchat-c3aef.appspot.com/${storageRef.name}`)
        .getDownloadURL()
        .then((url: string) => {

          // Get metadata of the file to check its type

          const urlData = firebase
            .storage()
            .refFromURL(`gs://schwarzchat-c3aef.appspot.com/${storageRef.name}`)
            .getMetadata()
            .then((urlData: any) => {

              /* Send the file we uploaded to the storage back and push it in 
                 to the messages database as a message*/

              db.collection("messages").add(
                Object({
                  contentType: urlData.contentType,
                  message: url,
                  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                  uid,
                  displayName,
                  photoURL,
                })
              );
            });
        });
    }

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
        {messages.map((message: Message) => (
          // Renders a chat for every chat in the messages database

          <>
            <Chat key={message.id} message={message} userId={uid} />
            <br />
            <br />
          </>
        ))}
      </ul>
      <ChatForm
        stateFunc={setNewMessage}
        onSubmit={handleSubmit}
        inputMessage={newMessage}
      />

      <section ref={scrollSpace}></section>
    </main>
  );
};

export default ChatRoom;
