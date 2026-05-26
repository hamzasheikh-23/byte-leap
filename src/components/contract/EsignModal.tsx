import React, { useState, useEffect, useRef } from "react";

interface EsignModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetField: string;
  defaultName: string;
  clientPublicIP: string;
  onApply: (
    renderedSig: React.ReactNode,
    badgeText: string | null,
    sigData?: { sigType: "draw" | "type"; sigValue: string; fontPreset: string }
  ) => void;
}

export default function EsignModal({
  isOpen,
  onClose,
  targetField,
  defaultName,
  clientPublicIP,
  onApply,
}: EsignModalProps) {
  const [esignActiveTab, setEsignActiveTab] = useState<"draw" | "type">("draw");
  const [esignTypeName, setEsignTypeName] = useState("");
  const [selectedFont, setSelectedFont] = useState("Dancing Script");
  const [canvasHasContent, setCanvasHasContent] = useState(false);

  // Canvas drawing refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);

  useEffect(() => {
    if (isOpen) {
      setEsignTypeName(defaultName);
      setEsignActiveTab("draw");
      setCanvasHasContent(false);
      // Wait for DOM to render canvas before resizing
      setTimeout(() => {
        resizeCanvas();
      }, 100);
    }
  }, [isOpen, defaultName]);

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.parentElement?.getBoundingClientRect();
    canvas.width = rect?.width || 472;
    canvas.height = rect?.height || 165;

    ctx.strokeStyle = "#4b2c91";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    isDrawingRef.current = true;
    const rect = canvas.getBoundingClientRect();
    let x = 0, y = 0;
    if ("touches" in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    lastX.current = x;
    lastY.current = y;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x = 0, y = 0;
    if ("touches" in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    lastX.current = x;
    lastY.current = y;
    setCanvasHasContent(true);
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasHasContent(false);
  };

  const handleApply = () => {
    const today = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    let renderedSig: React.ReactNode = null;
    let badgeText: string | null = null;

    if (esignActiveTab === "draw") {
      if (!canvasHasContent) {
        alert("Please draw your signature inside the box before applying.");
        return;
      }
      const dataUrl = canvasRef.current?.toDataURL() || "";
      renderedSig = <img src={dataUrl} className="drawn-sig-img" alt="Digital Signature" />;
    } else {
      const name = esignTypeName.trim() || "John Doe";
      const isInitials = targetField.toLowerCase().includes("initials");
      const fontSize = isInitials ? "1.25rem" : "1.75rem";
      renderedSig = (
        <span
          className="typed-sig"
          style={{
            fontFamily: `'${selectedFont}', cursive`,
            fontSize,
            color: "#4b2c91",
            fontWeight: 600,
            lineHeight: 1,
          }}
        >
          {name}
        </span>
      );
    }

    if (targetField === "providerSig" || targetField === "clientSig") {
      const randId = `BL-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      badgeText = `Digitally Verified • ID: ${randId} • IP ${clientPublicIP} • ${today}`;
    }

    onApply(renderedSig, badgeText, {
      sigType: esignActiveTab,
      sigValue: esignActiveTab === "draw" ? (canvasRef.current?.toDataURL() || "") : esignTypeName,
      fontPreset: selectedFont
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="esign-modal-backdrop" onClick={onClose}>
      <div className="esign-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="esign-modal-header">
          <h3>
            <i className="fas fa-file-signature"></i> Branded eSign Panel
          </h3>
          <button className="esign-modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            borderBottom: "1.5px solid var(--border-color)",
            marginBottom: "20px",
          }}
        >
          <button
            className={`esign-tab-btn ${esignActiveTab === "draw" ? "active" : ""}`}
            style={{
              background: "none",
              border: "none",
              borderBottom: esignActiveTab === "draw" ? "3px solid var(--primary)" : "3px solid transparent",
              padding: "10px 16px",
              fontWeight: 700,
              color: esignActiveTab === "draw" ? "var(--primary)" : "var(--text-muted)",
              cursor: "pointer",
            }}
            onClick={() => setEsignActiveTab("draw")}
          >
            <i className="fas fa-paint-brush"></i> Draw Signature
          </button>
          <button
            className={`esign-tab-btn ${esignActiveTab === "type" ? "active" : ""}`}
            style={{
              background: "none",
              border: "none",
              borderBottom: esignActiveTab === "type" ? "3px solid var(--primary)" : "3px solid transparent",
              padding: "10px 16px",
              fontWeight: 700,
              color: esignActiveTab === "type" ? "var(--primary)" : "var(--text-muted)",
              cursor: "pointer",
            }}
            onClick={() => setEsignActiveTab("type")}
          >
            <i className="fas fa-keyboard"></i> Type Signature
          </button>
        </div>

        {esignActiveTab === "draw" ? (
          <div className="esign-tab-content">
            <p className="esign-instruction" style={{ fontSize: "0.88rem", color: "#64748b", marginBottom: "12px" }}>
              Draw your signature inside the box using your mouse, trackpad, or touchscreen:
            </p>
            <div className="sig-canvas-container">
              <canvas
                id="sigCanvas"
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              ></canvas>
            </div>
            <div style={{ textAlign: "right", marginTop: "10px" }}>
              <button className="esign-secondary-btn" onClick={clearCanvas}>
                <i className="fas fa-eraser"></i> Clear Drawing
              </button>
            </div>
          </div>
        ) : (
          <div className="esign-tab-content">
            <p className="esign-instruction" style={{ fontSize: "0.88rem", color: "#64748b", marginBottom: "12px" }}>
              Type your name to instantly generate a legally styled cursive signature:
            </p>
            <input
              type="text"
              className="esign-type-input"
              placeholder="Type your full name..."
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1.5px solid var(--border-color)",
                borderRadius: "8px",
                fontSize: "1rem",
                outline: "none",
                boxSizing: "border-box",
              }}
              value={esignTypeName}
              onChange={(e) => setEsignTypeName(e.target.value)}
            />

            <div className="esign-font-selector" style={{ marginTop: "16px" }}>
              <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--primary)" }}>
                Choose Signature Font Preset:
              </label>
              <div
                className="font-options-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
                  gap: "8px",
                  marginTop: "8px",
                }}
              >
                {[
                  { name: "Dancing Script", label: "Modern" },
                  { name: "Alex Brush", label: "Elegant" },
                  { name: "Reenie Beanie", label: "Casual" },
                  { name: "Great Vibes", label: "Classic" },
                  { name: "Pacifico", label: "Bold" },
                  { name: "Sacramento", label: "Sophisticated" },
                  { name: "Allura", label: "Graceful" },
                  { name: "Monsieur La Doulaise", label: "Ornate" },
                ].map((font) => (
                  <label
                    key={font.name}
                    className={`font-option-card ${selectedFont === font.name ? "active" : ""}`}
                    style={{
                      border: "1.5px solid var(--border-color)",
                      borderRadius: "10px",
                      padding: "12px",
                      textAlign: "center",
                      cursor: "pointer",
                      background: selectedFont === font.name ? "var(--primary-light)" : "#fafbfc",
                      borderColor: selectedFont === font.name ? "var(--primary)" : "var(--border-color)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      userSelect: "none",
                    }}
                    onClick={() => setSelectedFont(font.name)}
                  >
                    <span style={{ fontFamily: `'${font.name}', cursive`, fontSize: "1.15rem", fontWeight: 600 }}>
                      {font.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div
              className="sig-preview-container"
              style={{
                background: "#fafbfc",
                border: "1.5px solid var(--border-color)",
                borderRadius: "12px",
                padding: "20px",
                textAlign: "center",
                marginTop: "15px",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ fontFamily: `'${selectedFont}', cursive`, fontSize: "2rem", color: "#4b2c91" }}>
                {esignTypeName || "John Doe"}
              </div>
            </div>
          </div>
        )}

        <div
          className="esign-modal-footer"
          style={{ marginTop: "25px", display: "flex", gap: "12px", justifyContent: "flex-end" }}
        >
          <button className="esign-secondary-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="esign-primary-btn" onClick={handleApply}>
            <i className="fas fa-check"></i> Apply Signature
          </button>
        </div>
      </div>
    </div>
  );
}
