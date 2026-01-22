import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { getUserProfile } from "../firebase/userService";

export const UserDataContext = createContext();

export function UserDataProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // ✅ ADD THIS FUNCTION
  const refreshProfile = async () => {
    if (!auth.currentUser) return;
    const data = await getUserProfile();
    setProfile(data);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await refreshProfile();
      } else {
        setProfile(null);
      }
      setLoadingProfile(false);
    });

    return unsubscribe;
  }, []);

  return (
    <UserDataContext.Provider
      value={{
        profile,
        setProfile,
        refreshProfile,   // ✅ EXPOSE IT
        loadingProfile
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
}
