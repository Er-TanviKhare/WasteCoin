import {
  addDoc,
  collection,
  doc,
  updateDoc,
  increment,
  serverTimestamp,
  getDoc,
  setDoc
} from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

export const addEarnTransaction = async ({ qrId, material, weight, coins }) => {
  const uid = auth.currentUser.uid;

  // 1️⃣ Check if QR already scanned
  const qrRef = doc(db, "users", uid, "scannedQRCodes", qrId);
  const qrSnap = await getDoc(qrRef);

  if (qrSnap.exists()) {
    throw new Error("This QR code has already been used");
  }

  // 2️⃣ Mark QR as used
  await setDoc(qrRef, {
    scannedAt: serverTimestamp()
  });

  // 3️⃣ Add transaction
  await addDoc(collection(db, "users", uid, "transactions"), {
    type: "earn",
    material,
    weight,
    coins,
    timestamp: serverTimestamp()
  });

  // 4️⃣ Update wallet
  await updateDoc(doc(db, "users", uid), {
    walletBalance: increment(coins),
    totalWasteKg: increment(weight / 1000)
  });
};
