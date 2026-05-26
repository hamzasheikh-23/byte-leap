"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function CoverLetterInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL Params or fallback for personal branding customization
  const hiringManager = searchParams?.get("manager") || "Hiring Manager";
  const companyName = searchParams?.get("company") || "Byte Leap Collaborators";
  const jobTitle = searchParams?.get("role") || "Software Architect & Engineering Lead";

  const [dateStr, setDateStr] = useState("");
  const [profile, setProfile] = useState({
    name: "MUHAMMAD HAMZA SHEIKH",
    title: "Software Architect & Owner",
    email: "hamza@byteleap.ca",
    phone: "+92 334 3829038",
    location: "Karachi, Pakistan",
    linkedin: "linkedin.com/in/hamzasheikh",
    github: "github.com/hamzasheikh",
    years_experience: "5+",
    current_company: "Byte Leap",
    current_role: "Software Lead & Architect",
    skills: "Next.js • React • TypeScript • PostgreSQL • Supabase • REST APIs • Cloud Pipelines"
  });

  useEffect(() => {
    // Standard localized date segment matching cover-letter.html
    setDateStr(
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="contract-view-wrapper" style={{ minHeight: "100vh", paddingTop: "80px" }}>
      {/* ── Fixed Interaction Toolbar ── */}
      <div className="no-print-toolbar">
        <button onClick={() => router.push("/admin")} className="btn-toolbar btn-back-tb">
          <i className="fas fa-arrow-left-long"></i> Portal Console
        </button>

        <span className="toolbar-info-lbl">PERSONAL COVER LETTER</span>

        <button onClick={handlePrint} className="btn-toolbar btn-print-tb">
          <i className="fas fa-print"></i> Print Letter
        </button>
      </div>

      {/* Main Cover Letter Sheet */}
      <div className="resume-container" style={{ margin: "20px auto 40px auto", padding: "50px", maxWidth: "800px" }}>
        {/* Letterhead */}
        <header className="cl-letterhead" style={{ borderBottom: "2.5px solid #edaf2e", paddingBottom: "25px", textAlign: "center" }}>
          <div className="logo-container" style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
            <img src="/assets/personal/logo.png" alt="Byte Leap Signature" style={{ height: "65px", width: "auto" }} />
          </div>
          <h1 style={{ fontFamily: "var(--font-outfit)", fontWeight: 800, fontSize: "1.65rem", color: "#4b2c91", textTransform: "uppercase", letterSpacing: "1px" }}>
            Cover Letter
          </h1>
        </header>

        {/* Body Content */}
        <main className="cover-letter-body" style={{ marginTop: "40px", fontFamily: "var(--font-raleway)", color: "#1e293b", fontSize: "0.95rem", lineHeight: "1.7" }}>
          <p className="cl-date" style={{ color: "#64748b", fontWeight: 700, fontSize: "0.85rem", marginBottom: "24px" }}>
            {dateStr}
          </p>

          <p className="cl-salutation" style={{ fontWeight: 700, fontSize: "1rem", color: "#0f172a", marginBottom: "18px" }}>
            Dear {hiringManager},
          </p>

          <p style={{ marginBottom: "18px" }}>
            I am applying for the <strong style={{ color: "#4b2c91" }}>{jobTitle}</strong> role at <strong>{companyName}</strong>. 
            I bring <strong>{profile.years_experience}</strong> years of experience as a professional <strong>{profile.title}</strong>.
            Operating under my corporate entity **Byte Leap**, I deliver secure high-performance web products, database pipelines, and encrypted platform consoles.
          </p>

          <p style={{ marginBottom: "18px" }}>
            At <strong>{profile.current_company}</strong>, where I currently serve as the <strong>{profile.current_role}</strong>, 
            I drive end-to-end full-stack architectures, integrate dynamic eSign gates, and configure scalable serverless databases.
            I specialize in translating elaborate business rules into robust, high-performing code libraries.
          </p>

          <p style={{ marginBottom: "22px" }}>
            <strong>Key Skills &amp; Technologies:</strong>
          </p>
          <p className="cl-skills" style={{ background: "rgba(75, 44, 145, 0.03)", border: "1px solid rgba(75, 44, 145, 0.08)", borderRadius: "8px", padding: "12px 18px", fontSize: "0.88rem", fontWeight: 600, color: "#4b2c91", marginBottom: "24px", letterSpacing: "0.5px" }}>
            {profile.skills}
          </p>

          <p style={{ marginBottom: "35px" }}>
            I welcome the opportunity to discuss how my qualifications align with your company&apos;s upcoming software goals. Thank you for your time and consideration.
          </p>

          {/* Signoff */}
          <div className="cl-signoff" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <p style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>Best regards,</p>
            <div className="cl-sig-clip-bottom" style={{ height: "48px", overflow: "hidden", margin: "4px 0" }}>
              <img src="/assets/personal/logo.png" alt="Signature Emblem" style={{ height: "42px", width: "auto" }} />
            </div>
            <p className="sig-contact" style={{ display: "flex", gap: "8px", flexWrap: "wrap", fontSize: "0.78rem", color: "#64748b", fontWeight: 600 }}>
              <span>{profile.email}</span>
              <span>&middot;</span>
              <span>{profile.phone}</span>
              <span>&middot;</span>
              <span>{profile.linkedin}</span>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function CoverLetterViewer() {
  return (
    <Suspense fallback={<div className="security-overlay-viewport">Loading Letter...</div>}>
      <CoverLetterInner />
    </Suspense>
  );
}
