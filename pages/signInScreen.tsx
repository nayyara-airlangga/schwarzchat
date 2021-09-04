import Image from "next/image";
import { MouseEventHandler } from "react";

const SignInScreen = (props: { onClick: MouseEventHandler }) => (
  <section id="sign-in">
    <Image
      src="/Schwarzchat-modified.png"
      alt="logo"
      width={240}
      height={240}
    />
    <br />
    <br />
    <button onClick={props.onClick}>Sign Up and Login with Google</button>
  </section>
);

export default SignInScreen;
