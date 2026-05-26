"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import "./contract-view.css";
import DocumentHeader from "@/components/DocumentHeader";
import DocumentFooter from "@/components/DocumentFooter";

// Modular Components
import SecurityOverlay from "@/components/contract/SecurityOverlay";
import EsignModal from "@/components/contract/EsignModal";
import SignatureBlock from "@/components/contract/SignatureBlock";
import MilestoneManager, { Milestone } from "@/components/contract/MilestoneManager";

function ContractInner() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const type = params?.type as string; // 'contractor' or 'service-partnership'
  const accessParam = searchParams?.get("access");

  // Passcode Security States
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [activeContractsFromDb, setActiveContractsFromDb] = useState<any[]>([]);
  const [validatedPasscode, setValidatedPasscode] = useState("");

  // eSign States
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [esignTargetField, setEsignTargetField] = useState<string>("");
  const [clientPublicIP, setClientPublicIP] = useState("");

  // Signatures content state
  const [providerSig, setProviderSig] = useState<React.ReactNode>(
    <span className="typed-sig" style={{ fontFamily: "'Outfit', sans-serif", fontStyle: "italic", color: "#4b2c91" }}>Muhammad Hamza Sheikh</span>
  );
  const [clientSig, setClientSig] = useState<React.ReactNode>(
    <span className="typed-sig" style={{ fontFamily: "'Outfit', sans-serif", fontStyle: "italic", color: "#4b2c91" }}>Pending eSign</span>
  );
  const [providerInitials, setProviderInitials] = useState<React.ReactNode>("M.H.S");
  const [clientInitials, setClientInitials] = useState<React.ReactNode>("Pending");

  // Badge States
  const [providerSigBadge, setProviderSigBadge] = useState<string | null>(null);
  const [clientSigBadge, setClientSigBadge] = useState<string | null>(null);

  // Dynamic Preamble Dates
  const [contractDay, setContractDay] = useState("20th");
  const [contractMonth, setContractMonth] = useState("May");
  const [contractYear, setContractYear] = useState("2026");

  // Shared / Dynamic Company variables
  const [companyRegisteredAddress, setCompanyRegisteredAddress] = useState("A-308, Billy's Towers, Block-20, Gulistan-e-Jauhar, Karachi, Pakistan");
  const [companySigEmail, setCompanySigEmail] = useState("hamzashayk@hotmail.com");

  // Dynamic Contractor / Client variables
  const [contractorName, setContractorName] = useState("[CONTRACTOR FULL LEGAL NAME]");
  const [contractorCnic, setContractorCnic] = useState("___________________________");
  const [contractorAddress, setContractorAddress] = useState("[Insert Contractor Address]");
  const [contractorEmail, setContractorEmail] = useState("[Insert Contractor Email]");

  // Service Partnership variables (reused or bound dynamically)
  const [clientJurisdiction, setClientJurisdiction] = useState("Canada");

  // Dynamic Milestones List state for Contractor
  const [contractorMilestones, setContractorMilestones] = useState<Milestone[]>([
    {
      criteria: "Phase 1 Delivery: Complete dashboard and backend integration, passing all test cases and resolving client feedback. Phase 1 encompasses the successful delivery of all main present components and their child/sub-child components on the dashboard, as well as the backend work involved to make it fully dynamic with an AI-based data scraper.",
      amount: "160,000",
      due: "By the end of April"
    }
  ]);

  // Schedule A Dynamic Fields
  const [projectName, setProjectName] = useState("GP Analytix Platform");
  const [repositoryName, setRepositoryName] = useState("gpx1");
  const [techStack, setTechStack] = useState("MERN Stack, Python Microservice, AWS Deployments");
  const [phase1Deadline, setPhase1Deadline] = useState("April 30, 2026");
  const [commChannel, setCommChannel] = useState("MS Teams, WhatsApp, Email");
  const [workingHours, setWorkingHours] = useState("11am – 7pm (PKT - Pakistan Standard Time)");

  // Dates for Signatures
  const [providerSigDate, setProviderSigDate] = useState("May 20, 2026");
  const [clientSigDate, setClientSigDate] = useState("May 20, 2026");
  const [providerInitialsDate, setProviderInitialsDate] = useState("May 20, 2026");
  const [clientInitialsDate, setClientInitialsDate] = useState("May 20, 2026");

  // Determine dynamic expected passcode
  const expectedPasscode = type === "contractor" ? "ByteLeap-2026" : "GP-Analytix-2026";

  useEffect(() => {
    // Dynamic public IP lookup with robust fallback
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setClientPublicIP(data.ip))
      .catch(() => {
        const randIP = `182.180.${Math.floor(Math.random() * 254 + 1)}.${Math.floor(Math.random() * 254 + 1)}`;
        setClientPublicIP(randIP);
      });
  }, []);

  // Fetch active contracts dynamically from Supabase for validation on mount
  useEffect(() => {
    async function fetchContractsFromDb() {
      if (!accessParam) return;
      try {
        const { data, error } = await supabase
          .from("active_contracts")
          .select("*")
          .eq("passcode", accessParam.trim());
        if (data && data.length > 0) {
          setActiveContractsFromDb(data);
        }
      } catch (err) {
        console.warn("Failed to fetch active_contracts from Supabase for validation:", err);
      }
    }
    fetchContractsFromDb();
  }, [accessParam]);

  // Check against multiple possible passcodes (default + dynamic DB records + localStorage fallback)
  const verifyPasscode = (input: string): boolean | "expired" => {
    if (!input) return false;
    const cleanInput = input.trim();
    if (cleanInput === expectedPasscode) return true;

    // Check dynamic database contracts loaded on mount
    const dbMatch = activeContractsFromDb.find((c: any) => c.passcode === cleanInput);
    if (dbMatch) {
      if (dbMatch.expires_at && dbMatch.expires_at !== "never") {
        if (new Date() > new Date(dbMatch.expires_at)) {
          return "expired";
        }
      }
      return true;
    }

    try {
      const activeContractsStr = localStorage.getItem("byteleap_active_contracts");
      if (activeContractsStr) {
        const activeContracts = JSON.parse(activeContractsStr);
        // Check if any contract has this passcode
        const match = activeContracts.find((c: any) => c.passcode === cleanInput);
        if (match) {
          if (match.expires_at && match.expires_at !== "never") {
            if (new Date() > new Date(match.expires_at)) {
              return "expired";
            }
          }
          return true;
        }
      }
    } catch (e) {
      console.warn("Local storage check bypassed.", e);
    }
    return false;
  };

  const loadSavedSignatures = (activeCode: string) => {
    try {
      let data: any = null;

      // 1. Try reading directly from activeContractsFromDb fetched from Supabase!
      const dbRecord = activeContractsFromDb.find((c: any) => c.passcode === activeCode.trim());
      if (dbRecord && dbRecord.signature_data) {
        data = typeof dbRecord.signature_data === "string"
          ? JSON.parse(dbRecord.signature_data)
          : dbRecord.signature_data;
      }

      // 2. Fallback to localStorage if database record doesn't have it
      if (!data) {
        const stored = localStorage.getItem(`byteleap_contract_sigs_${type}_${activeCode.trim()}`);
        if (stored) data = JSON.parse(stored);
      }

      if (!data) return;

      const reconstructJSX = (sigObj: any, isInitials: boolean) => {
        if (!sigObj) return null;
        if (sigObj.sigType === "draw") {
          return <img src={sigObj.sigValue} className="drawn-sig-img" alt="Digital Signature" />;
        } else {
          return (
            <span
              className="typed-sig"
              style={{
                fontFamily: `'${sigObj.fontPreset}', cursive`,
                fontSize: isInitials ? "1.25rem" : "1.75rem",
                color: "#4b2c91",
                fontWeight: 600,
                lineHeight: 1,
              }}
            >
              {sigObj.sigValue}
            </span>
          );
        }
      };

      if (data.providerSig) {
        setProviderSig(reconstructJSX(data.providerSig, false));
        if (data.providerSigDate) setProviderSigDate(data.providerSigDate);
        if (data.providerSigBadge) setProviderSigBadge(data.providerSigBadge);
      }
      if (data.clientSig) {
        setClientSig(reconstructJSX(data.clientSig, false));
        if (data.clientSigDate) setClientSigDate(data.clientSigDate);
        if (data.clientSigBadge) setClientSigBadge(data.clientSigBadge);
      }
      if (data.providerInitials) {
        setProviderInitials(reconstructJSX(data.providerInitials, true));
        if (data.providerInitialsDate) setProviderInitialsDate(data.providerInitialsDate);
      }
      if (data.clientInitials) {
        setClientInitials(reconstructJSX(data.clientInitials, true));
        if (data.clientInitialsDate) setClientInitialsDate(data.clientInitialsDate);
      }

      if (data.editedFields) {
        const ef = data.editedFields;
        if (ef.clientJurisdiction) setClientJurisdiction(ef.clientJurisdiction);
        if (ef.contractorName) setContractorName(ef.contractorName);
        if (ef.companyRegisteredAddress) setCompanyRegisteredAddress(ef.companyRegisteredAddress);
        if (ef.contractDay) setContractDay(ef.contractDay);
        if (ef.contractMonth) setContractMonth(ef.contractMonth);
        if (ef.contractYear) setContractYear(ef.contractYear);
        if (ef.contractorCnic) setContractorCnic(ef.contractorCnic);
        if (ef.contractorAddress) setContractorAddress(ef.contractorAddress);
        if (ef.projectName) setProjectName(ef.projectName);
        if (ef.repositoryName) setRepositoryName(ef.repositoryName);
        if (ef.techStack) setTechStack(ef.techStack);
        if (ef.phase1Deadline) setPhase1Deadline(ef.phase1Deadline);
        if (ef.commChannel) setCommChannel(ef.commChannel);
        if (ef.workingHours) setWorkingHours(ef.workingHours);
      }
    } catch (e) {
      console.warn("Failed to load saved signatures:", e);
    }
  };

  const saveFieldToDb = async (fieldName: string, value: string) => {
    switch (fieldName) {
      case "clientJurisdiction": setClientJurisdiction(value); break;
      case "contractorName": setContractorName(value); break;
      case "companyRegisteredAddress": setCompanyRegisteredAddress(value); break;
      case "contractDay": setContractDay(value); break;
      case "contractMonth": setContractMonth(value); break;
      case "contractYear": setContractYear(value); break;
      case "contractorCnic": setContractorCnic(value); break;
      case "contractorAddress": setContractorAddress(value); break;
      case "projectName": setProjectName(value); break;
      case "repositoryName": setRepositoryName(value); break;
      case "techStack": setTechStack(value); break;
      case "phase1Deadline": setPhase1Deadline(value); break;
      case "commChannel": setCommChannel(value); break;
      case "workingHours": setWorkingHours(value); break;
    }

    const activeCode = (validatedPasscode || accessParam || "").trim();
    if (!activeCode) return;

    let storedData: any = {};
    try {
      const existing = localStorage.getItem(`byteleap_contract_sigs_${type}_${activeCode}`);
      if (existing) storedData = JSON.parse(existing);
    } catch (e) {}

    if (!storedData.editedFields) storedData.editedFields = {};
    storedData.editedFields[fieldName] = value;

    try {
      localStorage.setItem(`byteleap_contract_sigs_${type}_${activeCode}`, JSON.stringify(storedData));
    } catch (e) {}

    if (activeCode && activeCode !== expectedPasscode) {
      await supabase
        .from("active_contracts")
        .update({ signature_data: JSON.stringify(storedData) })
        .eq("passcode", activeCode);
    }
  };

  useEffect(() => {
    if (accessParam) {
      const result = verifyPasscode(accessParam);
      if (result === "expired") {
        setIsExpired(true);
      } else if (result === true) {
        setIsUnlocked(true);
        const code = accessParam.trim();
        setValidatedPasscode(code);
        loadSavedSignatures(code);
      }
    }
  }, [accessParam, expectedPasscode, activeContractsFromDb]);

  const handleUnlock = async (passcode: string): Promise<boolean> => {
    const cleanPass = passcode.trim();
    let result = verifyPasscode(cleanPass);

    // If passcode isn't found locally, fetch it from Supabase dynamically
    if (result === false && cleanPass !== expectedPasscode) {
      try {
        const { data } = await supabase
          .from("active_contracts")
          .select("*")
          .eq("passcode", cleanPass);
        if (data && data.length > 0) {
          setActiveContractsFromDb((prev) => {
            const exists = prev.some(c => c.passcode === cleanPass);
            return exists ? prev : [...prev, ...data];
          });
          const match = data[0];
          if (match.expires_at && match.expires_at !== "never") {
            if (new Date() > new Date(match.expires_at)) {
              result = "expired";
            }
          } else {
            result = true;
          }
        }
      } catch (err) {
        console.warn("Failed to verify passcode against Supabase dynamically:", err);
      }
    }

    if (result === "expired") {
      setIsExpired(true);
      return false;
    } else if (result === true) {
      setIsUnlocked(true);
      setValidatedPasscode(cleanPass);
      loadSavedSignatures(cleanPass);
      return true;
    }
    return false;
  };

  // eSign triggers
  const triggerEsign = (fieldId: string) => {
    setEsignTargetField(fieldId);
    setIsSignModalOpen(true);
  };

  const triggerInitialsEsign = (fieldId: string) => {
    triggerEsign(fieldId);
  };

  const handleApplySignature = (
    renderedSig: React.ReactNode,
    badgeText: string | null,
    sigData?: { sigType: "draw" | "type"; sigValue: string; fontPreset: string }
  ) => {
    const today = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const activeCode = (validatedPasscode || accessParam || expectedPasscode || "").trim();

    // Load existing sig data to append to it
    let storedData: any = {};
    try {
      const existing = localStorage.getItem(`byteleap_contract_sigs_${type}_${activeCode}`);
      if (existing) storedData = JSON.parse(existing);
    } catch (e) {}

    if (esignTargetField === "providerSig") {
      setProviderSig(renderedSig);
      setProviderSigDate(today);
      if (badgeText) setProviderSigBadge(badgeText);
      
      storedData.providerSig = sigData;
      storedData.providerSigDate = today;
      storedData.providerSigBadge = badgeText;
    } else if (esignTargetField === "clientSig") {
      setClientSig(renderedSig);
      setClientSigDate(today);
      if (badgeText) setClientSigBadge(badgeText);

      storedData.clientSig = sigData;
      storedData.clientSigDate = today;
      storedData.clientSigBadge = badgeText;
    } else if (esignTargetField === "providerInitials") {
      setProviderInitials(renderedSig);
      setProviderInitialsDate(today);
      
      storedData.providerInitials = sigData;
      storedData.providerInitialsDate = today;
    } else if (esignTargetField === "clientInitials") {
      setClientInitials(renderedSig);
      setClientInitialsDate(today);
      
      storedData.clientInitials = sigData;
      storedData.clientInitialsDate = today;
    }

    try {
      localStorage.setItem(`byteleap_contract_sigs_${type}_${activeCode}`, JSON.stringify(storedData));
    } catch (e) {}

    // Dynamically update signing status and signature data in Supabase active_contracts registry
    if (activeCode && activeCode !== expectedPasscode) {
      const isClientSig = esignTargetField === "clientSig";
      const updatePayload: any = { signature_data: JSON.stringify(storedData) };
      if (isClientSig) {
        updatePayload.status = "signed";
      }

      supabase
        .from("active_contracts")
        .update(updatePayload)
        .eq("passcode", activeCode)
        .then(({ error }) => {
          if (error) {
            console.warn("Supabase contract signature_data update failed, trying status-only:", error.message);
            if (isClientSig) {
              supabase
                .from("active_contracts")
                .update({ status: "signed" })
                .eq("passcode", activeCode);
            }
          } else {
            console.log("Successfully saved signature state to Supabase!");
          }
        });
    }
  };

  const getEsignDefaultName = (): string => {
    if (esignTargetField.toLowerCase().includes("initials")) {
      if (esignTargetField === "providerInitials") {
        return "M.H.S";
      } else {
        const nameSource = type === "contractor" ? contractorName : contractorName;
        const nameParts = nameSource.trim().split(/\s+/);
        if (nameParts.length > 0 && nameParts[0] !== "" && nameParts[0] !== "[CONTRACTOR") {
          return nameParts.map((part) => part[0].toUpperCase()).join(".");
        }
        return "A.M";
      }
    } else {
      if (esignTargetField === "providerSig") {
        return "Muhammad Hamza Sheikh";
      } else {
        return contractorName === "[CONTRACTOR FULL LEGAL NAME]" ? "Abraham Mehmood" : contractorName;
      }
    }
  };

  // Milestone action functions
  const updateContractorMilestone = (index: number, field: keyof Milestone, value: string) => {
    const updated = [...contractorMilestones];
    updated[index][field] = value;
    setContractorMilestones(updated);
  };

  const addContractorMilestone = () => {
    setContractorMilestones([
      ...contractorMilestones,
      {
        criteria: "Phase 2 Delivery: Complete next development sprint or deliverables as defined by Company.",
        amount: "80,000",
        due: "By the end of May"
      }
    ]);
  };

  const removeContractorMilestone = (index: number) => {
    if (contractorMilestones.length <= 1) {
      alert("At least one milestone is required.");
      return;
    }
    const updated = contractorMilestones.filter((_, i) => i !== index);
    setContractorMilestones(updated);
  };

  // Dynamic sum calculation for one-time payment PKR display
  const totalPaymentAmount = contractorMilestones.reduce((sum, item) => {
    const numericVal = parseFloat(item.amount.replace(/,/g, ""));
    return sum + (isNaN(numericVal) ? 0 : numericVal);
  }, 0);

  const formattedTotalPayment = totalPaymentAmount > 0
    ? totalPaymentAmount.toLocaleString()
    : "160,000";

  // If page is expired, render a premium expired screen
  if (isExpired) {
    return (
      <div className="security-overlay-viewport">
        <div className="security-glass-card" style={{ border: "1.5px solid rgba(239, 68, 68, 0.2)" }}>
          <div className="security-shield-badge" style={{ borderColor: "#ef4444", color: "#ef4444", background: "rgba(239, 68, 68, 0.1)", boxShadow: "0 0 25px rgba(239, 68, 68, 0.15)" }}>
            <i className="fas fa-clock-rotate-left"></i>
          </div>
          <h2 style={{ color: "#f87171" }}>Link Expired</h2>
          <p style={{ color: "rgba(255, 255, 255, 0.7)" }}>
            This secure contract review link has reached its maximum validity duration and is no longer active. Please request a new dynamic access link from your contract coordinator.
          </p>
          <div style={{ marginTop: "35px", fontSize: "0.72rem", color: "rgba(255, 255, 255, 0.4)", letterSpacing: "2px", textTransform: "uppercase" }}>
            <i className="fas fa-certificate" style={{ color: "#ef4444", marginRight: "4px" }}></i> SECURITY PROTOCOL EXPIRED
          </div>
        </div>
      </div>
    );
  }

  // If page is locked, render the secure passcode lock overlay
  if (!isUnlocked) {
    return <SecurityOverlay onUnlock={handleUnlock} />;
  }

  return (
    <div className="contract-view-wrapper">
      {/* Dynamic Fonts links loaded natively */}
      <link
        href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Allura&family=Dancing+Script:wght@600;700&family=Great+Vibes&family=Monsieur+La+Doulaise&family=Pacifico&family=Reenie+Beanie&family=Sacramento&family=Outfit:wght@300;400;500;600;700;800&family=Raleway:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      {/* ── Interactive Navigation Toolbar ── */}
      <div className="no-print-toolbar">
        <button onClick={() => router.push("/admin")} className="btn-back" title="Back to Dashboard" style={{ display: "flex", border: "none", cursor: "pointer" }}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <div className="toolbar-info">
          {type === "service-partnership" ? "Service Partnership & Maintenance Agreement" : "Independent Contractor Agreement"}
        </div>
        <button className="btn-print" onClick={() => window.print()}>
          Print Document
        </button>
      </div>

      {/* ── Main Contract Page Sheet ── */}
      <div className="resume-container">
        {/* Header Letterhead Branding */}
        <DocumentHeader />

        {type === "service-partnership" ? (
          /* ── SERVICE PARTNERSHIP AGREEMENT ── */
          <main className="cover-letter-body" style={{ padding: "40px 80px 20px 80px" }}>
            <div className="contract-title-block">
              <h2 className="contract-main-title">Service Partnership & Maintenance Agreement</h2>
            </div>

            <p>
              This Service Partnership & Maintenance Agreement (the “Agreement”) is made and entered into as of the <strong>20th day of May, 2026</strong> (the “Effective Date”), by and between:
            </p>

            <p style={{ marginTop: "15px", marginBottom: "15px" }}>
              <strong>MUHAMMAD HAMZA SHEIKH</strong>, an individual operating as a sole proprietorship under the registered business name <strong>BYTE LEAP</strong>, having its principal place of business at A-308, Billy&apos;s Towers, Block-20, Gulistan-e-Jauhar, Karachi, Pakistan, holding National Tax Number (NTN): J058023-0 (hereinafter referred to as the “Service Provider”);
              <br />
              <br />
              <strong>AND</strong>
              <br />
              <br />
              <strong>GP ANALYTIX</strong>, a company incorporated under the laws of{" "}
              <span
                className="editable-field"
                contentEditable="true"
                suppressContentEditableWarning={true}
                onBlur={(e) => saveFieldToDb("clientJurisdiction", e.target.textContent || "Canada")}
                title="Click to edit jurisdiction"
              >
                {clientJurisdiction}
              </span>
              , represented by its authorised signatory,{" "}
              <span
                className="editable-field"
                contentEditable="true"
                suppressContentEditableWarning={true}
                onBlur={(e) => saveFieldToDb("contractorName", e.target.textContent || "Abraham Mehmood")}
                title="Click to edit representative name"
              >
                {contractorName === "[CONTRACTOR FULL LEGAL NAME]" ? "Abraham Mehmood" : contractorName}
              </span>
              , having its registered office at{" "}
              <span
                className="editable-field"
                contentEditable="true"
                suppressContentEditableWarning={true}
                onBlur={(e) => saveFieldToDb("companyRegisteredAddress", e.target.textContent || "A-308, Billy's Towers, Block-20, Gulistan-e-Jauhar, Karachi, Pakistan")}
                title="Click to edit address"
              >
                {companyRegisteredAddress}
              </span>{" "}
              (hereinafter referred to as the “Client”).
            </p>

            <p>
              The Service Provider and the Client are hereinafter individually referred to as a “Party” and collectively as the “Parties.”
            </p>

            <p style={{ marginTop: "20px" }}>
              <strong>WHEREAS</strong> the Client wishes to engage the Service Provider to deliver software development and maintenance services for its healthcare platform financial dashboard, and the Service Provider agrees to provide such services strictly on the terms and conditions set out herein:
            </p>

            {/* Scope details */}
            <div className="contract-section">
              <h3 className="contract-section-heading">
                <span className="clause-number">1.</span> SPECIFIC SCOPE OF SERVICES
              </h3>
              <div className="clause-item">
                <span className="clause-number">1.1</span> <strong>Core Mandate.</strong> The Service Provider shall provide software development and maintenance services exclusively for the GP Analytix “Main Healthcare Platform Dashboard”, as detailed in Schedule A attached hereto.
              </div>
              <div className="clause-item">
                <span className="clause-number">1.2</span> <strong>Technical Scope.</strong> Services include:
                <div className="sub-clause">Frontend development and maintenance;</div>
                <div className="sub-clause">Backend logic and API integrations;</div>
                <div className="sub-clause">Database management and optimisation;</div>
                <div className="sub-clause">Microservice architecture support and improvements;</div>
                <div className="sub-clause">AWS Deployments.</div>
              </div>
              <div className="clause-item">
                <span className="clause-number">1.3</span> <strong>Exclusions.</strong> Any work outside the specific “Main Healthcare Platform Dashboard” module, or for any other platform, product, or system owned or operated by the Client, shall constitute a “Separate Project.” Such work shall require a new, separately executed Statement of Work (SOW) and shall be billed at the Service Provider’s prevailing market rates at the time of engagement. The Service Provider shall not be obligated to commence any Separate Project work without a fully executed SOW and advance payment as agreed therein.
              </div>
              <div className="clause-item">
                <span className="clause-number">1.4</span> <strong>Quality Standards.</strong> All deliverables shall conform to the acceptance criteria in Schedule A. In the absence of specific criteria, deliverables shall meet prevailing industry standards for security, reliability, and maintainability, with particular regard to applicable healthcare data standards.
              </div>
            </div>

            <div className="contract-section">
              <h3 className="contract-section-heading">
                <span className="clause-number">2.</span> RESOURCE DEDICATION & EXCLUSIVITY
              </h3>
              <div className="clause-item">
                <span className="clause-number">2.1</span> <strong>Dedicated Expert.</strong> Muhammad Hamza Sheikh shall be the sole designated resource of the Service Provider responsible for all services under this Agreement.
              </div>
              <div className="clause-item">
                <span className="clause-number">2.2</span> <strong>Committed Capacity.</strong> The Service Provider shall provide forty (40) hours of development work per week throughout the Term, subject to clause 2.4.
              </div>
              <div className="clause-item">
                <span className="clause-number">2.3</span> <strong>Conditional Exclusivity.</strong> During the Term of this Agreement and provided the Client is not in breach of any payment obligation under Section 3, Muhammad Hamza Sheikh shall devote his full professional working time and attention to the performance of the Services under this Agreement and shall not, directly or indirectly, provide software development or related technical services to any other individual, company, or organisation without the prior written consent of the Client.
                <br />
                For the avoidance of doubt, this exclusivity obligation is expressly conditional upon the Client maintaining timely payment of all monthly retainers and other amounts due under this Agreement. If any payment remains unpaid for more than ten (10) calendar days after its due date, the exclusivity obligation shall automatically suspend and shall remain suspended until all outstanding amounts have been paid in full in cleared funds.
              </div>
              <div className="clause-item">
                <span className="clause-number">2.4</span> <strong>Suspension of Hours for Non-Payment.</strong> If the Client fails to make any monthly payment when due, the Service Provider’s obligation to provide the forty (40) hours per week shall be suspended ten (10) calendar days after the date of default until full payment of all outstanding amounts is received, without liability to the Service Provider and without extending the overall contract term or reducing the total contract value.
              </div>
              <div className="clause-item">
                <span className="clause-number">2.5</span> <strong>Additional Resources.</strong> If the Client requires additional developers or specialised staff beyond the dedicated resource in clause 2.1, such resources shall be engaged under a separate supplemental agreement at rates to be mutually agreed in writing.
              </div>
              <div className="clause-item">
                <span className="clause-number">2.6</span> <strong>Post-Milestone Warranty.</strong> Following the Client’s formal acceptance of each milestone, the Service Provider shall provide a fifteen (15) calendar day warranty period during which it will remedy, at no additional charge, defects or non-conformities directly attributable to its own work. Defects arising from Client-provided data, third-party integrations, or modifications made by the Client outside the agreed scope are expressly excluded from this warranty.
              </div>
            </div>

            <div className="contract-section">
              <h3 className="contract-section-heading">
                <span className="clause-number">3.</span> FINANCIAL TERMS & PAYMENT SCHEDULE
              </h3>
              <div className="clause-item">
                <span className="clause-number">3.1</span> <strong>Fixed Exchange Rate.</strong> For the entire duration of this Agreement, the exchange rate is fixed at 1 USD = 280 PKR, irrespective of any market fluctuation, central bank adjustment, or currency movement. This rate shall not be subject to renegotiation during the Term.
              </div>
              <div className="clause-item">
                <span className="clause-number">3.2</span> <strong>Monthly Retainer.</strong> The Client shall pay the Service Provider a fixed monthly retainer of PKR 515,500 (equivalent to USD 1,842 at the fixed rate), constituting the base fee for all services within the agreed scope.
              </div>
              <div className="clause-item">
                <span className="clause-number">3.3</span> <strong>Total Annual Contract Value.</strong> The total annual contract value is PKR 6,186,000 (equivalent to USD 22,093), payable in twelve (12) equal monthly instalments as set out in the table below.
              </div>

              {/* Financial Installments Table */}
              <table className="financial-table">
                <thead>
                  <tr>
                    <th className="text-left">Payment Item</th>
                    <th>PKR Amount</th>
                    <th>USD Equivalent</th>
                    <th>Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-left">
                      <strong>Monthly Retainer</strong> (x12 instalments)
                    </td>
                    <td>PKR 515,500</td>
                    <td>USD 1,842</td>
                    <td>20th of each calendar month</td>
                  </tr>
                  <tr>
                    <td className="text-left">
                      <strong>Total Annual Contract Value</strong>
                    </td>
                    <td>
                      <strong>PKR 6,186,000</strong>
                    </td>
                    <td>
                      <strong>USD 22,093</strong>
                    </td>
                    <td>Over 12 months</td>
                  </tr>
                  <tr>
                    <td className="text-left">
                      <strong>Sales Bonus</strong> (per successful sale, first 10 only)
                    </td>
                    <td>PKR 140,000</td>
                    <td>USD 500</td>
                    <td>Within 7 days of client sign off</td>
                  </tr>
                </tbody>
              </table>

              <div className="clause-item">
                <span className="clause-number">3.4</span> <strong>Payment Due Date.</strong> Each monthly instalment shall be due and payable on the 20th calendar day of each month. The first payment shall be received by the Service Provider in cleared funds on or before June 20th, 2026.
              </div>
              <div className="clause-item">
                <span className="clause-number">3.5</span> <strong>Service Continuity & Resource Reservation Fee.</strong> The Client acknowledges that the Service Provider’s operations depend on the timely receipt of funds to maintain the dedicated resource, exclusive availability, and operational continuity required for the GP Analytix platform.
                <div className="sub-clause">
                  <strong>3.5.1 Operational Continuity Charge.</strong> In the event that any payment remains outstanding for more than ten (10) calendar days beyond its due date, an Operational Continuity Fee equivalent to 2% of the outstanding balance shall apply to cover the administrative overhead of reallocating cash flow.
                </div>
                <div className="sub-clause">
                  <strong>3.5.2 Nature and Purpose.</strong> The Parties agree that this charge is not a punitive interest fee. Instead, it constitutes a standard cost recovery charge intended to cover the actual administrative overhead and resource scheduling disruption caused to the Service Provider by the delay.
                </div>
              </div>
              <div className="clause-item">
                <span className="clause-number">3.6</span> <strong>Right to Suspend for Non-Payment.</strong> In the event of any payment remaining outstanding for more than fourteen (14) calendar days beyond its due date, the Service Provider shall, upon three (3) calendar days’ written notice to the Client, have the right to suspend all services under this Agreement without liability.
              </div>
              <div className="clause-item">
                <span className="clause-number">3.7</span> <strong>Sales Bonus.</strong> In addition to the base monthly retainer, the Client shall pay the Service Provider a bonus of USD 500 (PKR 140,000 at the fixed rate) for each of the first ten (10) successful client sales made by GP Analytix, attributable to the platform developed and maintained under this Agreement. Each bonus payment shall be due within seven (7) calendar days of the confirmed sale being communicated in writing by the Client to the Service Provider.
              </div>
              <div className="clause-item">
                <span className="clause-number">3.8</span> <strong>Bonus Renewal.</strong> Upon the completion of the first ten (10) qualifying sales, the Parties shall meet in good faith within thirty (30) days to renew or renegotiate the bonus commission structure for the remainder of the Term or any renewal period.
              </div>
            </div>

            <div className="page-break" />

            <div className="contract-section">
              <h3 className="contract-section-heading">
                <span className="clause-number">4.</span> CLIENT OBLIGATIONS
              </h3>
              <div className="clause-item">
                <span className="clause-number">4.1</span> <strong>Designated Representative.</strong> The Client shall designate Abraham Mehmood, or such other authorised representative as notified in writing, as the primary point of contact with full decision-making authority for matters arising under this Agreement.
              </div>
              <div className="clause-item">
                <span className="clause-number">4.2</span> <strong>Cooperation.</strong> The Client acknowledges that timely performance by the Service Provider is contingent upon the Client’s prompt cooperation. The Client shall:
                <div className="sub-clause">Provide all necessary access, credentials, data, documentation, and feedback within three (3) business days of any written request by the Service Provider;</div>
                <div className="sub-clause">Make authorised representatives available for scheduled review calls and meetings;</div>
                <div className="sub-clause">Respond to all acceptance review requests and milestone sign-offs within five (5) business days;</div>
                <div className="sub-clause">Communicate all feedback in writing through the agreed communication channel specified in Schedule A.</div>
              </div>
              <div className="clause-item">
                <span className="clause-number">4.3</span> <strong>Client-Caused Delays.</strong> Any delay in the Service Provider’s performance resulting directly from the Client’s failure to fulfil its obligations under clause 4.2 shall automatically extend all relevant delivery timelines by an equivalent period, without liability to the Service Provider. The Service Provider shall notify the Client in writing of any such delay and its cause within three (3) business days of occurrence.
              </div>
              <div className="clause-item">
                <span className="clause-number">4.4</span> <strong>Accuracy of Information.</strong> The Client represents and warrants that all data, specifications, requirements, and third-party materials furnished to the Service Provider shall be accurate, complete, lawfully obtained, and compliant with applicable healthcare data regulations. The Service Provider shall bear no liability for defects, non-conformities, or regulatory breaches arising from inaccurate, incomplete, or non-compliant information provided by the Client.
              </div>
            </div>

            <div className="contract-section">
              <h3 className="contract-section-heading">
                <span className="clause-number">5.</span> REPOSITORY & DATA SECURITY
              </h3>
              <div className="clause-item">
                <span className="clause-number">5.1</span> <strong>Access Grant.</strong> The Client shall provide the Service Provider with secure access to the GP Analytix codebase via GitHub or an equivalent version control platform, through a designated GP Analytix organisational or team account. Access shall not be granted via personal credentials of any individual.
              </div>
              <div className="clause-item">
                <span className="clause-number">5.2</span> <strong>Scope Restriction.</strong> The Service Provider’s repository and system access shall be strictly limited to the repositories, environments, and systems expressly designated in Schedule A. The Service Provider is prohibited from accessing, viewing, cloning, forking, or otherwise interacting with any repository or system outside the agreed scope.
              </div>
              <div className="clause-item">
                <span className="clause-number">5.3</span> <strong>Credential Security.</strong> Each Party shall keep all shared access credentials strictly confidential, shall not share or transfer such credentials to any third party, and shall immediately notify the other Party of any actual or suspected unauthorised access.
              </div>
              <div className="clause-item">
                <span className="clause-number">5.4</span> <strong>Zero-Contact Policy.</strong> The Service Provider and its personnel are strictly prohibited from directly contacting the Client’s end-users, healthcare providers, or institutional clients without prior written approval from Abraham Mehmood. This prohibition applies to all channels including email, WhatsApp, telephone, and social or professional networking platforms.
              </div>
              <div className="clause-item">
                <span className="clause-number">5.5</span> <strong>Consequences of Breach.</strong> Any material breach of this Section 5 by the Service Provider shall constitute a material breach entitling the Client to immediate termination under clause 9.3, without obligation to pay any kill fee or remaining balance. The Client further reserves all rights under the Prevention of Electronic Crimes Act, 2016 (PECA) and any other applicable law.
              </div>
            </div>

            <div className="contract-section">
              <h3 className="contract-section-heading">
                <span className="clause-number">6.</span> COLLABORATIVE INTELLECTUAL PROPERTY
              </h3>
              <div className="clause-item">
                <span className="clause-number">6.1</span> <strong>Client Platform Ownership.</strong> The Service Provider acknowledges that the Client retains all right, title, and interest in its pre-existing platform, codebase, and data.
              </div>
              <div className="clause-item">
                <span className="clause-number">6.2</span> <strong>Work Product & Contributions.</strong> All new code, documentation, and deliverables created by the Service Provider under this Agreement shall be referred to as “Work Product”.
                <div className="sub-clause">
                  <strong>6.2.1 Immediate Usage License.</strong> The Service Provider grants the Client an immediate, non-exclusive license to use and deploy all Work Product during the Term of this Agreement to ensure uninterrupted business operations.
                </div>
                <div className="sub-clause">
                  <strong>6.2.2 Final Ownership Transfer.</strong> Full ownership and all intellectual property rights of the Work Product shall be assigned to the Client automatically and irrevocably upon receipt of full and final payment for the services rendered.
                </div>
              </div>
              <div className="clause-item">
                <span className="clause-number">6.3</span> <strong>Pre-existing IP.</strong> The Service Provider retains ownership of its independent tools and methodologies (&quot;Background IP&quot;). The Client is granted a perpetual, royalty-free license to use any Background IP incorporated into the deliverables.
              </div>
            </div>

            <div className="contract-section">
              <h3 className="contract-section-heading">
                <span className="clause-number">7.</span> CONFIDENTIALITY
              </h3>
              <div className="clause-item">
                <span className="clause-number">7.1</span> <strong>Definition.</strong> “Confidential Information” means any non-public information disclosed by one Party to the other in connection with this Agreement, including but not limited to: source code, system architecture, patient or healthcare data, business strategies, client lists, financial information, trade secrets, pricing, and any information marked as confidential or that a reasonable person would understand to be confidential given the context of disclosure.
              </div>
              <div className="clause-item">
                <span className="clause-number">7.2</span> <strong>Obligations.</strong> Each Party agrees to: (a) hold all Confidential Information in strict confidence using at least the same degree of care as it applies to its own confidential information, but no less than reasonable care; (b) use Confidential Information solely for the purposes of this Agreement; (c) not disclose Confidential Information to any third party without prior written consent of the disclosing Party.
              </div>
              <div className="clause-item">
                <span className="clause-number">7.3</span> <strong>Exceptions.</strong> The obligations in clause 7.2 shall not apply to information that: (a) is or becomes publicly available through no fault of the receiving Party; (b) was known to the receiving Party prior to disclosure and was not subject to any obligation of confidence; (c) is independently developed by the receiving Party without reference to any Confidential Information; or (d) is required to be disclosed by applicable law or court order, provided the receiving Party gives the disclosing Party prompt written notice and cooperates in seeking a protective order where permitted by law.
              </div>
              <div className="clause-item">
                <span className="clause-number">7.4</span> <strong>Duration.</strong> Confidentiality obligations shall survive the termination or expiry of this Agreement for a period of five (5) years.
              </div>
            </div>

            <div className="page-break" />

            <div className="contract-section">
              <h3 className="contract-section-heading">
                <span className="clause-number">8.</span> NON-SOLICITATION
              </h3>
              <div className="clause-item">
                <span className="clause-number">8.1</span> <strong>Non-Solicitation by Service Provider.</strong> For a period of twelve (12) months following the termination or expiry of this Agreement, the Service Provider shall not directly or indirectly solicit, canvass, or contract with any end-client or institutional client of GP Analytix with whom the Service Provider had direct contact in the course of providing the Services under this Agreement.
              </div>
              <div className="clause-item">
                <span className="clause-number">8.2</span> <strong>Non-Solicitation by Client.</strong> For a period of twelve (12) months following the termination or expiry of this Agreement, the Client shall not, without the prior written consent of the Service Provider, directly or indirectly: (a) solicit, recruit, approach, or engage the Service Provider’s principal, or any subcontractor or associate introduced by the Service Provider in connection with this Agreement; or (b) engage any such individual or entity to perform services substantially similar to the Services.
              </div>
            </div>

            <div className="contract-section">
              <h3 className="contract-section-heading">
                <span className="clause-number">9.</span> TERM, RENEWAL & TERMINATION
              </h3>
              <div className="clause-item">
                <span className="clause-number">9.1</span> <strong>Term.</strong> This Agreement shall commence on May 20, 2026, and shall expire on May 19, 2027 (the “Term”), unless earlier terminated in accordance with this Section.
              </div>
              <div className="clause-item">
                <span className="clause-number">9.2</span> <strong>Renewal.</strong> This Agreement shall be subject to renewal on May 20, 2027, upon mutual written agreement of the Parties, executed no later than thirty (30) days before the expiry date. Upon renewal, financial terms including the monthly retainer and exchange rate shall be renegotiated in good faith.
              </div>
              <div className="clause-item">
                <span className="clause-number">9.3</span> <strong>Termination for Cause.</strong> Either Party may terminate this Agreement immediately upon written notice if the other Party commits a material breach and, where such breach is capable of remedy, fails to remedy it within fourteen (14) calendar days of receiving written notice specifying the breach in detail. Breaches of Sections 5 and 7 shall be deemed incapable of remedy and shall entitle the non-breaching Party to immediate termination.
              </div>
              <div className="clause-item">
                <span className="clause-number">9.4</span> <strong>Termination for Convenience by Client — Buyout.</strong> If the Client wishes to terminate this Agreement for convenience before the expiry of the Term, the Client must pay the Service Provider the full remaining balance of the contract, being the total of all remaining monthly instalments until May 31, 2027, calculated as set out in the table below. Final code handover, transition documentation, and IP assignment shall only be released upon receipt of the full Buyout Amount in cleared funds.
              </div>

              {/* Buyout Options Table */}
              <table className="financial-table">
                <thead>
                  <tr>
                    <th>Month of Termination</th>
                    <th>Remaining Months</th>
                    <th>Buyout Amount (PKR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Month 1</td>
                    <td>11 months remaining</td>
                    <td>PKR 5,670,500</td>
                  </tr>
                  <tr>
                    <td>Month 3</td>
                    <td>9 months remaining</td>
                    <td>PKR 4,639,500</td>
                  </tr>
                  <tr>
                    <td>Month 6</td>
                    <td>6 months remaining</td>
                    <td>PKR 3,093,000</td>
                  </tr>
                  <tr>
                    <td>Month 9</td>
                    <td>3 months remaining</td>
                    <td>PKR 1,546,500</td>
                  </tr>
                  <tr>
                    <td>Month 11</td>
                    <td>1 month remaining</td>
                    <td>PKR 515,500</td>
                  </tr>
                </tbody>
              </table>

              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontStyle: "italic", marginBottom: "20px", textAlign: "center" }}>
                For any month not listed above, the Buyout Amount shall be calculated as: (12 minus the number of completed months) x PKR 515,500.
              </p>

              <div className="clause-item">
                <span className="clause-number">9.5</span> <strong>Effect of Termination.</strong> Upon termination for any reason: (a) the Service Provider shall deliver to the Client all Work Product completed and paid for as of the termination date; (b) each Party shall return or destroy the other Party’s Confidential Information upon written request; (c) clauses 3, 6, 7, 8, 9.4, 10, 11, and 12 shall survive termination indefinitely or for the periods specified therein.
              </div>
            </div>

            <div className="contract-section">
              <h3 className="contract-section-heading">
                <span className="clause-number">10.</span> REPRESENTATIONS AND WARRANTIES
              </h3>
              <div className="clause-item">
                <span className="clause-number">10.1</span> <strong>By Both Parties.</strong> Each Party represents and warrants that:
                <div className="sub-clause">It has full legal authority to enter into this Agreement and to perform its obligations hereunder.</div>
                <div className="sub-clause">Doing so does not conflict with any other agreement, obligation, or applicable law.</div>
                <div className="sub-clause">It will maintain all licences, permits, and approvals necessary to fulfil its obligations.</div>
              </div>
              <div className="clause-item">
                <span className="clause-number">10.2</span> <strong>By the Service Provider.</strong> The Service Provider further represents and warrants that:
                <div className="sub-clause">It has the skills, expertise, and experience necessary to perform the Services.</div>
                <div className="sub-clause">All deliverables shall be the Service Provider’s original work and shall not, to the best of its knowledge, infringe any third-party intellectual property rights.</div>
                <div className="sub-clause">All deliverables shall be free of malicious code, undisclosed backdoors, and security vulnerabilities known to the Service Provider at the time of delivery.</div>
              </div>
              <div className="clause-item">
                <span className="clause-number">10.3</span> <strong>By the Client.</strong> The Client further represents and warrants that:
                <div className="sub-clause">It has full authority to provide the Service Provider with any third-party data, system access, or materials furnished in connection with the Services.</div>
                <div className="sub-clause">Such data and materials do not violate any applicable law, including healthcare data protection regulations.</div>
                <div className="sub-clause">It will use all deliverables in compliance with all applicable laws and regulations.</div>
              </div>
            </div>

            <div className="page-break" />

            <div className="contract-section">
              <h3 className="contract-section-heading">
                <span className="clause-number">11.</span> LIMITATION OF LIABILITY
              </h3>
              <div className="clause-item">
                <span className="clause-number">11.1</span> <strong>Exclusion of Consequential Loss.</strong> Neither Party shall be liable to the other for any indirect, incidental, special, consequential, or punitive damages, including loss of profit, loss of revenue, loss of data, or loss of goodwill, arising out of or in connection with this Agreement, whether based in contract, tort, or otherwise, and whether or not advised of the possibility of such damages.
              </div>
              <div className="clause-item">
                <span className="clause-number">11.2</span> <strong>Cap on Liability.</strong> The Service Provider’s total aggregate liability to the Client under or in connection with this Agreement shall not exceed the total fees actually paid by the Client to the Service Provider in the three (3) calendar months immediately preceding the event giving rise to the claim.
              </div>
              <div className="clause-item">
                <span className="clause-number">11.3</span> <strong>Healthcare Data Liability.</strong> The Service Provider shall not be liable for any healthcare-related data liabilities, regulatory penalties, or patient data breaches arising from: (a) the Client’s own business operations or failure to implement adequate data governance; (b) third-party systems or integrations not under the Service Provider’s direct control; or (c) Client-provided data that is inaccurate, incomplete, or non-compliant with applicable regulations.
              </div>
              <div className="clause-item">
                <span className="clause-number">11.4</span> <strong>Exceptions.</strong> Nothing in this clause shall limit either Party’s liability for: (a) death or personal injury caused by its negligence; (b) fraud or fraudulent misrepresentation; or (c) any other liability that cannot be excluded by applicable law.
              </div>
            </div>

            <div className="contract-section">
              <h3 className="contract-section-heading">
                <span className="clause-number">12.</span> FORCE MAJEURE
              </h3>
              <div className="clause-item">
                <span className="clause-number">12.1</span> Neither Party shall be liable for any delay or failure in performance resulting from causes beyond its reasonable control, including but not limited to: natural disasters, pandemic, war, civil unrest, governmental action, power outages, or widespread internet or infrastructure outage. The affected Party shall promptly notify the other Party in writing within five (5) calendar days of the onset of the force majeure event and shall use reasonable endeavours to resume performance as soon as practicable. If the force majeure event continues for more than sixty (60) consecutive days, either Party may terminate this Agreement upon written notice, in which event the Client shall remain liable to pay all amounts due for services completed and accepted prior to termination, and the Buyout Amount shall not be payable.
              </div>
            </div>

            <div className="contract-section">
              <h3 className="contract-section-heading">
                <span className="clause-number">13.</span> DISPUTE RESOLUTION
              </h3>
              <div className="clause-item">
                <span className="clause-number">13.1</span> <strong>Negotiation.</strong> The Parties shall first attempt to resolve any dispute, controversy, or claim arising out of or relating to this Agreement through good-faith negotiation between senior authorised representatives, within fifteen (15) calendar days of one Party delivering written notice of the dispute to the other.
              </div>
              <div className="clause-item">
                <span className="clause-number">13.2</span> <strong>Mediation.</strong> If negotiation fails to resolve the dispute within the period specified in clause 13.1, the Parties shall submit the dispute to non-binding mediation virtually or in Karachi, Pakistan, conducted under mutually agreed procedural rules, within thirty (30) days of the failure of negotiation.
              </div>
              <div className="clause-item">
                <span className="clause-number">13.3</span> <strong>Arbitration.</strong> If mediation fails to resolve the dispute, it shall be finally and conclusively resolved by binding arbitration in Karachi, Pakistan, under the Arbitration Act, 1940 (as amended), before a single arbitrator agreed by the Parties (or, failing agreement, appointed by a mutually agreed body). The language of arbitration shall be English. The arbitral award shall be final and binding on both Parties. Costs of arbitration shall be borne by the losing Party, unless the arbitrator directs otherwise.
              </div>
            </div>

            <div className="contract-section">
              <h3 className="contract-section-heading">
                <span className="clause-number">14.</span> GENERAL PROVISIONS
              </h3>
              <div className="clause-item">
                <span className="clause-number">14.1</span> <strong>Governing Law.</strong> This Agreement shall be governed by and construed exclusively in accordance with the laws of the Islamic Republic of Pakistan. Subject to Section 13, the Parties irrevocably submit to the exclusive jurisdiction of the courts of Karachi, Pakistan.
              </div>
              <div className="clause-item">
                <span className="clause-number">14.2</span> <strong>Entire Agreement.</strong> This Agreement, together with Schedule A and any duly signed Change Orders or SOWs, constitutes the entire agreement between the Parties with respect to its subject matter and supersedes all prior representations, discussions, negotiations, and agreements, whether oral or written.
              </div>
              <div className="clause-item">
                <span className="clause-number">14.3</span> <strong>Amendments.</strong> No amendment or variation to this Agreement shall be effective unless made in writing and signed by authorised representatives of both Parties.
              </div>
              <div className="clause-item">
                <span className="clause-number">14.4</span> <strong>Waiver.</strong> No failure or delay by either Party in exercising any right under this Agreement shall operate as a waiver of that right. A waiver of any breach shall not constitute a waiver of any subsequent breach of the same or any other provision.
              </div>
              <div className="clause-item">
                <span className="clause-number">14.5</span> <strong>Severability.</strong> If any provision of this Agreement is held to be invalid, illegal, or unenforceable, it shall be modified to the minimum extent necessary to make it valid and enforceable, and the remaining provisions shall continue in full force and effect.
              </div>
              <div className="clause-item">
                <span className="clause-number">14.6</span> <strong>Notices.</strong> All notices under this Agreement shall be in writing and delivered by email with delivery confirmation, or by registered post, to the addresses set out in the Execution block. Notices delivered by email shall be deemed received on the next business day following confirmed transmission.
              </div>
              <div className="clause-item">
                <span className="clause-number">14.7</span> <strong>Assignment.</strong> The Client may not assign this Agreement or any rights or obligations hereunder without the prior written consent of the Service Provider. The Service Provider may engage subcontractors for specific tasks, provided it remains solely responsible for all deliverables and obligations under this Agreement.
              </div>
              <div className="clause-item">
                <span className="clause-number">14.8</span> <strong>Counterparts.</strong> This Agreement may be executed in counterparts, including by electronic signature, each of which shall be deemed an original, and together shall constitute one and the same binding instrument.
              </div>
            </div>

            {/* Execution block */}
            <div className="contract-section">
              <h3 className="contract-section-heading">EXECUTION</h3>
              <p>IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date written above.</p>

              <div className="execution-container">
                {/* Service Provider SignatureBlock */}
                <SignatureBlock
                  partyTitle="FOR BYTE LEAP (SERVICE PROVIDER)"
                  signatureNode={providerSig}
                  sigBadge={providerSigBadge}
                  onEsignClick={() => triggerEsign("providerSig")}
                  fields={[
                    { label: "Name", value: "Muhammad Hamza Sheikh" },
                    { label: "Title", value: "Sole Proprietor" },
                    { label: "NTN", value: "J058023-0" },
                    {
                      label: "Date",
                      value: providerSigDate,
                      editable: true,
                      onChange: setProviderSigDate,
                      title: "Click to edit date"
                    },
                    { label: "Email", value: "hamzashayk@hotmail.com" }
                  ]}
                />

                {/* Client SignatureBlock */}
                <SignatureBlock
                  partyTitle="FOR GP ANALYTIX (CLIENT)"
                  signatureNode={clientSig}
                  sigBadge={clientSigBadge}
                  onEsignClick={() => triggerEsign("clientSig")}
                  fields={[
                    {
                      label: "Name",
                      value: contractorName === "[CONTRACTOR FULL LEGAL NAME]" ? "Abraham Mehmood" : contractorName,
                      editable: true,
                      onChange: setContractorName,
                      title: "Click to edit name"
                    },
                    {
                      label: "Title",
                      value: "Authorised Representative",
                      editable: true,
                      title: "Click to edit title"
                    },
                    {
                      label: "Reg. No.",
                      value: "[Insert Reg No.]",
                      editable: true,
                      title: "Click to edit Registration Number"
                    },
                    {
                      label: "Date",
                      value: clientSigDate,
                      editable: true,
                      onChange: setClientSigDate,
                      title: "Click to edit date"
                    },
                    {
                      label: "Email",
                      value: contractorEmail === "[Insert Contractor Email]" ? "abraham@gpanalytix.com" : contractorEmail,
                      editable: true,
                      onChange: setContractorEmail,
                      title: "Click to edit email"
                    }
                  ]}
                />
              </div>
            </div>

            <div className="page-break" />

            <div className="contract-section">
              <div className="contract-title-block">
                <h2 className="contract-main-title">SCHEDULE A</h2>
                <p className="contract-subtitle">PROJECT SCOPE, ACCEPTANCE CRITERIA & KEY TERMS</p>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "5px" }}>This Schedule forms part of and is incorporated into the Agreement dated May 20, 2026.</p>
              </div>

              <table className="schedule-table">
                <tbody>
                  <tr>
                    <th>PLATFORM / PRODUCT</th>
                    <td>GP Analytix Main Healthcare Platform</td>
                  </tr>
                  <tr>
                    <th>SCOPE OF WORK</th>
                    <td>Main Financial Dashboard (Frontend, Backend, APIs, Database, Microservices)</td>
                  </tr>
                  <tr>
                    <th>REPOSITORY</th>
                    <td>GP Analytix GitHub Organisation (to be designated in writing)</td>
                  </tr>
                  <tr>
                    <th>TECH STACK</th>
                    <td>MERN Stack with Python Microservice and AWS Manual Deployments (Docker configured)</td>
                  </tr>
                  <tr>
                    <th>CONTRACT START DATE</th>
                    <td>May 20, 2026</td>
                  </tr>
                  <tr>
                    <th>CONTRACT END DATE</th>
                    <td>May 19, 2027</td>
                  </tr>
                  <tr>
                    <th>DEDICATED HOURS</th>
                    <td>40 hours per week</td>
                  </tr>
                  <tr>
                    <th>ACCEPTANCE TEST PROCESS</th>
                    <td>
                      Written sign-off by{" "}
                      <span
                        className="editable-field"
                        contentEditable="true"
                        suppressContentEditableWarning={true}
                        onBlur={(e) => saveFieldToDb("contractorName", e.target.textContent || "Abraham Mehmood")}
                        title="Click to edit acceptance authority"
                      >
                        {contractorName === "[CONTRACTOR FULL LEGAL NAME]" ? "Abraham Mehmood" : contractorName}
                      </span>{" "}
                      within 5 business days of delivery
                    </td>
                  </tr>
                  <tr>
                    <th>BUG SEVERITY LEVELS</th>
                    <td style={{ padding: 0 }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", border: "none" }}>
                        <thead>
                          <tr style={{ background: "rgba(75, 44, 145, 0.02)", borderBottom: "1.5px solid var(--border-color)" }}>
                            <th style={{ padding: "10px", border: "none", fontSize: "0.75rem", width: "30%" }}>Severity Level</th>
                            <th style={{ padding: "10px", border: "none", fontSize: "0.75rem", width: "40%" }}>Definition</th>
                            <th style={{ padding: "10px", border: "none", fontSize: "0.75rem", width: "15%" }}>Response Time</th>
                            <th style={{ padding: "10px", border: "none", fontSize: "0.75rem", width: "15%" }}>Resolution Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                            <td style={{ padding: "10px", border: "none", fontWeight: 700, color: "#b91c1c" }}>P0: Critical (Blocker)</td>
                            <td style={{ padding: "10px", border: "none", fontSize: "0.8rem", color: "#475569" }}>Complete system outage or critical security vulnerability affecting all users.</td>
                            <td style={{ padding: "10px", border: "none", fontSize: "0.8rem" }}>4 Business Hours</td>
                            <td style={{ padding: "10px", border: "none", fontSize: "0.8rem" }}>1 Business Day</td>
                          </tr>
                          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                            <td style={{ padding: "10px", border: "none", fontWeight: 700, color: "#d97706" }}>P1: Major</td>
                            <td style={{ padding: "10px", border: "none", fontSize: "0.8rem", color: "#475569" }}>Significant feature malfunction with no immediate workaround, affecting core operations.</td>
                            <td style={{ padding: "10px", border: "none", fontSize: "0.8rem" }}>1 Business Day</td>
                            <td style={{ padding: "10px", border: "none", fontSize: "0.8rem" }}>3-5 Business Days</td>
                          </tr>
                          <tr style={{ borderBottom: "none" }}>
                            <td style={{ padding: "10px", border: "none", fontWeight: 700, color: "#2563eb" }}>P2: Minor</td>
                            <td style={{ padding: "10px", border: "none", fontSize: "0.8rem", color: "#475569" }}>Cosmetic issues, minor frontend bugs, or malfunctions with an easy manual workaround.</td>
                            <td style={{ padding: "10px", border: "none", fontSize: "0.8rem" }}>2 Business Days</td>
                            <td style={{ padding: "10px", border: "none", fontSize: "0.8rem" }}>5-7 Business Days</td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <th>COMMUNICATION CHANNEL</th>
                    <td>MS Teams, WhatsApp, Email.</td>
                  </tr>
                  <tr>
                    <th>WORKING HOURS / TIMEZONE</th>
                    <td>11am – 7pm (PKT - Pakistan Standard Time)</td>
                  </tr>
                  <tr>
                    <th>INVOICING CURRENCY</th>
                    <td>PKR (with USD equivalent at fixed rate of 1 USD = 280 PKR)</td>
                  </tr>
                  <tr>
                    <th>FIXED EXCHANGE RATE</th>
                    <td>1 USD = 280 PKR (fixed for the entire contract term regardless of market fluctuations)</td>
                  </tr>
                </tbody>
              </table>

              <p style={{ marginTop: "25px", textAlign: "justify", fontSize: "0.88rem" }}>
                Detailed feature specifications, wireframes, user stories, and test cases for each milestone shall be appended to this Schedule and initialled by both Parties prior to commencement of the relevant phase. Any amendment to Schedule A shall be effected exclusively by a written Change Order signed by both Parties.
              </p>

              {/* Initial slots using modular SignatureBlocks */}
              <div className="execution-container" style={{ marginTop: "30px" }}>
                <SignatureBlock
                  partyTitle="For Byte Leap:"
                  signatureNode={providerInitials}
                  onEsignClick={() => triggerInitialsEsign("providerInitials")}
                  fields={[
                    {
                      label: "Date",
                      value: providerInitialsDate,
                      editable: true,
                      onChange: setProviderInitialsDate
                    }
                  ]}
                  style={{ padding: "16px 20px" }}
                />

                <SignatureBlock
                  partyTitle="For GP Analytix:"
                  signatureNode={clientInitials}
                  onEsignClick={() => triggerInitialsEsign("clientInitials")}
                  fields={[
                    {
                      label: "Date",
                      value: clientInitialsDate,
                      editable: true,
                      onChange: setClientInitialsDate
                    }
                  ]}
                  style={{ padding: "16px 20px" }}
                />
              </div>
            </div>
          </main>
        ) : (
          /* ── INDEPENDENT CONTRACTOR AGREEMENT ── */
          <main className="cover-letter-body" style={{ padding: "40px 80px 20px 80px" }}>
            <div className="contract-title-block">
              <h2 className="contract-main-title">INDEPENDENT CONTRACTOR AGREEMENT</h2>
              <p className="contract-subtitle">Software Development Services</p>
              <p className="contract-branding">Byte Leap &bull; 2026</p>
            </div>

            <p>
              THIS INDEPENDENT CONTRACTOR AGREEMENT (the &quot;Agreement&quot;) is made and entered into as of the{" "}
              <span
                className="editable-field"
                contentEditable="true"
                suppressContentEditableWarning={true}
                onBlur={(e) => saveFieldToDb("contractDay", e.target.textContent || "20th")}
                title="Click to edit day"
              >
                {contractDay}
              </span>{" "}
              day of{" "}
              <span
                className="editable-field"
                contentEditable="true"
                suppressContentEditableWarning={true}
                onBlur={(e) => saveFieldToDb("contractMonth", e.target.textContent || "May")}
                title="Click to edit month"
              >
                {contractMonth}
              </span>
              ,{" "}
              <span
                className="editable-field"
                contentEditable="true"
                suppressContentEditableWarning={true}
                onBlur={(e) => saveFieldToDb("contractYear", e.target.textContent || "2026")}
                title="Click to edit year"
              >
                {contractYear}
              </span>{" "}
              (the &quot;Effective Date&quot;), by and between:
            </p>

            <p style={{ marginTop: "15px", marginBottom: "15px" }}>
              <strong>MUHAMMAD HAMZA SHEIKH</strong>, an individual operating as a sole proprietorship under the registered business name <strong>BYTE LEAP</strong>, having its principal place of business at{" "}
              <span
                className="editable-field"
                contentEditable="true"
                suppressContentEditableWarning={true}
                onBlur={(e) => saveFieldToDb("companyRegisteredAddress", e.target.textContent || "A-308, Billy's Towers, Block-20, Gulistan-e-Jauhar, Karachi, Pakistan")}
                title="Click to edit company address"
              >
                {companyRegisteredAddress}
              </span>
              , holding National Tax Number (NTN): J058023-0 (hereinafter referred to as the &quot;Company&quot;);
              <br />
              <br />
              <strong>AND</strong>
              <br />
              <br />
              <strong>
                <span
                  className="editable-field"
                  contentEditable="true"
                  suppressContentEditableWarning={true}
                  onBlur={(e) => saveFieldToDb("contractorName", e.target.textContent || "[CONTRACTOR FULL LEGAL NAME]")}
                  title="Click to edit Contractor Name"
                >
                  {contractorName}
                </span>
              </strong>
              , an individual holding CNIC No.{" "}
              <span
                className="editable-field"
                contentEditable="true"
                suppressContentEditableWarning={true}
                onBlur={(e) => saveFieldToDb("contractorCnic", e.target.textContent || "___________________________")}
                title="Click to edit CNIC Number"
              >
                {contractorCnic}
              </span>
              , residing at{" "}
              <span
                className="editable-field"
                contentEditable="true"
                suppressContentEditableWarning={true}
                onBlur={(e) => saveFieldToDb("contractorAddress", e.target.textContent || "[Insert Contractor Address]")}
                title="Click to edit Contractor Address"
              >
                {contractorAddress}
              </span>{" "}
              (hereinafter referred to as the &quot;Developer&quot;).
            </p>

            <p>
              The Company and the Developer are hereinafter individually referred to as a &quot;Party&quot; and collectively as the &quot;Parties.&quot;
            </p>

            <p style={{ marginTop: "15px" }}>
              <strong>WHEREAS</strong> the Company wishes to engage the Developer to provide certain software development services, and the Developer agrees to provide such services, on the terms and conditions set out herein:
            </p>

            {/* Section 1 */}
            <div className="contract-section">
              <h3 className="contract-section-heading">
                <span className="clause-number">1.</span> ENGAGEMENT AND SCOPE OF SERVICES
              </h3>
              <div className="clause-item">
                <span className="clause-number">1.1</span> <strong>Engagement.</strong> The Company hereby engages the Developer as an independent contractor, and the Developer accepts such engagement, to perform software development services as described in Schedule A attached hereto (the &quot;Services&quot;).
              </div>
              <div className="clause-item">
                <span className="clause-number">1.2</span> <strong>Reporting.</strong> The Developer shall report directly to Muhammad Hamza Sheikh or such other representative as the Company may designate in writing from time to time.
              </div>
              <div className="clause-item">
                <span className="clause-number">1.3</span> <strong>Quality Standards.</strong> All deliverables shall conform to the acceptance criteria set out in Schedule A. In the absence of specific criteria, deliverables shall meet prevailing industry standards for security, reliability, and maintainability.
              </div>
              <div className="clause-item">
                <span className="clause-number">1.4</span> <strong>Independent Contractor Status.</strong> The Developer is engaged as an independent contractor and not as an employee, agent, or partner of the Company. The Developer shall:
                <div className="sub-clause">have sole responsibility for payment of all applicable taxes on compensation received under this Agreement;</div>
                <div className="sub-clause">not be entitled to any employee benefits including provident fund, EOBI, health insurance, or paid leave;</div>
                <div className="sub-clause">retain the right to perform services for other clients, provided such work does not conflict with the Developer&apos;s obligations under this Agreement.</div>
              </div>
              <div className="clause-item">
                <span className="clause-number">1.5</span> <strong>Post-Milestone Support.</strong> Following the Company&apos;s acceptance of each milestone, the Developer shall provide a fifteen (15) day warranty period during which the Developer will, at no additional charge, remedy any defects or non-conformities attributable to the Developer&apos;s work.
              </div>
            </div>

            {/* Section 2 */}
            <div className="contract-section">
              <h3 className="contract-section-heading">
                <span className="clause-number">2.</span> PAYMENT AND MILESTONES
              </h3>
              <div className="clause-item">
                <span className="clause-number">2.1</span> <strong>One-Time Payment.</strong> The Company shall pay the Developer a one-time fee of <strong>PKR {formattedTotalPayment}</strong>. Compensation is conditional upon successful delivery and formal written acceptance by the Company of Phase 1, which must include the final resolution of all documented client feedback. Phase 1 encompasses the successful delivery of all main present components and their child/sub-child components (if valid) on the dashboard, as well as the backend work involved to make it fully dynamic with an AI-based data scraper.
                <br />
                <br />
                The required components include:{" "}
                <em>Executive Summary, Financial Overview, Income Statement, Balance Sheet, Quality and Performance, Executive & Organizational Leadership, Miscellaneous.</em>
              </div>

              {/* Dynamic Milestones / Payment Table */}
              <MilestoneManager
                milestones={contractorMilestones}
                onUpdate={updateContractorMilestone}
                onAdd={addContractorMilestone}
                onRemove={removeContractorMilestone}
              />

              <div className="clause-item">
                <span className="clause-number">2.2</span> <strong>Late Payment.</strong> If the Company fails to release payment within the period specified above following formal acceptance, the outstanding amount shall accrue interest at the rate of 1% per month until paid in full.
              </div>
              <div className="clause-item">
                <span className="clause-number">2.3</span> <strong>Termination Kill Fee.</strong> If the Company terminates this Agreement for convenience after the Developer has commenced work, the Developer shall be entitled to payment for work completed and accepted up to the date of termination, calculated on a pro-rata basis by the Company in good faith.
              </div>
              <div className="clause-item">
                <span className="clause-number">2.4</span> <strong>Invoicing.</strong> The Developer shall issue a written invoice upon the completion of Phase 1. The payment period in clause 2.1 shall commence from the date of formal written acceptance, not from the date of invoice.
              </div>
            </div>

            {/* Section 3 */}
            <div className="contract-section">
              <h3 className="contract-section-heading">
                <span className="clause-number">3.</span> SECURITY AND REPOSITORY ACCESS
              </h3>
              <div className="clause-item">
                <span className="clause-number">3.1</span> <strong>Access Grant.</strong> For the duration of this Agreement, the Company shall provide the Developer with access to the repository titled &quot;gpx1&quot; through a designated Byte Leap organisation or team account on GitHub (or equivalent platform). Access shall not be granted via personal credentials of any individual.
              </div>
              <div className="clause-item">
                <span className="clause-number">3.2</span> <strong>Scope Restriction.</strong> The Developer is strictly prohibited from accessing, viewing, cloning, forking, or otherwise interacting with any repository other than the one expressly designated in clause 3.1.
              </div>
              <div className="clause-item">
                <span className="clause-number">3.3</span> <strong>Credential Security.</strong> The Developer shall keep all access credentials strictly confidential; not share, transfer, or permit any third party to use the granted access; and immediately notify the Company of any actual or suspected unauthorised access.
              </div>
              <div className="clause-item">
                <span className="clause-number">3.4</span> <strong>Consequences.</strong> Any breach of this Section 3 shall constitute a material breach entitling the Company to immediate termination. The Company further reserves all rights under the Prevention of Electronic Crimes Act, 2016 (PECA).
              </div>
            </div>

            <div className="page-break" />

            {/* Section 4 */}
            <div className="contract-section">
              <h3 className="contract-section-heading">
                <span className="clause-number">4.</span> ZERO-CONTACT / CLIENT PROTECTION POLICY
              </h3>
              <div className="clause-item">
                <span className="clause-number">4.1</span> <strong>Prohibition.</strong> The Developer is strictly prohibited from contacting or attempting to contact the Client, directly or indirectly, without prior written approval from Muhammad Hamza Sheikh. This applies to all channels including email, WhatsApp, and social/professional networking platforms.
              </div>
              <div className="clause-item">
                <span className="clause-number">4.2</span> <strong>Non-Solicitation.</strong> For a period of twelve (12) months following termination, the Developer shall not directly or indirectly solicit, canvass, or contract with any Client of the Company with whom the Developer had contact.
              </div>
              <div className="clause-item">
                <span className="clause-number">4.3</span> <strong>Consequence.</strong> Any breach shall constitute a material breach entitling the Company to immediate termination and the right to seek injunctive relief and damages.
              </div>
            </div>

            {/* Section 5 */}
            <div className="contract-section">
              <h3 className="contract-section-heading">
                <span className="clause-number">5.</span> INTELLECTUAL PROPERTY
              </h3>
              <div className="clause-item">
                <span className="clause-number">5.1</span> <strong>Work Made for Hire.</strong> All deliverables, source code, documentation, designs, and other work product created by the Developer in the performance of the Services (collectively, &quot;Work Product&quot;) shall constitute &quot;work made for hire&quot; to the maximum extent permitted by applicable law.
              </div>
              <div className="clause-item">
                <span className="clause-number">5.2</span> <strong>Assignment.</strong> To the extent any Work Product does not qualify as work made for hire, the Developer hereby irrevocably assigns to Byte Leap all right, title, and interest therein, including all intellectual property rights, worldwide, in perpetuity, without further consideration.
              </div>
              <div className="clause-item">
                <span className="clause-number">5.3</span> <strong>Moral Rights Waiver.</strong> The Developer irrevocably and unconditionally waives, to the fullest extent permitted by law, all moral rights in the Work Product.
              </div>
              <div className="clause-item">
                <span className="clause-number">5.4</span> <strong>Pre-existing IP.</strong> Nothing in this Agreement shall transfer ownership of any tools, frameworks, or libraries owned by the Developer prior to this engagement (&quot;Pre-existing IP&quot;). To the extent Pre-existing IP is incorporated into any deliverable, the Developer hereby grants the Company a perpetual, royalty-free, worldwide licence to use such Pre-existing IP as part of the deliverable.
              </div>
              <div className="clause-item">
                <span className="clause-number">5.5</span> <strong>Developer Obligations.</strong> Upon request and at the Company&apos;s expense, the Developer shall execute such further documents and take such further actions as may reasonably be required to perfect the Company&apos;s ownership of the Work Product.
              </div>
            </div>

            {/* Section 6 */}
            <div className="contract-section">
              <h3 className="contract-section-heading">
                <span className="clause-number">6.</span> CONFIDENTIALITY
              </h3>
              <div className="clause-item">
                <span className="clause-number">6.1</span> <strong>Definition.</strong> &quot;Confidential Information&quot; means any non-public information disclosed by one Party to the other, including but not limited to: source code, system architecture, client financial data, business strategies, trade secrets, pricing, and any information marked as confidential or that a reasonable person would understand to be confidential.
              </div>
              <div className="clause-item">
                <span className="clause-number">6.2</span> <strong>Obligations.</strong> Each Party agrees to: (a) hold all Confidential Information in strict confidence; (b) use Confidential Information solely for the purposes of this Agreement; (c) not disclose Confidential Information to any third party without prior written consent.
              </div>
              <div className="clause-item">
                <span className="clause-number">6.3</span> <strong>Exceptions.</strong> The obligations in clause 6.2 shall not apply to information that: (a) is or becomes publicly available through no fault of the receiving Party; (b) was known to the receiving Party prior to disclosure; (c) is independently developed without reference to Confidential Information; or (d) is required to be disclosed by law or court order.
              </div>
              <div className="clause-item">
                <span className="clause-number">6.4</span> <strong>Duration.</strong> Confidentiality obligations shall survive the termination or expiry of this Agreement for a period of five (5) years.
              </div>
            </div>

            {/* Section 7 */}
            <div className="contract-section">
              <h3 className="contract-section-heading">
                <span className="clause-number">7.</span> NON-COMPETE
              </h3>
              <div className="clause-item">
                <span className="clause-number">7.1</span> <strong>Restriction.</strong> During the term of this Agreement and for a period of five (5) years following its termination or expiry, the Developer shall not, without prior written consent of the Company:
                <div className="sub-clause">(a) directly or indirectly solicit, engage, or provide software development services to the Company (the principal business for which the Services are provided);</div>
                <div className="sub-clause">(b) directly or indirectly solicit, engage, or provide similar software development services to any competitor, vendor, partner, or related entity of the Company;</div>
                <div className="sub-clause">(c) directly or indirectly provide software development services to any financial institution, banking entity, fintech company, investment firm, insurance company, asset management firm, healthcare provider, health-tech company, or medical software provider located in or operating from the United States of America or any member state of the European Union (including but not limited to: banks, credit unions, payment processors, trading platforms, insurance underwriters, hospitals, clinics, pharmaceutical companies, and digital health platforms).</div>

                <p style={{ marginTop: "15px", fontWeight: "600", fontSize: "0.88rem", color: "#555", lineHeight: "1.6", fontStyle: "italic" }}>
                  The geographic and sectoral restrictions in this clause are essential to protecting the Company’s proprietary interests and relationships with its financial sector and healthcare sector clients in developed markets.
                </p>
              </div>
              <div className="clause-item">
                <span className="clause-number">7.2</span> <strong>Reasonableness.</strong> The Parties acknowledge that the restrictions in this Section are reasonable in scope and duration and are necessary to protect the Company&apos;s legitimate business interests. If any court finds such restrictions unreasonable, it is agreed that the restriction shall be modified to the minimum extent necessary to make it enforceable.
              </div>
            </div>

            {/* Section 8 */}
            <div className="contract-section">
              <h3 className="contract-section-heading">
                <span className="clause-number">8.</span> REPRESENTATIONS AND WARRANTIES
              </h3>
              <div className="clause-item">
                <span className="clause-number">8.1</span> <strong>By Both Parties.</strong> Each Party represents and warrants that it has full authority to enter into this Agreement and to perform its obligations hereunder.
              </div>
              <div className="clause-item">
                <span className="clause-number">8.2</span> <strong>By the Developer.</strong> The Developer further represents and warrants that: (a) the Developer has the skills, expertise, and experience necessary to perform the Services; (b) the Work Product shall be original and shall not infringe any third-party intellectual property rights; (c) the Developer is not subject to any agreement that would prevent or restrict the Developer&apos;s ability to perform the Services; (d) all deliverables shall be free of malicious code, undisclosed backdoors, and security vulnerabilities known to the Developer at the time of delivery.
              </div>
            </div>

            <div className="page-break" />

            {/* Section 9-13 */}
            <div className="contract-section">
              <h3 className="contract-section-heading">
                <span className="clause-number">9.</span> TERM AND TERMINATION
              </h3>
              <div className="clause-item">
                <span className="clause-number">9.1</span> <strong>Term.</strong> This Agreement shall commence on the Effective Date and remain in effect until Phase 1 deliverables are finalized and signed off, or unless earlier terminated under this Section.
              </div>
              <div className="clause-item">
                <span className="clause-number">9.2</span> <strong>Termination for Cause.</strong> Either Party may terminate immediately upon material breach. Breaches of Section 3 or 4 are deemed incapable of remedy.
              </div>
              <div className="clause-item">
                <span className="clause-number">9.3</span> <strong>Convenience.</strong> Either Party may terminate for convenience upon fifteen (15) calendar days&apos; notice.
              </div>
            </div>

            <div className="contract-section">
              <h3 className="contract-section-heading">
                <span className="clause-number">10.</span> LIMITATION OF LIABILITY
              </h3>
              <p>Neither Party shall be liable for indirect or consequential damages. The Company&apos;s total liability shall not exceed the amount paid in the preceding three (3) months.</p>
            </div>

            <div className="contract-section">
              <h3 className="contract-section-heading">
                <span className="clause-number">11.</span> FORCE MAJEURE
              </h3>
              <p>Neither Party shall be liable for delay caused by natural disasters, war, or widespread internet outage.</p>
            </div>

            <div className="contract-section">
              <h3 className="contract-section-heading">
                <span className="clause-number">12.</span> DISPUTE RESOLUTION
              </h3>
              <p>Disputes shall be attempted to be resolved via negotiation, then mediation, and finally binding arbitration under the Arbitration Act, 1940.</p>
            </div>

            <div className="contract-section">
              <h3 className="contract-section-heading">
                <span className="clause-number">13.</span> GENERAL PROVISIONS
              </h3>
              <p>Governing Law: Islamic Republic of Pakistan. Exclusive Jurisdiction: Karachi.</p>
            </div>

            {/* Execution / Signatures block using modular SignatureBlocks */}
            <div className="contract-section">
              <h3 className="contract-section-heading">EXECUTION</h3>
              <p>IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date written above.</p>

              <div className="execution-container">
                {/* Company Signature */}
                <SignatureBlock
                  partyTitle="FOR BYTE LEAP (COMPANY)"
                  signatureNode={providerSig}
                  sigBadge={providerSigBadge}
                  onEsignClick={() => triggerEsign("providerSig")}
                  fields={[
                    { label: "Name", value: "Muhammad Hamza Sheikh" },
                    { label: "Title", value: "Founder" },
                    {
                      label: "Date",
                      value: providerSigDate,
                      editable: true,
                      onChange: setProviderSigDate,
                      title: "Click to edit date"
                    },
                    {
                      label: "Address",
                      value: companyRegisteredAddress,
                      editable: true,
                      onChange: setCompanyRegisteredAddress,
                      title: "Click to edit address"
                    },
                    {
                      label: "Email",
                      value: companySigEmail,
                      editable: true,
                      onChange: setCompanySigEmail,
                      title: "Click to edit email"
                    }
                  ]}
                />

                {/* Developer Signature */}
                <SignatureBlock
                  partyTitle="FOR THE DEVELOPER"
                  signatureNode={clientSig}
                  sigBadge={clientSigBadge}
                  onEsignClick={() => triggerEsign("clientSig")}
                  fields={[
                    {
                      label: "Name",
                      value: contractorName,
                      editable: true,
                      onChange: setContractorName,
                      title: "Click to edit contractor name"
                    },
                    {
                      label: "CNIC",
                      value: contractorCnic,
                      editable: true,
                      onChange: setContractorCnic,
                      title: "Click to edit contractor CNIC"
                    },
                    {
                      label: "Date",
                      value: clientSigDate,
                      editable: true,
                      onChange: setClientSigDate,
                      title: "Click to edit signature date"
                    },
                    {
                      label: "Address",
                      value: contractorAddress,
                      editable: true,
                      onChange: setContractorAddress,
                      title: "Click to edit address"
                    },
                    {
                      label: "Email",
                      value: contractorEmail,
                      editable: true,
                      onChange: setContractorEmail,
                      title: "Click to edit email"
                    }
                  ]}
                />
              </div>
            </div>

            <div className="page-break" />

            {/* Schedule A */}
            <div className="contract-section">
              <div className="contract-title-block">
                <h2 className="contract-main-title">SCHEDULE A</h2>
                <p className="contract-subtitle">PROJECT SCOPE & ACCEPTANCE CRITERIA</p>
              </div>

              <table className="schedule-table">
                <tbody>
                  <tr>
                    <th>Project Name</th>
                    <td>
                      <span
                        className="editable-field"
                        contentEditable="true"
                        suppressContentEditableWarning={true}
                        onBlur={(e) => saveFieldToDb("projectName", e.target.textContent || "GP Analytix Platform")}
                        title="Click to edit project name"
                      >
                        {projectName}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>Repository</th>
                    <td>
                      <span
                        className="editable-field"
                        contentEditable="true"
                        suppressContentEditableWarning={true}
                        onBlur={(e) => saveFieldToDb("repositoryName", e.target.textContent || "gpx1")}
                        title="Click to edit repository name"
                      >
                        {repositoryName}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>Platform / Tech Stack</th>
                    <td>
                      <span
                        className="editable-field"
                        contentEditable="true"
                        suppressContentEditableWarning={true}
                        onBlur={(e) => saveFieldToDb("techStack", e.target.textContent || "MERN Stack & Python Scraper")}
                        title="Click to edit tech stack"
                      >
                        {techStack}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>Phase 1 Deadline</th>
                    <td>
                      <span
                        className="editable-field"
                        contentEditable="true"
                        suppressContentEditableWarning={true}
                        onBlur={(e) => saveFieldToDb("phase1Deadline", e.target.textContent || "April 30, 2026")}
                        title="Click to edit deadline"
                      >
                        {phase1Deadline}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>Acceptance Test Process</th>
                    <td>Written sign-off by Muhammad Hamza Sheikh within 5 business days of delivery</td>
                  </tr>
                  <tr>
                    <th>Bug Severity Levels</th>
                    <td>P0 (blocker): fix within 24 hrs &bull; P1 (minor): fix within 3 days &bull; P2 (major): fix within 5 days</td>
                  </tr>
                  <tr>
                    <th>Communication Channel</th>
                    <td>
                      <span
                        className="editable-field"
                        contentEditable="true"
                        suppressContentEditableWarning={true}
                        onBlur={(e) => saveFieldToDb("commChannel", e.target.textContent || "MS Teams / WhatsApp")}
                        title="Click to edit channels"
                      >
                        {commChannel}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>Working Hours / Timezone</th>
                    <td>
                      <span
                        className="editable-field"
                        contentEditable="true"
                        suppressContentEditableWarning={true}
                        onBlur={(e) => saveFieldToDb("workingHours", e.target.textContent || "11am – 7pm (PKT)")}
                        title="Click to edit working hours"
                      >
                        {workingHours}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <p style={{ marginTop: "20px" }}>
                Detailed feature specifications, wireframes, and test cases for each milestone shall be appended to this Schedule and initialled by both Parties.
              </p>

              {/* Initial slots using modular SignatureBlocks */}
              <div className="execution-container" style={{ marginTop: "30px" }}>
                <SignatureBlock
                  partyTitle="For Byte Leap:"
                  signatureNode={providerInitials}
                  onEsignClick={() => triggerInitialsEsign("providerInitials")}
                  fields={[
                    {
                      label: "Date",
                      value: providerInitialsDate,
                      editable: true,
                      onChange: setProviderInitialsDate
                    }
                  ]}
                  style={{ padding: "16px 20px" }}
                />

                <SignatureBlock
                  partyTitle="For GP Analytix:"
                  signatureNode={clientInitials}
                  onEsignClick={() => triggerInitialsEsign("clientInitials")}
                  fields={[
                    {
                      label: "Date",
                      value: clientInitialsDate,
                      editable: true,
                      onChange: setClientInitialsDate
                    }
                  ]}
                  style={{ padding: "16px 20px" }}
                />
              </div>
            </div>
          </main>
        )}

        {/* Symmetrical branding footer */}
        <DocumentFooter metaLineText="BYTE LEAP • CONFIDENTIAL AGREEMENT • SECURED ELECTRONIC PORTAL" />
      </div>

      {/* ── Draw eSign Modal Overlay ── */}
      <EsignModal
        isOpen={isSignModalOpen}
        onClose={() => setIsSignModalOpen(false)}
        targetField={esignTargetField}
        defaultName={getEsignDefaultName()}
        clientPublicIP={clientPublicIP}
        onApply={handleApplySignature}
      />
    </div>
  );
}

export default function ContractViewer() {
  return (
    <Suspense fallback={<div className="security-overlay-viewport">Loading Agreement...</div>}>
      <ContractInner />
    </Suspense>
  );
}
