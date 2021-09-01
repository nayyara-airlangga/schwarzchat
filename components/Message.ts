import firebase from "firebase";

export default interface Message {
  contentType: string;
  id: string;
  uid: string;
  displayName: string;
  message: string;
  photoURL: string;
  createdAt: firebase.firestore.Timestamp;
}
