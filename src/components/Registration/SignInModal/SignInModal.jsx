import React from "react";
import SignIn from "../SignIn/SignIn";
import "./SignInModal.css";

const SignInModal = ({ isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="signin-modal-overlay" onClick={handleBackdropClick}>
      <div className="signin-modal-wrapper">
        <div className="signin-modal-header">
          Зареєструйтесь щоб ми могли зберігати для Вас події🎉 та нагадувати про них
        </div>
        <div className="signin-modal-content">
          <button className="signin-modal-close" onClick={onClose}>
            ×
          </button>
          <SignIn onSuccess={onSuccess} onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

export default SignInModal;