import { useEffect, useState } from "react";
import { IoMdCheckmark } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

interface ToastProps {
  message: string;
  type?: "success" | "error";
}

const Toast = ({ message, type = "success" }: ToastProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);

      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`
        fixed right-4 bottom-4 flex items-center gap-2 px-4 py-3 rounded shadow-lg
        transition-all duration-500
        ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}
        ${
          type === "success"
            ? "bg-green-600 text-white"
            : "bg-red-600 text-white"
        }
      `}
    >
      {/* Icon */}
      {type === "success" ? (
        <IoMdCheckmark className="w-5 h-5" />
      ) : (
        <RxCross2 className="w-5 h-5" />
      )}

      {/* Message */}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

export default Toast;
