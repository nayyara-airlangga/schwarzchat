import Message from "./Message";
import chatStyles from "./chat.module.css";

const ChatFile = (props: { message: Message }) =>
  props.message.message.startsWith("http") ? (
    props.message.contentType?.startsWith("image") ? (
      <img
        className="file-img"
        src={props.message.message}
        alt="img"
        width={100}
        height={100}
      />
    ) : props.message.contentType?.startsWith("application") ||
      props.message.contentType?.startsWith("text") ? (
      <div id={chatStyles.file}>
        <img src="/document.png" alt="file-ico" />
        <a href={props.message.message}>{props.message.fileName} </a>
      </div>
    ) : // <iframe
    //   src={props.message.message}
    //   frameBorder="0"
    //   scrolling="auto"
    //   height="100%"
    //   width="100%"
    // />
    props.message.contentType?.startsWith("video") ? (
      <video width="100%" height="100%" controls>
        <source src={props.message.message} type="video/mp4" />
      </video>
    ) : (
      <a href={props.message.message}>{props.message.message}</a>
    )
  ) : (
    <span>{props.message.message}</span>
  );
export default ChatFile;
