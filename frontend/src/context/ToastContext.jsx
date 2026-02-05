import { createContext, useContext, useState, useCallback } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

const ToastContext = createContext();

// Custom hook to use toast notifications everywhere easily in the app
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // yahan showToast function to add a new toast
  const showToast = useCallback((message, type = "success") => {
    const id = Date.now();
    const newToast = { id, message, type };
    setToasts((prev) => [...prev, newToast]);

    // 3 sec baad toast ko automatically remove karna
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  // khud se toast ko remove karne ka function
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Toast ke type ke hisab se configuration set karna
  const getToastConfig = (type) => {
    switch (type) {
      case "success":
        return {
          bg: "success",
          icon: "bi-check-circle-fill",
          title: "Success",
        };
      case "error":
        return { bg: "danger", icon: "bi-x-circle-fill", title: "Error" };
      case "warning":
        return {
          bg: "warning",
          icon: "bi-exclamation-triangle-fill",
          title: "Warning",
        };
      case "info":
        return { bg: "info", icon: "bi-info-circle-fill", title: "Info" };
      default:
        return { bg: "secondary", icon: "bi-bell-fill", title: "Notification" };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* toast container ko fixed position par top right mein rakhna */}
      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ zIndex: 9999 }}
      >
        {toasts.map((toast) => {
          const config = getToastConfig(toast.type);
          return (
            <Toast
              key={toast.id}
              onClose={() => removeToast(toast.id)}
              bg={config.bg}
              className="text-white"
              animation={true}
            >
              <Toast.Header
                closeButton
                className={`bg-${config.bg} text-white`}
              >
                <i className={`bi ${config.icon} me-2`}></i>
                <strong className="me-auto">{config.title}</strong>
                <small>Just now</small>
              </Toast.Header>
              <Toast.Body>{toast.message}</Toast.Body>
            </Toast>
          );
        })}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

export default ToastContext;
