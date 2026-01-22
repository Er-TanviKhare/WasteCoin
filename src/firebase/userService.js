import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

export const getUserProfile = async () => {
  const uid = auth.currentUser.uid;
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    throw new Error("User document not found");
  }

  return snapshot.data();
};
