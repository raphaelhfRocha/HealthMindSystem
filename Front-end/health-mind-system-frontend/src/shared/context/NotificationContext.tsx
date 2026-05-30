import {
    createContext,
    ReactNode,
    useContext,
    useState
} from 'react';

type NotificationType =
    | 'success'
    | 'error'
    | 'warning'
    | 'info';

interface Notification {
    message: string;
    type: NotificationType;
}

interface NotificationContextData {
    notification: Notification | null;

    showNotification: (
        message: string,
        type: NotificationType
    ) => void;

    clearNotification: () => void;
}

interface ProviderProps {
    children: ReactNode;
}

const NotificationContext =
    createContext<NotificationContextData>(
        {} as NotificationContextData
    );

export function NotificationProvider({
    children
}: ProviderProps) {
    const [notification, setNotification] =
        useState<Notification | null>(null);

    function showNotification(
        message: string,
        type: NotificationType
    ) {
        setNotification({
            message,
            type
        });

        setTimeout(() => {
            setNotification(null);
        }, 3000);
    }

    function clearNotification() {
        setNotification(null);
    }

    return (
        <NotificationContext.Provider
            value={{
                notification,
                showNotification,
                clearNotification
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    return useContext(NotificationContext);
}