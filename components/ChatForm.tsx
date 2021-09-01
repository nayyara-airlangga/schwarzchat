import { FormEventHandler } from "react";

const ChatForm = (props: {
  stateFunc: Function;
  onSubmit: FormEventHandler;
  inputMessage: string;
}) => (
  <form onSubmit={props.onSubmit}>
    <input onChange={props.onSubmit} type="file" id="file-input" name="file" />
    <input
      className="text-input"
      type="text"
      value={props.inputMessage}
      onChange={(event) => props.stateFunc(event.target.value)}
      placeholder="Type your message"
    />
    <button type="submit">Send</button>
  </form>
);

export default ChatForm;
