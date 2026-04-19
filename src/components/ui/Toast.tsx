import { useEffect } from "react";

interface ToastProps {
  message: string;
  onDismiss: () => void;
}

// Auto-dismisses after 5s
function Toast({ message, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      role="alert"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-xl shadow-lg z-50"
    >
      {message}
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        className="ml-3 opacity-70 hover:opacity-100"
      >
        ✕
      </button>
    </div>
  );
}

export default Toast;
