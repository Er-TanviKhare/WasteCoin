import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const getCoupons = async () => {
  const snapshot = await getDocs(collection(db, "coupons"));

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};
