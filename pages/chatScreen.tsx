import { MouseEventHandler } from "react";
import firebase from "firebase";
import ChatHeader from "../components/ChatHeader";
import ChatRoom from "../components/ChatRoom";

const ChatScreen = (props: {
  onClick: MouseEventHandler;
  user: firebase.User;
  db: firebase.firestore.Firestore;
}) => (
  <>
    <ChatHeader onClick={props.onClick} />
    <ChatRoom user={props.user} db={props.db} />
  </>
);

export default ChatScreen;
