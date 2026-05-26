"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import "./login.css";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setErrorMsg("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message || "Invalid corporate credentials.");
        setLoading(false);
      } else {
        // Redirect cleanly to admin console on success
        router.push("/admin");
      }
    } catch (err: any) {
      setErrorMsg("An unexpected auth communication failure occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-glass-card">
        {/* Brand Header */}
        <img
          src="/assets/personal/logo.png"
          alt="Byte Leap Corporate Logo"
          className="login-brand-logo"
        />
        <h1>Byte Leap Console</h1>
        <p className="subtitle-lbl">
          Corporate Operations & Secure Document Portal
        </p>

        {/* Dynamic Credential Error Bar */}
        {errorMsg && (
          <div className="login-status-alert" role="alert">
            <i className="fas fa-triangle-exclamation"></i>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSignIn} className="login-form-fields">
          {/* Email Input */}
          <div className="input-group-field">
            <label htmlFor="userEmail">Corporate Email</label>
            <div className="input-with-icon-wrap">
              <input
                id="userEmail"
                type="email"
                required
                autoComplete="username"
                placeholder="e.g. name@byteleap.ca"
                className="login-text-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <i className="fas fa-envelope prefix-icon"></i>
            </div>
          </div>

          {/* Password Input */}
          <div className="input-group-field">
            <label htmlFor="userPassword">Security Key / Password</label>
            <div className="input-with-icon-wrap">
              <input
                id="userPassword"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                className="login-text-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <i className="fas fa-lock prefix-icon"></i>
              <button
                type="button"
                className="toggle-pwd-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
                disabled={loading}
              >
                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
          </div>

          {/* Action Trigger */}
          <button
            type="submit"
            className="btn-login-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Authenticating...
              </>
            ) : (
              <>
                <i className="fas fa-shield-halved"></i> Sign in securely
              </>
            )}
          </button>
        </form>

        <div className="login-branding-watermark">
          <i className="fas fa-shield-check"></i> Byte Leap Secure
        </div>
      </div>
    </div>
  );
}
