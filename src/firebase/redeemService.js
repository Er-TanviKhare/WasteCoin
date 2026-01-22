import {
  doc,
  getDoc,
  updateDoc,
  increment,
  addDoc,
  collection,
  serverTimestamp
} from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

export const redeemCoupon = async (coupon) => {
  const uid = auth.currentUser.uid;
  const userRef = doc(db, "users", uid);

  // 1️⃣ Fetch user wallet
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    throw new Error("User not found");
  }

  const { walletBalance } = userSnap.data();

  // 2️⃣ Balance check
  if (walletBalance < coupon.requiredCoins) {
    throw new Error("Insufficient balance");
  }

  // 3️⃣ Deduct coins
  await updateDoc(userRef, {
    walletBalance: increment(-coupon.requiredCoins)
  });

  // 4️⃣ Log transaction
  await addDoc(collection(db, "users", uid, "transactions"), {
    type: "redeem",
    brand: coupon.brandId,
    title: coupon.title,
    coins: coupon.requiredCoins,
    timestamp: serverTimestamp()
  });

  return true;
};
