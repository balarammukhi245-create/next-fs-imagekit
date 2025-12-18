"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationContextType {
  showNotification: (message: string, type: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
    id: number;
  } | null>(null);

  const showNotification = (message: string, type: NotificationType) => {
    const id = Date.now();
    setNotification({ message, type, id });
    setTimeout(() => {
      setNotification((current) => (current?.id === id ? null : current));
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <div className="fixed bottom-5 right-5 z-100 flex flex-col gap-2">
          <div
            className={`px-4 py-3 rounded-lg shadow text-white ${getAlertClass(
              notification.type
            )}`}
          >
            {notification.message}
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

function getAlertClass(type: NotificationType): string {
  switch (type) {
    case "success":
      return "bg-green-600";
    case "error":
      return "bg-red-600";
    case "warning":
      return "bg-yellow-500";
    case "info":
      return "bg-blue-600";
    default:
      return "bg-blue-600";
  }
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
}
