const Toast = ({ message }: { message: string }) => {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed right-4 bottom-4 bg-gray-900 text-white px-4 py-2 rounded"
    >
      {message}
    </div>
  );
};

export default Toast;
