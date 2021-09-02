import { formatRelative } from "date-fns";
import chatStyles from "./chat.module.css";
import Message from "./Message";
import ChatFile from "./ChatFile";

// Chat component

const Chat = (props: { message: Message; userId: string }) => (
  <li
    key={props.message.id}
    className={props.message.uid === props.userId ? "sent" : "received"}
  >
    {/* Display user image */}
    <div className="image">
      {props.message.photoURL ? (
        <>
          <img
            src={props.message.photoURL}
            alt="user-img"
            height={45}
            width={45}
          />
          <br />
          <br />
        </>
      ) : null}
    </div>

    {/* Display message text */}
    <div className="content">
      {props.message.displayName ? (
        <span className="displayName">{props.message.displayName}</span>
      ) : null}

      <br />
      {/* Display user name */}

      <section className={chatStyles.message}>
        {/* File type filtering */}
        <ChatFile message={props.message}/>
        
      </section>
      <br />

      {/* Display the time when the messages was sent */}

      {props.message.createdAt?.seconds ? (
        <span className="date-time">
          {formatRelative(
            new Date(props.message.createdAt.seconds * 1000),
            new Date()
          )}
        </span>
      ) : null}
    </div>
  </li>
);
export default Chat;
