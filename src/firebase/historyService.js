import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

export const getTransactionHistory = async () => {
  const uid = auth.currentUser.uid;

  const q = query(
    collection(db, "users", uid, "transactions"),
    orderBy("timestamp", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};
