"use client";

import React from "react";

export default function DocumentHeader() {
  return (
    <header className="cl-letterhead">
      <div className="logo-container">
        <img
          src="/assets/byteleap/byteleap-full-color.png"
          alt="Byte Leap Logo"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/assets/personal/logo.png";
          }}
        />
      </div>
      <div className="gold-divider"></div>
    </header>
  );
}
