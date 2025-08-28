import { auth, firestore } from "@/config/firebase";
import { AuthContextType, UserType } from "@/types";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<UserType>(null);

    const [loading, setLoading] = useState(true);

    const router = useRouter();

    const getErrorMessage = (code: string) => {
        switch (code) {
            case "auth/user-not-found": return "No user found with this email.";
            case "auth/wrong-password": return "Incorrect password.";
            case "auth/invalid-credential": return "Invalid credentials.";
            case "auth/email-already-in-use": return "Email already registered.";
            case "auth/invalid-email": return "Invalid email format.";
            case "auth/weak-password": return "Password should be at least 6 characters.";
            default: return "Something went wrong. Try again.";
        }
    };

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (firebaseUser) => {

            // console.log("Firebase User: ", firebaseUser);
            if (firebaseUser) {
                setUser({
                    uid: firebaseUser?.uid,
                    email: firebaseUser?.email,
                    name: firebaseUser?.displayName,
                });
                updateUserData(firebaseUser.uid);
                router.replace('/(tabs)');
            } else {
                // No user
                setUser(null);
                router.replace('/(auth)/welcome');
            }
            setLoading(false);
        });
        return () => unsub();
    }, [])


    const login = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return { success: true };
        }
        // catch (error: any) {
        //     let msg = error.message;
        //     return { success: false, msg }
        // }
        catch (error: any) {
            return { success: false, msg: getErrorMessage(error.code) };
        }
    };

    const register = async (email: string, password: string, name: string) => {
        try {
            let response = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(firestore, "users", response?.user?.uid), {
                name,
                email,
                uid: response?.user?.uid,
            });
            return { success: true };
        }
        // catch (error: any) {
        //     let msg = error.message;
        //     return { success: false, msg }
        // }
        catch (error: any) {
            return { success: false, msg: getErrorMessage(error.code) };
        }
    };

    const updateUserData = async (uid: string) => {
        try {
            const docRef = doc(firestore, "users", uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                const userData: UserType = {
                    uid: data?.uid,
                    email: data.email || null,
                    name: data.name || null,
                    image: data.image || null,
                };
                setUser({ ...userData });
            }
        }
        // catch (error: any) {
        //     let msg = error.message;
        //     console.log("error: ", error);

        // }
        catch (error) {
            console.log("error: ", error);
        }
    };

    const contextValue: AuthContextType = {
        user,
        setUser,
        login,
        register,
        updateUserData,
    };

    return (
        <AuthContext.Provider value={contextValue} >
            {children}
        </AuthContext.Provider>

    );

};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("UserAuth Must be wrapped inside AuthProvider");
    }
    return context;
}