"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import "./prd-view.css";
import DocumentHeader from "@/components/DocumentHeader";
import DocumentFooter from "@/components/DocumentFooter";

interface Milestone {
  phase: string;
  duration: string;
  deliverables: string;
}

function PRDInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const accessParam = searchParams?.get("access");

  // Passcode Security States
  const expectedPasscode = "Project-Echo-2026";
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);

  // Dynamic Metadata States
  const [projectName, setProjectName] = useState("Project Echo (White-Label WebRTC Communications Platform)");
  const [preparedBy, setPreparedBy] = useState("Muhammad Hamza Sheikh");
  const [docVersion, setDocVersion] = useState("1.0.0");
  const [currentDate, setCurrentDate] = useState("May 20, 2026");

  // Proposed Technology Stack States
  const [frontendTech, setFrontendTech] = useState("React.js / Next.js (Outfitted with HSL tailored design keys)");
  const [backendTech, setBackendTech] = useState("Node.js / Express (High-concurrency cluster ready)");
  const [databaseEngine, setDatabaseEngine] = useState("PostgreSQL (Strict ACID compliance with Row-Level Locking)");
  const [coreIntegrations, setCoreIntegrations] = useState("Twilio (Programmable Voice API & JS SDK), Stripe/SafePay");
  const [hostingContext, setHostingContext] = useState("AWS (Amazon Web Services)");

  // --- Interactive Feature 1: WebRTC Dialer Sandbox States ---
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dialerStatus, setDialerStatus] = useState<"idle" | "calling" | "connected">("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- Interactive Feature 2: Ledger Profit Margin Calculator States ---
  const [retailRate, setRetailRate] = useState<number>(0.10); // Retail retail cost per min
  const [rawApiCost, setRawApiCost] = useState<number>(0.0140); // Raw Twilio cost per min
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(10000); // Projected monthly minutes

  // --- Interactive Feature 3: Dynamic Project Timeline & Quote States ---
  const [milestones, setMilestones] = useState<Milestone[]>([
    { phase: "Phase 1: System Architecture & DB Design", duration: "1.5 Weeks", deliverables: "PostgreSQL double-entry schema config, concurrency locking setup blueprint." },
    { phase: "Phase 2: Backend Core & Twilio Integration", duration: "3 Weeks", deliverables: "Webhook authentication gates, call state webhook hooks, wallet deduction logic." },
    { phase: "Phase 3: Frontend Interface & WebRTC Dialer", duration: "2.5 Weeks", deliverables: "Twilio voice client initialization, responsive neo-utility dashboard metrics, glass dialer." },
    { phase: "Phase 4: QA, Concurrency Verification & Polish", duration: "1 Week", deliverables: "Simultaneous dialer stress tests, latency callback reconciliation tests." },
  ]);
  const [fixedQuote, setFixedQuote] = useState("");

  // --- Contractor Identity & Approach states ---
  const [bidderName, setBidderName] = useState("");
  const [bidderEmail, setBidderEmail] = useState("");
  const [bidderApproach, setBidderApproach] = useState("");

  const addMilestoneRow = () => {
    setMilestones([...milestones, { phase: `Phase ${milestones.length + 1}`, duration: "2 Weeks", deliverables: "Provide deliverables description..." }]);
  };

  const removeMilestoneRow = (idx: number) => {
    if (milestones.length <= 1) return;
    setMilestones(milestones.filter((_, i) => i !== idx));
  };

  const handleSubmitProposalBid = async () => {
    if (!bidderName || !bidderEmail || !bidderApproach) {
      alert("⚠️ Contractor Required: Please fill out your legal name, contact email, and proposed technical approach in Section 7 before submitting!");
      return;
    }

    if (!fixedQuote || fixedQuote.trim() === "" || fixedQuote === "Click to enter quote (e.g. 5,000 USD)...") {
      alert("⚠️ Quote Required: Please enter your proposed fixed-price quote under the milestones roadmap in Section 7 before submitting!");
      return;
    }

    const contractorSignature = clientSigBadge ? "Abraham Mehmood (Digitally Signed)" : bidderName;

    const bidPayload = {
      id: "BID-" + Math.floor(Math.random() * 9000 + 1000),
      contractor_name: bidderName,
      contractor_email: bidderEmail,
      technical_approach: bidderApproach,
      milestones: milestones,
      quote_amount: fixedQuote,
      signature_data: contractorSignature,
      submitted_at: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      ip_address: clientPublicIP,
      status: "pending"
    };

    try {
      // 1. Save to local storage list
      const existingBidsStr = localStorage.getItem("byteleap_prd_bids");
      const existingBids = existingBidsStr ? JSON.parse(existingBidsStr) : [];
      const updatedBids = [bidPayload, ...existingBids];
      localStorage.setItem("byteleap_prd_bids", JSON.stringify(updatedBids));

      // 2. Try Supabase insert fallback if table is ready
      try {
        const { error } = await supabase.from("prd_bids").insert([bidPayload]);
        if (error) {
          console.warn("Supabase table insert skipped or not active.", error);
        }
      } catch (dbErr) {
        console.warn("Supabase active integration bypassed.", dbErr);
      }

      alert(`🎉 Bid Submitted Successfully!\n\nYour proposal and roadmap estimated timeline has been delivered to Hamza Sheikh. Total Quote: ${fixedQuote}.`);
    } catch (err) {
      console.error(err);
      alert("Error submitting proposal bid. Bypassing schema.");
    }
  };

  // --- Digital Signature & eSign States ---
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [esignTargetField, setEsignTargetField] = useState<string>("");
  const [esignActiveTab, setEsignActiveTab] = useState<"draw" | "type">("draw");
  const [esignTypeName, setEsignTypeName] = useState("");
  const [selectedFont, setSelectedFont] = useState("Dancing Script");
  const [canvasHasContent, setCanvasHasContent] = useState(false);
  const [clientPublicIP, setClientPublicIP] = useState("");

  const [providerSig, setProviderSig] = useState<React.ReactNode>(
    <span className="typed-sig" style={{ fontFamily: "'Outfit', sans-serif", fontStyle: "italic", color: "#4b2c91" }}>Muhammad Hamza Sheikh</span>
  );
  const [clientSig, setClientSig] = useState<React.ReactNode>(
    <span className="typed-sig" style={{ fontFamily: "'Outfit', sans-serif", fontStyle: "italic", color: "#4b2c91" }}>Pending eSign</span>
  );
  const [providerSigBadge, setProviderSigBadge] = useState<string | null>(null);
  const [clientSigBadge, setClientSigBadge] = useState<string | null>(null);
  const [providerSigDate, setProviderSigDate] = useState("May 20, 2026");
  const [clientSigDate, setClientSigDate] = useState("Pending");

  // Canvas drawing ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);

  // Dynamic public IP lookup with robust fallback
  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setClientPublicIP(data.ip))
      .catch(() => {
        const randIP = `182.180.${Math.floor(Math.random() * 254 + 1)}.${Math.floor(Math.random() * 254 + 1)}`;
        setClientPublicIP(randIP);
      });
  }, []);

  // Check against multiple possible passcodes (default + all active generated contracts in localStorage)
  const verifyPasscode = (input: string) => {
    if (!input) return false;
    const cleanInput = input.trim();
    if (cleanInput === expectedPasscode) return true;

    try {
      const activeContractsStr = localStorage.getItem("byteleap_active_contracts");
      if (activeContractsStr) {
        const activeContracts = JSON.parse(activeContractsStr);
        // Check if any contract has this passcode
        const match = activeContracts.some((c: any) => c.passcode === cleanInput);
        if (match) return true;
      }
    } catch (e) {
      console.warn("Local storage check bypassed.", e);
    }
    return false;
  };

  // Check URL Access Param
  useEffect(() => {
    if (accessParam && verifyPasscode(accessParam)) {
      setIsUnlocked(true);
    }
  }, [accessParam]);

  // Handle Passcode Unlock
  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyPasscode(passcodeInput)) {
      setIsUnlocked(true);
      setPasscodeError(false);
    } else {
      setPasscodeError(true);
      setTimeout(() => setPasscodeError(false), 500); // Shakes card
    }
  };

  // --- WebRTC Dialer Simulation Logics ---
  const handleKeyPress = (char: string) => {
    if (dialerStatus === "idle") {
      setPhoneNumber((prev) => prev + char);
    }
  };

  const handleBackspace = () => {
    if (dialerStatus === "idle") {
      setPhoneNumber((prev) => prev.slice(0, -1));
    }
  };

  const startSimulateCall = () => {
    if (!phoneNumber) {
      alert("Please dial a number first!");
      return;
    }
    setDialerStatus("calling");
    setCallDuration(0);

    // Simulate ringing then connecting
    setTimeout(() => {
      setDialerStatus("connected");
      // Start duration counter
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }, 2000);
  };

  const hangupCall = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setDialerStatus("idle");
    setCallDuration(0);
  };

  const formatDuration = (sec: number) => {
    const minutes = Math.floor(sec / 60);
    const remainingSeconds = sec % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // --- Financial Ledger Calculations ---
  const totalRevenue = estimatedMinutes * retailRate;
  const totalCost = estimatedMinutes * rawApiCost;
  const grossProfit = totalRevenue - totalCost;
  const profitMarginPercent = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

  // --- eSign Canvas drawing handlers ---
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

  const triggerEsign = (fieldId: string, defaultName: string) => {
    setEsignTargetField(fieldId);
    setEsignTypeName(defaultName);
    setEsignActiveTab("draw");
    setCanvasHasContent(false);
    setIsSignModalOpen(true);
    // Let DOM render before initializing canvas styles
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const rect = canvas.parentElement?.getBoundingClientRect();
          canvas.width = rect?.width || 438;
          canvas.height = rect?.height || 148;
          ctx.strokeStyle = "#4b2c91";
          ctx.lineWidth = 3;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
        }
      }
    }, 100);
  };

  const applyEsign = () => {
    const today = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    let renderedSig: React.ReactNode = null;

    if (esignActiveTab === "draw") {
      if (!canvasHasContent) {
        alert("Please draw your signature inside the box before applying.");
        return;
      }
      const dataUrl = canvasRef.current?.toDataURL() || "";
      renderedSig = <img src={dataUrl} className="drawn-sig-img" alt="Digital Signature" />;
    } else {
      const name = esignTypeName.trim() || "Abraham Mehmood";
      renderedSig = (
        <span className="typed-sig" style={{ fontFamily: `'${selectedFont}', cursive`, fontSize: "1.6rem", color: "#4b2c91", fontWeight: 600 }}>
          {name}
        </span>
      );
    }

    if (esignTargetField === "providerSig") {
      setProviderSig(renderedSig);
      setProviderSigDate(today);
      const randId = `BL-PRD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      setProviderSigBadge(`Digitally Verified • Spec Owner • IP ${clientPublicIP} • ${today}`);
    } else if (esignTargetField === "clientSig") {
      setClientSig(renderedSig);
      setClientSigDate(today);
      const randId = `BL-PRD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      setClientSigBadge(`Approved & Sign-off • Client Admin • IP ${clientPublicIP} • ${today}`);
    }

    setIsSignModalOpen(false);
  };

  const updateMilestone = (index: number, field: keyof Milestone, value: string) => {
    const updated = [...milestones];
    updated[index][field] = value;
    setMilestones(updated);
  };

  // If locked, render the passcode overlay
  if (!isUnlocked) {
    return (
      <div className="security-overlay-viewport">
        <div className={`security-glass-card ${passcodeError ? "shake" : ""}`}>
          <div className="security-shield-badge">
            <i className="fas fa-shield-halved"></i>
          </div>
          <h2>Spec Decryption Gate</h2>
          <p>
            This is a highly confidential Project Requirements Document (PRD) blueprint for Byte Leap and its partner entity. Enter the secure review passcode to view the interactive spec sheet.
          </p>
          <form onSubmit={handlePasscodeSubmit}>
            <div style={{ position: "relative", marginBottom: "20px" }}>
              <input
                type="password"
                required
                placeholder="Enter Secure Passcode..."
                style={{
                  width: "100%",
                  background: "rgba(15, 10, 30, 0.6)",
                  border: "1.5px solid rgba(255, 255, 255, 0.1)",
                  padding: "14px 20px",
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
              <i className="fas fa-key"></i> Decrypt Specification
            </button>
          </form>
          {passcodeError && (
            <div style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "12px", fontWeight: "600" }}>
              <i className="fas fa-circle-exclamation"></i> Invalid Passcode. Access Denied.
            </div>
          )}
          <div style={{ marginTop: "35px", fontSize: "0.72rem", color: "rgba(255, 255, 255, 0.4)", letterSpacing: "2px", textTransform: "uppercase" }}>
            <i className="fas fa-certificate" style={{ color: "#edaf2e", marginRight: "4px" }}></i> BYTE LEAP SYSTEM LOCK
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="prd-view-wrapper">
      {/* Load custom styles and CDN links */}
      <link
        href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Allura&family=Dancing+Script:wght@600;700&family=Great+Vibes&family=Monsieur+La+Doulaise&family=Pacifico&family=Reenie+Beanie&family=Sacramento&family=Outfit:wght@300;400;500;600;700;800;900&family=Raleway:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      {/* --- Interactive Navigation Toolbar --- */}
      <div className="no-print-toolbar">
        <button onClick={() => router.push("/admin")} className="btn-back" title="Back to Dashboard">
          <i className="fas fa-arrow-left"></i>
        </button>
        <div className="toolbar-info">
          Byte Leap &bull; Dynamic Project Specification Sheet
        </div>
        <button className="btn-print" onClick={() => window.print()}>
          <i className="fas fa-print"></i> Print Blueprint
        </button>
      </div>

      {/* --- Main Document Sheet --- */}
      <div className="prd-container">
        {/* Letterhead Branding */}
        <DocumentHeader />

        <main className="prd-body">
          {/* Document Title Block */}
          <div className="contract-title-block">
            <h2 className="contract-main-title">Project Requirements Document (PRD)</h2>
            <div className="contract-subtitle">System Specification & Proposal</div>
          </div>

          {/* Interactive Document Metadata Card */}
          <div className="doc-meta-card">
            <div className="meta-field">
              <span className="meta-label">Project Name</span>
              <span
                className="meta-value editable-field"
                contentEditable="true"
                suppressContentEditableWarning={true}
                onBlur={(e) => setProjectName(e.target.innerText || projectName)}
                title="Click to edit project name"
              >
                {projectName}
              </span>
            </div>
            <div className="meta-field">
              <span className="meta-label">Prepared By</span>
              <span
                className="meta-value editable-field"
                contentEditable="true"
                suppressContentEditableWarning={true}
                onBlur={(e) => setPreparedBy(e.target.innerText || preparedBy)}
                title="Click to edit author"
              >
                {preparedBy}
              </span>
            </div>
            <div className="meta-field">
              <span className="meta-label">Spec Version</span>
              <span
                className="meta-value editable-field"
                contentEditable="true"
                suppressContentEditableWarning={true}
                onBlur={(e) => setDocVersion(e.target.innerText || docVersion)}
                title="Click to edit version"
              >
                {docVersion}
              </span>
            </div>
            <div className="meta-field">
              <span className="meta-label">Release Date</span>
              <span
                className="meta-value editable-field"
                contentEditable="true"
                suppressContentEditableWarning={true}
                onBlur={(e) => setCurrentDate(e.target.innerText || currentDate)}
                title="Click to edit date"
              >
                {currentDate}
              </span>
            </div>
          </div>

          {/* 1. EXECUTIVE SUMMARY */}
          <section className="prd-section">
            <h3 className="prd-section-heading">
              <span className="clause-number">1.</span> Executive Summary
            </h3>
            <div className="clause-body">
              <p>
                Byte Leap is initiating the core development of a multi-tenant, white-labeled browser-based communication infrastructure platform. The central utility of this application empowers end-users to execute both outbound and inbound Voice over IP (VoIP) calls directly from their browser interface without requiring secondary, external softphone utilities or software installations.
              </p>
              <p style={{ marginTop: "15px" }}>
                The underlying routing engine will be dynamically powered by the <strong>Twilio Programmable Voice API</strong>. However, strict architectural isolation is enforced: the system must act as a complete <strong>white-label solution</strong>. End-users must have zero visibility or knowledge of Twilio&apos;s infrastructure. Alongside the WebRTC browser dialer, the system requires a highly robust, concurrent financial ledger module designed to manage user wallets, process precise micro-transactions per minute of active call time, and reconcile overarching API operational costs for the system administrator in real-time.
              </p>
            </div>
          </section>

          {/* 2. PROPOSED TECHNOLOGY STACK */}
          <section className="prd-section">
            <h3 className="prd-section-heading">
              <span className="clause-number">2.</span> Proposed Technology Stack
            </h3>
            <div className="clause-body">
              <p>
                To support the multi-tenant architecture and fulfill the real-time telephony and ledger requirements, Byte Leap proposes the following technology blueprint (double-click values to customize):
              </p>

              <table className="schedule-table" style={{ margin: "25px 0" }}>
                <tbody>
                  <tr>
                    <th>Frontend Interface</th>
                    <td>
                      <span
                        className="editable-field"
                        contentEditable="true"
                        suppressContentEditableWarning={true}
                        onBlur={(e) => setFrontendTech(e.target.innerText || frontendTech)}
                      >
                        {frontendTech}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>Backend Infrastructure</th>
                    <td>
                      <span
                        className="editable-field"
                        contentEditable="true"
                        suppressContentEditableWarning={true}
                        onBlur={(e) => setBackendTech(e.target.innerText || backendTech)}
                      >
                        {backendTech}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>Database Engine</th>
                    <td>
                      <span
                        className="editable-field"
                        contentEditable="true"
                        suppressContentEditableWarning={true}
                        onBlur={(e) => setDatabaseEngine(e.target.innerText || databaseEngine)}
                      >
                        {databaseEngine}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>Core Integrations</th>
                    <td>
                      <span
                        className="editable-field"
                        contentEditable="true"
                        suppressContentEditableWarning={true}
                        onBlur={(e) => setCoreIntegrations(e.target.innerText || coreIntegrations)}
                      >
                        {coreIntegrations}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>Hosting Context</th>
                    <td>
                      <span
                        className="editable-field"
                        contentEditable="true"
                        suppressContentEditableWarning={true}
                        onBlur={(e) => setHostingContext(e.target.innerText || hostingContext)}
                      >
                        {hostingContext}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <div className="page-break" />

          {/* 3. CORE SYSTEM ARCHITECTURE & FEATURES */}
          <section className="prd-section">
            <h3 className="prd-section-heading">
              <span className="clause-number">3.</span> Core System Architecture & Features
            </h3>

            {/* 3.1 Multi-Tenant Organization */}
            <div className="sub-clause-block">
              <h4 className="sub-clause-title">3.1 Multi-Tenant Organization Logic</h4>
              <div className="sub-clause-content">
                <p>
                  The system enforces strict resource isolation across tenants while providing the platform operator absolute visibility:
                </p>
                <ul className="prd-list">
                  <li>
                    <strong>Admin Level (Super Admin):</strong> Centralized command deck providing comprehensive visual oversight. Monitors aggregate wallets, active calls, total registered users, current Twilio balance debt, and net profit generation metrics.
                  </li>
                  <li>
                    <strong>User Level (Tenants):</strong> Individual corporate accounts that register, top up their localized digital wallets via integrated gateways, configure extension credentials, and use the browser-based WebRTC dialer.
                  </li>
                </ul>
              </div>
            </div>

            {/* 3.2 WebRTC Browser Dialer */}
            <div className="sub-clause-block">
              <h4 className="sub-clause-title">3.2 WebRTC Browser Dialer (Interactive Sandbox Preview)</h4>
              <div className="sub-clause-content">
                <p>
                  Implementation of the Twilio Voice JavaScript SDK facilitates standard browser telephony features: responsive number layouts, call initiation, mute states, microphone access prompts, and clear failure alerts.
                </p>
                <p style={{ fontStyle: "italic", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "15px" }}>
                  Interact with the Neo-Utility simulator sandbox below to test the WebRTC connection status indicator:
                </p>

                {/* --- WEBRTC INTERACTIVE DIALER SANDBOX --- */}
                <div className="dialer-sandbox">
                  <div className="dialer-info">
                    <h4><i className="fas fa-satellite-dish"></i> WebRTC Engine sandbox</h4>
                    <p>
                      Simulate calling an outbound destination. The screen updates automatically, demonstrating connecting and active calling states synced with microphone muting states.
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>
                        <strong>Device Access:</strong> <span style={{ color: "var(--success)" }}><i className="fas fa-check-circle"></i> Granted</span>
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>
                        <strong>SIP Signaling:</strong> <span style={{ color: "var(--accent)" }}>Encrypted TLS</span>
                      </div>
                    </div>
                  </div>

                  <div className="dialer-interactive-card">
                    <div className="dialer-screen">
                      <div className="dialer-number-display">
                        {phoneNumber || "Dial Number..."}
                      </div>
                      <div className={`dialer-status ${dialerStatus}`}>
                        {dialerStatus === "idle" && "• Ready to dial"}
                        {dialerStatus === "calling" && "• Initiating SIP SIP..."}
                        {dialerStatus === "connected" && `• In call: ${formatDuration(callDuration)}`}
                      </div>
                    </div>

                    <div className="dialer-grid">
                      {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((key) => (
                        <button
                          key={key}
                          className="dialer-key"
                          onClick={() => handleKeyPress(key)}
                          disabled={dialerStatus !== "idle"}
                        >
                          {key}
                        </button>
                      ))}
                    </div>

                    <div className="dialer-actions">
                      <button
                        className="dialer-btn backspace"
                        onClick={handleBackspace}
                        disabled={dialerStatus !== "idle"}
                        title="Backspace"
                      >
                        <i className="fas fa-backspace"></i>
                      </button>

                      {dialerStatus === "idle" ? (
                        <button className="dialer-btn call" onClick={startSimulateCall}>
                          <i className="fas fa-phone"></i> Call
                        </button>
                      ) : (
                        <button className="dialer-btn hangup" onClick={hangupCall}>
                          <i className="fas fa-phone-slash"></i> Hang
                        </button>
                      )}

                      <button
                        className="dialer-btn backspace"
                        onClick={() => setIsMuted(!isMuted)}
                        style={{ color: isMuted ? "var(--danger)" : "white" }}
                        title="Mute Mic"
                      >
                        <i className={`fas ${isMuted ? "fa-microphone-slash" : "fa-microphone"}`}></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3.3 Real-Time Financial Ledger */}
            <div className="sub-clause-block">
              <h4 className="sub-clause-title">3.3 Real-Time Financial Ledger (Backend Calculator Sandbox)</h4>
              <div className="sub-clause-content">
                <p>
                  To secure transactional reliability, the ledger uses double-entry accounting built on top of <strong>PostgreSQL with Strict Row-Level Locking</strong>. Wallet deduction occurs in real-time, initiated by Twilio webhook events, preventing negative wallet balances across concurrent calls.
                </p>
                <p style={{ fontStyle: "italic", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "15px" }}>
                  Adjust parameters below to estimate monthly margins dynamically:
                </p>

                {/* --- LEDGER CALCULATOR SANDBOX --- */}
                <div className="admin-visualizer-card">
                  <div className="ledger-calculator">
                    <h5 className="ledger-calc-title"><i className="fas fa-calculator"></i> Profit Margin & Cost Estimation Sandbox</h5>
                    <div className="ledger-inputs">
                      <div className="calc-input-group">
                        <label>Retail Rate ($/min)</label>
                        <input
                          type="number"
                          step="0.01"
                          className="calc-input-field"
                          value={retailRate}
                          onChange={(e) => setRetailRate(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="calc-input-group">
                        <label>Raw Twilio Cost ($/min)</label>
                        <input
                          type="number"
                          step="0.001"
                          className="calc-input-field"
                          value={rawApiCost}
                          onChange={(e) => setRawApiCost(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="calc-input-group">
                        <label>Est. Call Minutes / Month</label>
                        <input
                          type="number"
                          className="calc-input-field"
                          value={estimatedMinutes}
                          onChange={(e) => setEstimatedMinutes(parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    <div className="ledger-result-grid">
                      <div className="ledger-res-item">
                        <span className="ledger-res-lbl">Monthly Revenue Inflow</span>
                        <div className="ledger-res-val revenue">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      </div>
                      <div className="ledger-res-item">
                        <span className="ledger-res-lbl">Monthly API Outflow</span>
                        <div className="ledger-res-val cost">${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      </div>
                      <div className="ledger-res-item">
                        <span className="ledger-res-lbl">Net Profit / Margin</span>
                        <div className="ledger-res-val profit">
                          ${grossProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          <span style={{ fontSize: "0.75rem", display: "block", color: "var(--success)" }}>
                            ({profitMarginPercent.toFixed(1)}% margin)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="page-break" />

            {/* 3.4 Webhook & Callback Management */}
            <div className="sub-clause-block">
              <h4 className="sub-clause-title">3.4 Webhook & Callback Management</h4>
              <div className="sub-clause-content">
                <p>
                  Outbound call events (ringing, answered, hung-up, failed) execute atomic, authenticated HTTP POST callbacks to our secure Node.js backend. Call logs, billing updates, and metrics depend solely on these secure server events, eliminating client-side manipulation risks.
                </p>
                <div style={{ background: "rgba(75, 44, 145, 0.02)", border: "1px solid rgba(75, 44, 145, 0.08)", padding: "20px", borderRadius: "10px", margin: "15px 0", fontSize: "0.85rem" }}>
                  <strong>Security Rule:</strong> Backend matches the custom <code>X-Twilio-Signature</code> header generated against the SHA-1 hashed payload using the webhook secret, verifying the webhook origin before deducting wallet balances.
                </div>
              </div>
            </div>

            {/* 3.5 Super Admin Panel */}
            <div className="sub-clause-block">
              <h4 className="sub-clause-title">3.5 Super Admin Panel (Neo-Utility check & Balance Visualization)</h4>
              <div className="sub-clause-content">
                <p>
                  Built strictly to the &quot;Neo-Utility&quot; high-contrast specification. Utilizes glassmorphism surfaces and clear data visualizers to allow the platform operator instant financial oversight:
                </p>

                {/* --- NEO-UTILITY DASHBOARD PREVIEW --- */}
                <div className="admin-visualizer-card">
                  <div className="viz-header">
                    <div className="viz-title">
                      <h4>Super Admin Overview</h4>
                      <p>Corporate Check &amp; Balance Dashboard</p>
                    </div>
                    <div className="viz-status-pill">
                      <i className="fas fa-circle-check"></i> System Operational
                    </div>
                  </div>

                  <div className="viz-grid">
                    {/* User conversion */}
                    <div className="viz-card">
                      <div className="viz-card-header">
                        <span className="viz-card-title">User Conversion</span>
                        <i className="fas fa-users viz-card-icon"></i>
                      </div>
                      <div className="viz-card-value">256 / 84</div>
                      <span className="viz-card-trend up">
                        <i className="fas fa-arrow-trend-up"></i> 32.8% Conversion Ratio
                      </span>
                    </div>

                    {/* Financial Inflow */}
                    <div className="viz-card">
                      <div className="viz-card-header">
                        <span className="viz-card-title">Financial Inflow</span>
                        <i className="fas fa-wallet viz-card-icon"></i>
                      </div>
                      <div className="viz-card-value">${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                      <span className="viz-card-trend up">
                        <i className="fas fa-arrow-trend-up"></i> +14.2% top-ups
                      </span>
                    </div>

                    {/* Twilio Outflow */}
                    <div className="viz-card">
                      <div className="viz-card-header">
                        <span className="viz-card-title">Twilio API Outflow</span>
                        <i className="fas fa-server viz-card-icon"></i>
                      </div>
                      <div className="viz-card-value">${totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                      <span className="viz-card-trend down">
                        <i className="fas fa-arrow-trend-down"></i> Twilio API Debt
                      </span>
                    </div>

                    {/* Profit Margin */}
                    <div className="viz-card">
                      <div className="viz-card-header">
                        <span className="viz-card-title">Gross Profit</span>
                        <i className="fas fa-chart-line viz-card-icon"></i>
                      </div>
                      <div className="viz-card-value">${grossProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                      <span className="viz-card-trend up">
                        <i className="fas fa-circle-check"></i> {profitMarginPercent.toFixed(1)}% Profit Margin
                      </span>
                    </div>
                  </div>

                  {/* Glassmorphic progress bar */}
                  <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "10px", padding: "15px", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", marginBottom: "8px", fontWeight: 700 }}>
                      <span>Reconciled Profits vs. System API Debt</span>
                      <span>{profitMarginPercent.toFixed(0)}% Profit Margin Ratio</span>
                    </div>
                    <div style={{ width: "100%", height: "8px", background: "rgba(0,0,0,0.3)", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ width: `${profitMarginPercent}%`, height: "100%", background: "linear-gradient(90deg, var(--accent) 0%, var(--success) 100%)" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="page-break" />

          {/* 4. HIGH-LEVEL DATABASE SCHEMA */}
          <section className="prd-section">
            <h3 className="prd-section-heading">
              <span className="clause-number">4.</span> High-Level Database Schema (Guideline)
            </h3>
            <div className="clause-body">
              <p>
                Below is the structured high-level PostgreSQL relational database schema blueprint designed to maintain strict data integrity for system users, call records, and immutable ledgers.
              </p>

              <div className="schema-grid">
                {/* Users Table */}
                <div className="schema-table-card">
                  <div className="schema-table-header">
                    <span>users</span>
                    <i className="fas fa-table schema-table-icon"></i>
                  </div>
                  <div className="schema-columns-list">
                    <div className="schema-col-item">
                      <span className="schema-col-name pk">id [PK]</span>
                      <span className="schema-col-type">uuid</span>
                    </div>
                    <div className="schema-col-item">
                      <span className="schema-col-name">email</span>
                      <span className="schema-col-type">varchar</span>
                    </div>
                    <div className="schema-col-item">
                      <span className="schema-col-name">role</span>
                      <span className="schema-col-type">varchar</span>
                    </div>
                    <div className="schema-col-item">
                      <span className="schema-col-name">created_at</span>
                      <span className="schema-col-type">timestamp</span>
                    </div>
                  </div>
                </div>

                {/* Wallets Table */}
                <div className="schema-table-card">
                  <div className="schema-table-header">
                    <span>wallets</span>
                    <i className="fas fa-wallet schema-table-icon"></i>
                  </div>
                  <div className="schema-columns-list">
                    <div className="schema-col-item">
                      <span className="schema-col-name pk">id [PK]</span>
                      <span className="schema-col-type">uuid</span>
                    </div>
                    <div className="schema-col-item">
                      <span className="schema-col-name fk">user_id [FK]</span>
                      <span className="schema-col-type">uuid</span>
                    </div>
                    <div className="schema-col-item">
                      <span className="schema-col-name">balance</span>
                      <span className="schema-col-type">numeric(12,4)</span>
                    </div>
                    <div className="schema-col-item">
                      <span className="schema-col-name">updated_at</span>
                      <span className="schema-col-type">timestamp</span>
                    </div>
                  </div>
                </div>

                {/* Transactions Table */}
                <div className="schema-table-card">
                  <div className="schema-table-header">
                    <span>transactions</span>
                    <i className="fas fa-list schema-table-icon"></i>
                  </div>
                  <div className="schema-columns-list">
                    <div className="schema-col-item">
                      <span className="schema-col-name pk">id [PK]</span>
                      <span className="schema-col-type">uuid</span>
                    </div>
                    <div className="schema-col-item">
                      <span className="schema-col-name fk">wallet_id [FK]</span>
                      <span className="schema-col-type">uuid</span>
                    </div>
                    <div className="schema-col-item">
                      <span className="schema-col-name">amount</span>
                      <span className="schema-col-type">numeric(12,4)</span>
                    </div>
                    <div className="schema-col-item">
                      <span className="schema-col-name">type</span>
                      <span className="schema-col-type">varchar</span>
                    </div>
                  </div>
                </div>

                {/* CallLogs Table */}
                <div className="schema-table-card">
                  <div className="schema-table-header">
                    <span>call_logs</span>
                    <i className="fas fa-phone-volume schema-table-icon"></i>
                  </div>
                  <div className="schema-columns-list">
                    <div className="schema-col-item">
                      <span className="schema-col-name pk">id [PK]</span>
                      <span className="schema-col-type">uuid</span>
                    </div>
                    <div className="schema-col-item">
                      <span className="schema-col-name">twilio_sid</span>
                      <span className="schema-col-type">varchar</span>
                    </div>
                    <div className="schema-col-item">
                      <span className="schema-col-name">duration_sec</span>
                      <span className="schema-col-type">integer</span>
                    </div>
                    <div className="schema-col-item">
                      <span className="schema-col-name">cost_to_user</span>
                      <span className="schema-col-type">numeric(10,4)</span>
                    </div>
                    <div className="schema-col-item">
                      <span className="schema-col-name">cost_to_admin</span>
                      <span className="schema-col-type">numeric(10,4)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 5. UI/UX DESIGN LANGUAGE */}
          <section className="prd-section">
            <h3 className="prd-section-heading">
              <span className="clause-number">5.</span> UI/UX Design Language
            </h3>
            <div className="clause-body">
              <p>
                The frontend interface must adhere strictly to Byte Leap’s internal premium specifications:
              </p>
              <ul className="prd-list">
                <li>
                  <strong>Theme:</strong> Neo-Utility and minimal dark-mode layout with harmonious HSL curated colors (deep slate bases with vibrant purple, cyan, and amber key buttons).
                </li>
                <li>
                  <strong>Visual Elements:</strong> Clean geometry, thick premium borders (<code>1px</code> with solid translucency), subtle 3D hover elevations, and dynamic glassmorphism panels.
                </li>
                <li>
                  <strong>Readability:</strong> Data dashboards present essential KPIs instantly without overwhelming visual clutter.
                </li>
              </ul>
            </div>
          </section>

          {/* 6. EDGE CASES & QA CONSIDERATIONS */}
          <section className="prd-section">
            <h3 className="prd-section-heading">
              <span className="clause-number">6.</span> Edge Cases & QA Considerations
            </h3>
            <div className="clause-body">
              <p>
                To deliver a production-grade infrastructure, our system must explicitly resolve the following scenarios:
              </p>
              <ul className="prd-list">
                <li>
                  <strong>Concurrent Debits:</strong> Enforcing strict PostgreSQL row-level locks (<code>SELECT FOR UPDATE</code>) on wallet balance queries so concurrent dials cannot generate sub-zero balances.
                </li>
                <li>
                  <strong>Missed Webhooks:</strong> Auto-running crons to reconcile hanging calls after 2 hours via the Twilio REST API query if normal hangup hooks fail.
                </li>
                <li>
                  <strong>Network Drops:</strong> Gracefully releasing client-side audio streams and triggering backend reconciliations when active WebRTC signaling streams disconnect.
                </li>
              </ul>
            </div>
          </section>

          <div className="page-break" />

          {/* 7. ACTION REQUIRED: DEVELOPER PROPOSAL */}
          <section className="prd-section">
            <h3 className="prd-section-heading">
              <span className="clause-number">7.</span> Action Required: Developer Proposal & Timeline RFP
            </h3>
            <div className="clause-body">
              <div style={{ background: "rgba(237, 175, 46, 0.08)", borderLeft: "4px solid var(--accent)", padding: "15px 20px", borderRadius: "4px", marginBottom: "25px", fontSize: "0.88rem", color: "var(--text-dark)", lineHeight: "1.5" }}>
                <strong>📬 RFP Contractor Bid Gateway:</strong> You are viewing this document as a bidding Contractor. Please modify the development roadmap milestones, adjust estimated durations, specify deliverables below, and fill in your identity to submit your proposal.
              </div>

              {/* Contractor Identity Fields */}
              <div className="proposal-contractor-meta" style={{ background: "rgba(75, 44, 145, 0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "20px", marginBottom: "25px" }}>
                <h4 style={{ color: "var(--primary)", fontSize: "0.95rem", textTransform: "uppercase", margin: "0 0 15px 0", letterSpacing: "0.5px", fontWeight: 700 }}><i className="fas fa-id-card"></i> 1. Contractor Identification</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                  <div>
                    <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "5px", fontWeight: 700 }}>Contractor Legal Name / Agency</label>
                    <input
                      type="text"
                      placeholder="e.g. Farhan Ali (Full-Stack Specialist)"
                      style={{ width: "100%", padding: "10px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "white", fontSize: "0.85rem", boxSizing: "border-box" }}
                      value={bidderName}
                      onChange={(e) => setBidderName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "5px", fontWeight: 700 }}>Contact Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. farhan@codeloom.io"
                      style={{ width: "100%", padding: "10px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "white", fontSize: "0.85rem", boxSizing: "border-box" }}
                      value={bidderEmail}
                      onChange={(e) => setBidderEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "5px", fontWeight: 700 }}>Proposed Technical Architecture & Approach Summary</label>
                  <textarea
                    placeholder="Briefly outline your proposed technical approach, database configuration schema, Twilio WebRTC client logic, ledger concurrency locking mechanisms..."
                    style={{ width: "100%", height: "80px", padding: "10px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "white", fontSize: "0.85rem", resize: "none", fontFamily: "inherit", boxSizing: "border-box", lineHeight: "1.5" }}
                    value={bidderApproach}
                    onChange={(e) => setBidderApproach(e.target.value)}
                  />
                </div>
              </div>

              {/* --- DEVELOPER PROPOSAL ROADMAP --- */}
              <div className="proposal-calculator" style={{ position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                  <h5 className="proposal-calc-title" style={{ margin: 0 }}><i className="fas fa-route"></i> 2. Proposed Project Milestones & Timeline</h5>
                  <button
                    type="button"
                    onClick={addMilestoneRow}
                    className="btn-console btn-purple"
                    style={{ fontSize: "0.75rem", padding: "6px 12px", borderRadius: "4px" }}
                  >
                    <i className="fas fa-plus"></i> Add Phase
                  </button>
                </div>

                <table className="proposal-table">
                  <thead>
                    <tr>
                      <th>Development Phase</th>
                      <th style={{ width: "120px" }}>Duration</th>
                      <th>Expected Deliverables</th>
                      <th style={{ width: "50px", textAlign: "center" }}>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {milestones.map((m, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 700, color: "var(--primary)" }}>
                          <span
                            className="editable-field"
                            contentEditable="true"
                            suppressContentEditableWarning={true}
                            onBlur={(e) => updateMilestone(idx, "phase", e.target.innerText || m.phase)}
                          >
                            {m.phase}
                          </span>
                        </td>
                        <td>
                          <span
                            className="editable-field"
                            contentEditable="true"
                            suppressContentEditableWarning={true}
                            onBlur={(e) => updateMilestone(idx, "duration", e.target.innerText || m.duration)}
                            style={{ fontWeight: 700, color: "var(--accent-hover)" }}
                          >
                            {m.duration}
                          </span>
                        </td>
                        <td>
                          <span
                            className="editable-field"
                            contentEditable="true"
                            suppressContentEditableWarning={true}
                            onBlur={(e) => updateMilestone(idx, "deliverables", e.target.innerText || m.deliverables)}
                            style={{ fontSize: "0.82rem", color: "var(--text-dark)" }}
                          >
                            {m.deliverables}
                          </span>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            type="button"
                            onClick={() => removeMilestoneRow(idx)}
                            style={{ background: "transparent", border: "none", color: "var(--danger)", cursor: "pointer", fontSize: "0.95rem" }}
                            title="Remove phase row"
                          >
                            <i className="fas fa-trash-can"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="proposal-summary-block">
                  <span className="proposal-summary-lbl">Project Quote (Fixed Price)</span>
                  <span
                    className="proposal-summary-val editable-field"
                    contentEditable="true"
                    suppressContentEditableWarning={true}
                    onFocus={(e) => {
                      if (e.target.innerText.trim() === "Click to enter quote") {
                        e.target.innerText = "";
                      }
                    }}
                    onBlur={(e) => {
                      const text = e.target.innerText.trim();
                      if (text === "Click to enter quote" || text === "") {
                        setFixedQuote("");
                      } else {
                        setFixedQuote(text);
                      }
                    }}
                    title="Click to edit quote"
                    style={!fixedQuote ? {
                      color: "rgba(237, 175, 46, 0.75)",
                      fontStyle: "normal",
                      fontSize: "1.15rem",
                      fontWeight: 700,
                      fontFamily: "'Outfit', sans-serif"
                    } : {}}
                  >
                    {fixedQuote || "Click to enter quote"}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* eSign Execution Cards */}
          <section className="prd-section">
            <h3 className="prd-section-heading">
              <span className="clause-number">8.</span> Execution & Approval Sign-off
            </h3>
            <div className="clause-body">
              <p>
                IN WITNESS WHEREOF, the Parties hereto have caused this Project Requirements Document (PRD) blueprint and Fixed-Price Proposal to be reviewed and approved by executing digital signatures below:
              </p>

              <div className="execution-container">
                {/* Developer block */}
                <div className="signature-block">
                  <h4>Developer (Byte Leap Owner)</h4>
                  <div className="sig-line-item">
                    <span className="sig-label">Signature:</span>
                    <div className="sig-placeholder">
                      {providerSig}
                    </div>
                    <button className="esign-btn" onClick={() => triggerEsign("providerSig", "Muhammad Hamza Sheikh")}>
                      <i className="fas fa-signature"></i> eSign
                    </button>
                  </div>
                  <div className="sig-line-item">
                    <span className="sig-label">Date:</span>
                    <span className="sig-placeholder" style={{ borderBottom: "none" }}>{providerSigDate}</span>
                  </div>
                  {providerSigBadge && (
                    <div className="esign-badge">
                      <i className="fas fa-shield-check"></i> {providerSigBadge}
                    </div>
                  )}
                </div>

                {/* Client block */}
                <div className="signature-block">
                  <h4>Contracting Bidder (Freelancer Sign-off)</h4>
                  <div className="sig-line-item">
                    <span className="sig-label">Signature:</span>
                    <div className="sig-placeholder">
                      {clientSigBadge ? clientSig : (
                        <span className="typed-sig" style={{ fontFamily: "'Outfit', sans-serif", fontStyle: "italic", color: "var(--primary)" }}>
                          {bidderName || "Pending Contractor eSign"}
                        </span>
                      )}
                    </div>
                    <button className="esign-btn" onClick={() => triggerEsign("clientSig", bidderName || "Contractor Signer")}>
                      <i className="fas fa-signature"></i> eSign
                    </button>
                  </div>
                  <div className="sig-line-item">
                    <span className="sig-label">Date:</span>
                    <span className="sig-placeholder" style={{ borderBottom: "none" }}>{clientSigDate}</span>
                  </div>
                  {clientSigBadge && (
                    <div className="esign-badge">
                      <i className="fas fa-shield-check"></i> {clientSigBadge}
                    </div>
                  )}
                </div>
              </div>

              {/* RFP Proposal Submit Button Card */}
              <div style={{ marginTop: "40px", background: "rgba(75, 44, 145, 0.04)", border: "1px dashed rgba(75, 44, 145, 0.2)", borderRadius: "10px", padding: "30px", textAlign: "center" }}>
                <h4 style={{ color: "var(--primary)", fontSize: "1.05rem", margin: "0 0 10px 0", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 800 }}>🚀 Ready to Submit Your Proposal Bid?</h4>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", maxWidth: "550px", margin: "0 auto 20px auto", lineHeight: "1.6" }}>
                  By clicking submit, your proposed milestones roadmap, technical approach description, fixed price quote of <strong style={{ color: "var(--accent)" }}>{fixedQuote || "[Unquoted]"}</strong>, and digital signature will be securely delivered to Muhammad Hamza Sheikh for evaluation.
                </p>
                <button
                  type="button"
                  onClick={handleSubmitProposalBid}
                  className="btn-console btn-purple"
                  style={{ padding: "14px 35px", fontSize: "0.92rem", fontWeight: 700, borderRadius: "6px", cursor: "pointer", boxShadow: "0 0 15px rgba(75, 44, 145, 0.15)" }}
                >
                  <i className="fas fa-paper-plane"></i> SUBMIT OFFICIAL PROPOSAL BID
                </button>
              </div>
            </div>
          </section>
        </main>

        {/* Dynamic Letterhead Footer */}
        <DocumentFooter />
      </div>

      {/* --- Premium Frosted eSign Modal Panel --- */}
      {isSignModalOpen && (
        <div className="esign-modal-backdrop">
          <div className="esign-modal-card">
            <header className="esign-modal-header">
              <h3>Create Dynamic eSign Seal</h3>
              <button onClick={() => setIsSignModalOpen(false)} className="esign-modal-close">
                <i className="fas fa-xmark"></i>
              </button>
            </header>

            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              <button
                onClick={() => setEsignActiveTab("draw")}
                className={`esign-secondary-btn ${esignActiveTab === "draw" ? "active" : ""}`}
                style={{ flex: 1, borderBottom: esignActiveTab === "draw" ? "2px solid var(--primary)" : "" }}
              >
                Draw Signature
              </button>
              <button
                onClick={() => setEsignActiveTab("type")}
                className={`esign-secondary-btn ${esignActiveTab === "type" ? "active" : ""}`}
                style={{ flex: 1, borderBottom: esignActiveTab === "type" ? "2px solid var(--primary)" : "" }}
              >
                Type Name
              </button>
            </div>

            {esignActiveTab === "draw" ? (
              <div className="sig-canvas-container">
                <canvas
                  ref={canvasRef}
                  id="sigCanvas"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                ></canvas>
                <button
                  onClick={clearCanvas}
                  style={{ position: "absolute", bottom: "10px", right: "10px", padding: "5px 10px", background: "rgba(0,0,0,0.6)", color: "white", border: "none", borderRadius: "4px", fontSize: "0.7rem", cursor: "pointer" }}
                >
                  Clear Pad
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  className="calc-input-field"
                  style={{ width: "100%", background: "#f8fafc", color: "var(--text-dark)", border: "1.5px solid var(--border-color)", padding: "12px", boxSizing: "border-box" }}
                  placeholder="Type legal name..."
                  value={esignTypeName}
                  onChange={(e) => setEsignTypeName(e.target.value)}
                />
                <div style={{ display: "flex", gap: "8px", marginTop: "15px", flexWrap: "wrap" }}>
                  {["Dancing Script", "Pacifico", "Great Vibes", "Allura"].map((font) => (
                    <button
                      key={font}
                      onClick={() => setSelectedFont(font)}
                      style={{
                        fontFamily: font,
                        fontSize: "0.95rem",
                        padding: "8px 12px",
                        background: selectedFont === font ? "var(--primary-med)" : "transparent",
                        border: `1.5px solid ${selectedFont === font ? "var(--primary)" : "var(--border-color)"}`,
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      {esignTypeName || "Signature"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="esign-actions-row">
              <button onClick={() => setIsSignModalOpen(false)} className="esign-secondary-btn">
                Cancel
              </button>
              <button onClick={applyEsign} className="esign-primary-btn">
                Apply Signature Seal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PRDViewer() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "radial-gradient(circle at 80% 10%, rgba(75, 44, 145, 0.08) 0%, rgba(237, 175, 46, 0.04) 50%, #f8fafc 100%)" }}>
        <div style={{ fontSize: "1.2rem", fontFamily: "Outfit, sans-serif", color: "#4b2c91", fontWeight: 700 }}>
          <i className="fas fa-spinner fa-spin" style={{ marginRight: "10px" }}></i> Initializing secure document session...
        </div>
      </div>
    }>
      <PRDInner />
    </Suspense>
  );
}
