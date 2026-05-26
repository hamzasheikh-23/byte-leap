import React, { useState } from "react";

interface SecurityOverlayProps {
  onUnlock: (passcode: string) => boolean;
}

export default function SecurityOverlay({ onUnlock }: SecurityOverlayProps) {
  const [passcodeInput, setPasscodeInput] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onUnlock(passcodeInput);
    if (!success) {
      setPasscodeError(true);
      setTimeout(() => setPasscodeError(false), 500); // Shakes card
    }
  };

  return (
    <div className="security-overlay-viewport">
      <div className={`security-glass-card ${passcodeError ? "shake" : ""}`}>
        <div className="security-shield-badge">
          <i className="fas fa-shield-halved"></i>
        </div>
        <h2>Private Access Locked</h2>
        <p>
          This is a confidential and secure contract portal for Byte Leap. Enter the private review passcode to access the agreement document.
        </p>
        <form onSubmit={handleSubmit}>
          <div style={{ position: "relative", marginBottom: "20px" }}>
            <input
              type="password"
              required
              placeholder="Enter Secure Passcode..."
              style={{
                width: "100%",
                background: "rgba(15, 10, 30, 0.6)",
                border: "1.5px solid rgba(255, 255, 255, 0.1)",
                padding: "14px 20px 14px 20px",
                borderRadius: "10px",
                color: "#ffffff",
                fontSize: "0.95rem",
                outline: "none",
                textAlign: "center",
                boxSizing: "border-box",
              }}
              value={passcodeInput}
              onChange={(e) => setPasscodeInput(e.target.value)}
            />
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              background: "linear-gradient(135deg, #edaf2e 0%, #f59e0b 100%)",
              color: "#0c081e",
              border: "none",
              padding: "14px",
              borderRadius: "10px",
              fontSize: "0.95rem",
              fontWeight: 800,
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            <i className="fas fa-key"></i> Unlock Contract
          </button>
        </form>
        {passcodeError && (
          <div style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "12px", fontWeight: "600" }}>
            <i className="fas fa-circle-exclamation"></i> Invalid Passcode. Access Denied.
          </div>
        )}
        <div style={{ marginTop: "35px", fontSize: "0.72rem", color: "rgba(255, 255, 255, 0.4)", letterSpacing: "2px", textTransform: "uppercase" }}>
          <i className="fas fa-certificate" style={{ color: "#edaf2e", marginRight: "4px" }}></i> BYTE LEAP SECURE
        </div>
      </div>
    </div>
  );
}
