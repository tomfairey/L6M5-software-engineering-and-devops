import { useContext, createContext, type ReactNode } from "react";
import { useIonToast } from "@ionic/react";

import './Toasts.scss';

const ToastContext = createContext<{ present: (message: string) => void }>({
    present: () => { },
});

const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [present] = useIonToast();

    const presentToast = (message: string) => {
        console.warn(message);
        present({
            message: message,
            duration: 1500,
            position: 'bottom',
        });
    };

    return <ToastContext.Provider value={{ present: presentToast }}>{children}</ToastContext.Provider>;
};

export default ToastProvider;

export const useToast = () => {
    return useContext(ToastContext);
};
