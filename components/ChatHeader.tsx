import { MouseEventHandler } from "react";

const ChatHeader = (props: { onClick: MouseEventHandler }) => (
  <div className="header">
    <div className="logo">
      <a href="/">SC</a>
    </div>
    <button className="signout-button" onClick={props.onClick}>
      Sign Out
    </button>
  </div>
);

export default ChatHeader;
