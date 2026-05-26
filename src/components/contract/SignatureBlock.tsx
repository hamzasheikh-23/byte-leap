import React from "react";

interface SignatureField {
  label: string;
  value: string;
  onChange?: (val: string) => void;
  editable?: boolean;
  title?: string;
}

interface SignatureBlockProps {
  partyTitle: string;
  signatureNode: React.ReactNode;
  sigBadge?: string | null;
  onEsignClick: () => void;
  fields: SignatureField[];
  style?: React.CSSProperties;
}

export default function SignatureBlock({
  partyTitle,
  signatureNode,
  sigBadge,
  onEsignClick,
  fields,
  style,
}: SignatureBlockProps) {
  return (
    <div className="signature-block" style={style}>
      <h4>{partyTitle}</h4>
      <div className="sig-line-item" style={{ marginTop: "30px", position: "relative", alignItems: "center" }}>
        <span className="sig-label">Signature:</span>
        <div className="sig-placeholder" style={{ display: "flex", alignItems: "center" }}>
          {signatureNode}
        </div>
        <button className="esign-btn no-print" onClick={onEsignClick}>
          <i className="fas fa-file-signature"></i> eSign
        </button>
      </div>
      {sigBadge && (
        <div className="esign-badge" style={{ marginLeft: "85px", display: "flex" }}>
          <i className="fas fa-certificate"></i> {sigBadge}
        </div>
      )}
      {fields.map((f, idx) => (
        <div className="sig-line-item" key={idx} style={idx === 0 ? { marginTop: "12px" } : undefined}>
          <span className="sig-label">{f.label}:</span>
          {f.editable ? (
            <div
              className="sig-placeholder editable-field"
              contentEditable="true"
              suppressContentEditableWarning={true}
              onBlur={(e) => f.onChange?.(e.target.textContent || "")}
              title={f.title}
            >
              {f.value}
            </div>
          ) : (
            <div className="sig-placeholder">{f.value}</div>
          )}
        </div>
      ))}
    </div>
  );
}
