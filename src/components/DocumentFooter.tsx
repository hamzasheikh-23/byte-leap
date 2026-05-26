"use client";

import React from "react";

interface DocumentFooterProps {
  metaLineText?: string;
  email?: string;
  website?: string;
}

export default function DocumentFooter({
  metaLineText,
  email = "byteleapltd@outlook.com",
  website = "www.byteleap.io"
}: DocumentFooterProps) {
  return (
    <footer className="letterhead-footer">
      <div className="footer-divider"></div>
      {metaLineText && (
        <div className="footer-meta-line" style={{ textTransform: "uppercase" }}>
          {metaLineText}
        </div>
      )}
      <div className="footer-copyright-line">
        <span>© 2026 BYTE LEAP. ALL RIGHTS RESERVED.</span>
        <span>•</span>
        <span>SECURED VIA PECA COMPLIANCE</span>
      </div>
      <div className="footer-copyright-line">
        <a href={`mailto:${email}`}>
          <i className="fas fa-envelope" style={{ marginRight: "4px" }}></i> {email}
        </a>
        <a href={`https://${website}`} target="_blank" rel="noopener noreferrer">
          <i className="fas fa-globe" style={{ marginRight: "4px" }}></i> {website}
        </a>
      </div>
      <span>•</span>

    </footer>
  );
}
