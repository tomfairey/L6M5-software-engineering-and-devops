import { useContext, createContext, useState, type ReactNode } from "react";
const AuthContext = createContext({
    user: {},
    isLoggedIn: false,
    logIn: (/*data*/) => { },
    logOut: () => { },
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const logIn = (/*data*/) => {
        // TODO: Use credentials for token
        // TODO: Store token
        // TODO? Validate token
        setUser({ first_name: "First", last_name: "Last" })
        setIsLoggedIn(true);
    }

    const logOut = () => {
        // TODO: Wipe storage of token
        setUser({});
        setIsLoggedIn(false);
    };

    return <AuthContext.Provider value={{ user, isLoggedIn, logIn, logOut }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};
