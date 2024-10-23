import React, { useEffect, useState } from "react";
import "./_app.scss";

interface ToastMessageProps {
  onClose: () => void;
  onRecharge: () => void;
  duration: number; // Auto-close duration in milliseconds
}

const ToastMessage: React.FC<ToastMessageProps> = ({
  onClose,
  onRecharge,
  duration,
}) => {
  const [progress, setProgress] = useState<number>(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => Math.max(prev - 1, 0));
    }, duration / 100);

    const timeout = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onClose, duration]);

  return (
    <div className="toast">
      <p>You have 10% time left before disconnection!</p>
      <div className="toast-progress">
        <div
          className="toast-progress-bar"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="toast-buttons">
        <button onClick={onClose}>Cancel</button>
        <button onClick={onRecharge}>Recharge</button>
      </div>
    </div>
  );
};

export default ToastMessage;
