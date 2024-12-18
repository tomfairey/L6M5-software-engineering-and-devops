import { useContext, createContext, useState, type ReactNode, useEffect } from "react";
import type { User, EmptyUser } from "@/types/user";

import { clearCredentials, getSelf, login } from "@modules/api";
import { useToast } from "./Toasts";

const AuthContext = createContext<{ credentials: { email?: string, password?: string }, user: User | EmptyUser, isLoggedIn: boolean, logIn: (email: string, password: string) => Promise<void>, refreshSelf: () => Promise<void>, logOut: () => void }>({
    credentials: {},
    user: {},
    isLoggedIn: false,
    logIn: async () => { },
    refreshSelf: async () => { },
    logOut: () => { },
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const toast = useToast();

    const [credentials, setCredentials] = useState({});
    const [user, setUser] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        toast.present(isLoggedIn ? "Logged in" : "Logged out");
    }, [isLoggedIn]);

    const logIn = async (username: string, password: string) => {
        try {
            // TODO: Use credentials for token
            const { uuid, email, first_name, last_name, is_admin } = await login(username, password);
            // TODO: Store token
            setCredentials({ email, password });
            // TODO? Validate token
            setUser({ uuid, email, first_name, last_name, is_admin })
            setIsLoggedIn(true);
        } catch (e) {
            logOut();
            throw e;
        }
    }

    const refreshSelf = async () => {
        try {
            const { email, first_name, last_name, is_admin } = await getSelf();
            setUser({ email, first_name, last_name, is_admin });
            return
        } catch (e: Error | any) {
            logOut();
            toast.present(e?.message);
            throw e;
        }
    };

    const logOut = () => {
        // TODO: Wipe storage of token
        clearCredentials();
        setCredentials({});
        setUser({});
        setIsLoggedIn(false);
    };

    return <AuthContext.Provider value={{ credentials, user, isLoggedIn, logIn, refreshSelf, logOut }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};
