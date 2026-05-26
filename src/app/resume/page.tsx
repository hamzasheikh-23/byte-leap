"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function PublicResume() {
  const router = useRouter();
  
  // Dynamic Profile States
  const [profile, setProfile] = useState({
    name: "MUHAMMAD HAMZA SHEIKH",
    title: "Software Architect & Owner",
    email: "hamza@byteleap.ca",
    phone: "+92 334 3829038",
    location: "Karachi, Pakistan",
    linkedin: "linkedin.com/in/hamzasheikh",
    github: "github.com/hamzasheikh",
    summary: "High-performance software engineer and systems architect specializing in secure cloud pipelines, database migrations, serverless frameworks, and modular PWA consoles. Dedicated to translating complex corporate specifications into robust, scalable, and beautifully optimized digital applications.",
    skills: ["Next.js", "React", "TypeScript", "Node.js", "REST APIs", "Supabase", "PostgreSQL", "PWA Architecture", "Secure Auth Systems"],
    education: [
      {
        degree: "Bachelor of Science in Computer Science",
        school: "FAST NUCES",
        date: "2019 - 2023",
      }
    ],
    experience: [
      {
        role: "Software Lead & Architect",
        company: "Byte Leap",
        date: "2024 - PRESENT",
        desc: "Designed and compiled professional multi-user dynamic document portals, encrypted file vaults, and automated eSign platforms. Scaled serverless APIs and secured cross-platform corporate operations."
      },
      {
        role: "Senior Full Stack Engineer",
        company: "TechSolutions Inc.",
        date: "2023 - 2024",
        desc: "Developed responsive React web applications, integrated payment processing engines, and streamlined automated end-to-end browser testing pipelines."
      }
    ],
    awards: [
      "FAST Coding Inventions Winner (2022) - Built secure encrypted vault engines.",
      "Outstanding Corporate Technical Lead - Byte Leap Operations."
    ],
    languages: ["English (Fluent)", "Urdu (Native)"],
    interests: ["Artificial Intelligence", "Cryptography", "UI/UX Design", "Gourmet Coffee"]
  });

  useEffect(() => {
    async function loadResumeData() {
      try {
        // 1. Fetch Profile Details
        const { data: profData, error: profErr } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", 1)
          .single();

        if (profErr) {
          console.warn("Supabase profiles query skipped:", profErr.message);
        } else if (profData) {
          setProfile(prev => ({
            ...prev,
            name: profData.name || prev.name,
            title: profData.title || prev.title,
            email: profData.email || prev.email,
            phone: profData.phone || prev.phone,
            location: profData.location || prev.location,
            linkedin: profData.linkedin_url || prev.linkedin,
            github: profData.github_url || prev.github,
            summary: profData.summary || prev.summary
          }));
        }

        // 2. Fetch Skills
        const { data: skillsData, error: skillsErr } = await supabase
          .from("skills")
          .select("skill_name")
          .eq("profile_id", 1)
          .order("display_order", { ascending: true });

        if (skillsErr) {
          console.warn("Supabase skills query skipped:", skillsErr.message);
        } else if (skillsData && skillsData.length > 0) {
          setProfile(prev => ({
            ...prev,
            skills: skillsData.map((s: any) => s.skill_name)
          }));
        }

        // 3. Fetch Jobs
        const { data: jobsData, error: jobsErr } = await supabase
          .from("jobs")
          .select("*")
          .eq("profile_id", 1)
          .order("job_order", { ascending: true });

        if (jobsErr) {
          console.warn("Supabase jobs query skipped:", jobsErr.message);
        } else if (jobsData && jobsData.length > 0) {
          setProfile(prev => ({
            ...prev,
            experience: jobsData.map((j: any) => ({
              role: j.title,
              company: j.company,
              date: j.duration,
              desc: j.bullets
            }))
          }));
        }

        // 4. Fetch Education Entries
        const { data: eduData, error: eduErr } = await supabase
          .from("education_entries")
          .select("*")
          .eq("profile_id", 1)
          .order("sort_order", { ascending: true });

        if (eduErr) {
          console.warn("Supabase education query skipped:", eduErr.message);
        } else if (eduData && eduData.length > 0) {
          setProfile(prev => ({
            ...prev,
            education: eduData.map((e: any) => ({
              degree: e.degree_title,
              school: e.institution,
              date: e.duration
            }))
          }));
        }

        // 5. Fetch Languages
        const { data: langData, error: langErr } = await supabase
          .from("resume_languages")
          .select("*")
          .eq("profile_id", 1)
          .order("display_order", { ascending: true });

        if (langErr) {
          console.warn("Supabase languages query skipped:", langErr.message);
        } else if (langData && langData.length > 0) {
          setProfile(prev => ({
            ...prev,
            languages: langData.map((l: any) => `${l.language_name} (${l.proficiency_level})`)
          }));
        }

        // 6. Fetch Interests
        const { data: intData, error: intErr } = await supabase
          .from("resume_interests")
          .select("*")
          .eq("profile_id", 1)
          .order("display_order", { ascending: true });

        if (intErr) {
          console.warn("Supabase interests query skipped:", intErr.message);
        } else if (intData && intData.length > 0) {
          setProfile(prev => ({
            ...prev,
            interests: intData.map((i: any) => i.label)
          }));
        }

      } catch (err) {
        console.warn("Failed to dynamically fetch resume profiles from Supabase, relying on local mock:", err);
      }
    }
    loadResumeData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="contract-view-wrapper" style={{ minHeight: "100vh", paddingTop: "80px" }}>
      {/* Floating Toolbar */}
      <div className="no-print-toolbar">
        <button onClick={() => router.push("/admin")} className="btn-toolbar btn-back-tb">
          <i className="fas fa-arrow-left-long"></i> Portal Console
        </button>
        <span className="toolbar-info-lbl">PUBLIC RESUME PORTFOLIO</span>
        <button onClick={handlePrint} className="btn-toolbar btn-print-tb">
          <i className="fas fa-print"></i> Print Resume
        </button>
      </div>

      {/* Main Resume Container */}
      <div className="resume-container" style={{ margin: "20px auto 40px auto", padding: "40px", maxWidth: "850px" }}>
        <header className="header" style={{ borderBottom: "2px solid #edaf2e", paddingBottom: "20px" }}>
          <div className="header-content" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
            <div className="name-title">
              <h1 style={{ fontFamily: "var(--font-outfit)", fontWeight: 800, fontSize: "2.2rem", color: "#4b2c91" }}>
                {profile.name}
              </h1>
              <h2 style={{ fontSize: "1.15rem", fontWeight: 600, color: "#edaf2e", marginTop: "4px", textTransform: "uppercase", letterSpacing: "1px" }}>
                {profile.title}
              </h2>
            </div>
            
            <div className="contact-info" style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.82rem", color: "#64748b" }}>
              <div className="contact-item" style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "flex-end" }}>
                <span>{profile.email}</span>
                <i className="fas fa-envelope" style={{ color: "#4b2c91", width: "16px" }}></i>
              </div>
              <div className="contact-item" style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "flex-end" }}>
                <span>{profile.phone}</span>
                <i className="fas fa-phone" style={{ color: "#4b2c91", width: "16px" }}></i>
              </div>
              <div className="contact-item" style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "flex-end" }}>
                <span>{profile.location}</span>
                <i className="fas fa-map-marker-alt" style={{ color: "#4b2c91", width: "16px" }}></i>
              </div>
              <div className="contact-item" style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "flex-end" }}>
                <span>{profile.linkedin}</span>
                <i className="fab fa-linkedin" style={{ color: "#4b2c91", width: "16px" }}></i>
              </div>
            </div>
          </div>
        </header>

        <main className="main-content" style={{ marginTop: "30px", display: "flex", flexDirection: "column", gap: "28px" }}>
          {/* Summary */}
          <section className="section">
            <p className="summary" style={{ fontSize: "0.95rem", lineHeight: "1.6", color: "#2c2a38" }}>
              {profile.summary}
            </p>
          </section>

          {/* Skills */}
          <section className="section">
            <h3 style={{ fontFamily: "var(--font-outfit)", fontWeight: 700, fontSize: "1rem", color: "#4b2c91", textTransform: "uppercase", borderBottom: "1.5px solid rgba(75, 44, 145, 0.1)", paddingBottom: "6px", marginBottom: "12px", letterSpacing: "0.5px" }}>
              Expertise & Skills
            </h3>
            <div className="skills-container" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {profile.skills.map((skill, idx) => (
                <span key={idx} style={{ background: "rgba(75, 44, 145, 0.05)", border: "1px solid rgba(75, 44, 145, 0.15)", borderRadius: "20px", padding: "6px 14px", fontSize: "0.8rem", fontWeight: 700, color: "#4b2c91" }}>
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Work Experience */}
          <section className="section">
            <h3 style={{ fontFamily: "var(--font-outfit)", fontWeight: 700, fontSize: "1rem", color: "#4b2c91", textTransform: "uppercase", borderBottom: "1.5px solid rgba(75, 44, 145, 0.1)", paddingBottom: "6px", marginBottom: "16px", letterSpacing: "0.5px" }}>
              Work Experience
            </h3>
            <div className="timeline" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {profile.experience.map((job, idx) => (
                <div key={idx} className="timeline-item" style={{ paddingLeft: "15px", borderLeft: "3px solid #edaf2e" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                    <h4 style={{ fontWeight: 700, fontSize: "0.95rem", color: "#2c2a38" }}>
                      {job.role} &mdash; <span style={{ color: "#4b2c91" }}>{job.company}</span>
                    </h4>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#edaf2e", letterSpacing: "0.5px" }}>
                      {job.date}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "6px", lineHeight: "1.5" }}>
                    {job.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section className="section">
            <h3 style={{ fontFamily: "var(--font-outfit)", fontWeight: 700, fontSize: "1rem", color: "#4b2c91", textTransform: "uppercase", borderBottom: "1.5px solid rgba(75, 44, 145, 0.1)", paddingBottom: "6px", marginBottom: "16px", letterSpacing: "0.5px" }}>
              Education
            </h3>
            <div className="timeline" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {profile.education.map((edu, idx) => (
                <div key={idx} className="timeline-item" style={{ paddingLeft: "15px", borderLeft: "3px solid #4b2c91" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                    <h4 style={{ fontWeight: 700, fontSize: "0.92rem", color: "#2c2a38" }}>
                      {edu.degree}
                    </h4>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#4b2c91", letterSpacing: "0.5px" }}>
                      {edu.date}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "4px" }}>
                    {edu.school}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Representation & Awards */}
          <section className="section">
            <h3 style={{ fontFamily: "var(--font-outfit)", fontWeight: 700, fontSize: "1rem", color: "#4b2c91", textTransform: "uppercase", borderBottom: "1.5px solid rgba(75, 44, 145, 0.1)", paddingBottom: "6px", marginBottom: "12px", letterSpacing: "0.5px" }}>
              Industry Representation & Awards
            </h3>
            <ul style={{ listStyleType: "circle", paddingLeft: "20px", fontSize: "0.85rem", color: "#64748b", display: "flex", flexDirection: "column", gap: "8px" }}>
              {profile.awards.map((award, idx) => (
                <li key={idx} style={{ lineHeight: "1.4" }}>{award}</li>
              ))}
            </ul>
          </section>

          {/* Languages & Interests */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            <section className="section">
              <h3 style={{ fontFamily: "var(--font-outfit)", fontWeight: 700, fontSize: "0.95rem", color: "#4b2c91", textTransform: "uppercase", borderBottom: "1.5px solid rgba(75, 44, 145, 0.1)", paddingBottom: "6px", marginBottom: "12px" }}>
                Languages
              </h3>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {profile.languages.map((lang, idx) => (
                  <span key={idx} style={{ background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.15)", borderRadius: "6px", padding: "4px 10px", fontSize: "0.8rem", color: "#10b981", fontWeight: 700 }}>
                    {lang}
                  </span>
                ))}
              </div>
            </section>

            <section className="section">
              <h3 style={{ fontFamily: "var(--font-outfit)", fontWeight: 700, fontSize: "0.95rem", color: "#4b2c91", textTransform: "uppercase", borderBottom: "1.5px solid rgba(75, 44, 145, 0.1)", paddingBottom: "6px", marginBottom: "12px" }}>
                Interests
              </h3>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {profile.interests.map((interest, idx) => (
                  <span key={idx} style={{ background: "rgba(237, 175, 46, 0.05)", border: "1px solid rgba(237, 175, 46, 0.15)", borderRadius: "6px", padding: "4px 10px", fontSize: "0.8rem", color: "#edaf2e", fontWeight: 700 }}>
                    {interest}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
