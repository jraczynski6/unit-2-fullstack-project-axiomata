import React from "react";
import "./Toast.css";

export default function Toast({ message, type = "info", onClose }) {
  return (
    <div className={`toast toast-${type}`}>
      <span>{message}</span>
      {onClose && (
        <button className="toast-close" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
}