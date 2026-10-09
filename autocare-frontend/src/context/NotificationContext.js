import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);

  const showNotification = ({
    title = "AutoCare",
    message = "",
    type = "success",
    duration = 3500,
  }) => {
    setNotification({
      title,
      message,
      type,
    });

    setTimeout(() => {
      setNotification(null);
    }, duration);
  };

  const hideNotification = () => {
    setNotification(null);
  };

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        hideNotification,
      }}
    >
      {children}

      {notification && (
        <div
          className={`autocare-notification ${notification.type}`}
        >
          <div className="autocare-notification-icon">
            {notification.type === "success" && (
              <i className="bi bi-check-lg"></i>
            )}

            {notification.type === "error" && (
              <i className="bi bi-x-lg"></i>
            )}

            {notification.type === "warning" && (
              <i className="bi bi-exclamation-lg"></i>
            )}

            {notification.type === "info" && (
              <i className="bi bi-info-lg"></i>
            )}
          </div>

          <div className="autocare-notification-content">
            <strong>{notification.title}</strong>
            <span>{notification.message}</span>
          </div>

          <button
            type="button"
            className="autocare-notification-close"
            onClick={hideNotification}
          >
            <i className="bi bi-x"></i>
          </button>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}