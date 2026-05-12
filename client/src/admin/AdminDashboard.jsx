import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import API from "../services/adminApi"; // ← adjust this to wherever you put adminApi.js

// Socket connects to the backend server, NOT the /api/admin prefix
const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [agentRunning, setAgentRunning] = useState(false);
  const [agentMessage, setAgentMessage] = useState("");
  const [agentLog, setAgentLog] = useState([]);

  const socketRef = useRef(null);
  const logEndRef = useRef(null);

  // --------------------------------------------------
  // Fetch dashboard stats
  // --------------------------------------------------
  const fetchStats = () => {
    API.get("/stats")
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Stats fetch failed:", err);
        setLoading(false);
      });
  };

  // --------------------------------------------------
  // Socket.IO + initial data fetch
  // --------------------------------------------------
  useEffect(() => {
    fetchStats();

    // Check if agent is already mid-run (e.g. page was refreshed)
    API.get("/agent-status")
      .then((res) => setAgentRunning(res.data.running))
      .catch(() => {}); // non-critical, silently ignore

    // Connect socket ONCE
    const socket = io(SOCKET_URL, { withCredentials: true });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });

    socket.on("agent-log", (payload) => {
      const { type, message } = payload;

      setAgentLog((prev) => [...prev, { type, message }]);

      // Run finished — unlock the button and refresh stats
      if (type === "done" || type === "error") {
        setAgentRunning(false);
        fetchStats();
      }
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []); // empty array = runs once on mount only

  // Auto-scroll log terminal to bottom whenever a new line arrives
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [agentLog]);

  // --------------------------------------------------
  // Trigger agent manually
  // --------------------------------------------------
  const triggerAgent = async () => {
    try {
      setAgentRunning(true);
      setAgentMessage("");
      setAgentLog([]);

      const res = await API.post("/trigger-agent");
      setAgentMessage(res.data.message || "✅ Agent started successfully!");
    } catch (err) {
      const msg =
        "❌ " + (err.response?.data?.message || "Failed to start agent");
      setAgentMessage(msg);
      setAgentRunning(false); // unlock button on failure
    }
  };

  // --------------------------------------------------
  // Log line colour based on event type
  // --------------------------------------------------
  const logColor = (type) => {
    if (type === "stderr" || type === "error")
      return "text-red-500 dark:text-red-400";
    if (type === "done")
      return "text-green-600 dark:text-green-400 font-semibold";
    if (type === "start")
      return "text-purple-600 dark:text-purple-400 font-semibold";
    return "text-gray-600 dark:text-gray-300";
  };

  // --------------------------------------------------
  // Loading state
  // --------------------------------------------------
  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  // --------------------------------------------------
  // Stat cards config
  // --------------------------------------------------
  const statCards = [
    {
      label: "Total Users",
      value: stats?.users ?? 0,
      color: "bg-blue-600",
      icon: "👥",
    },
    {
      label: "Total Posts",
      value: stats?.posts ?? 0,
      color: "bg-green-600",
      icon: "📰",
    },
    {
      label: "AI Posts",
      value: stats?.aiPosts ?? 0,
      color: "bg-purple-600",
      icon: "🤖",
    },
    {
      label: "User Posts",
      value: stats?.userPosts ?? 0,
      color: "bg-orange-500",
      icon: "✍️",
    },
    {
      label: "Pending Approval",
      value: stats?.pending ?? 0,
      color: "bg-red-500",
      icon: "⏳",
    },
  ];

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">

      {/* PAGE TITLE */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of your TopNews platform
        </p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`${card.color} text-white p-5 rounded-xl shadow flex flex-col gap-1`}
          >
            <span className="text-2xl">{card.icon}</span>
            <p className="text-xs font-medium opacity-80">{card.label}</p>
            <p className="text-3xl font-bold">
              {Number(card.value).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* AI AGENT CONTROL PANEL */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
              🤖 TopNews AI Agent
              {agentRunning && (
                <span className="text-xs font-normal px-2 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 rounded-full animate-pulse">
                  Running...
                </span>
              )}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Auto-runs every 30 minutes. Click to trigger immediately.
            </p>
          </div>

          <button
            onClick={triggerAgent}
            disabled={agentRunning}
            className={`flex-shrink-0 flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white transition-all shadow ${
              agentRunning
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 active:scale-95"
            }`}
          >
            {agentRunning ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Running...
              </>
            ) : (
              "▶ Run AI Agent Now"
            )}
          </button>
        </div>

        {/* Body — rules + live log */}
        <div className="px-6 py-5 grid md:grid-cols-2 gap-6">

          {/* Agent rules */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
              Agent Rules
            </p>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              {[
                "✅ Writes 100% original articles — no copying",
                "✅ Auto-approved, appears on site immediately",
                "✅ Duplicate protection via URL + hash",
                "✅ 3s rate limit between articles",
                "✅ Falls back to raw text if GROQ fails",
                "✅ Detects and writes in source language",
              ].map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </div>

          {/* Live log terminal */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
              Live Activity Log
            </p>

            {/* One-time status message from the POST response */}
            {agentMessage && (
              <div
                className={`mb-3 px-3 py-2 rounded-lg text-sm font-medium ${
                  agentMessage.startsWith("❌")
                    ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                    : "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                }`}
              >
                {agentMessage}
              </div>
            )}

            {/* Scrollable log output */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 h-48 overflow-y-auto font-mono text-xs space-y-1">
              {agentLog.length > 0 ? (
                <>
                  {agentLog.map((entry, i) => (
                    <div key={i} className={logColor(entry.type)}>
                      {entry.message}
                    </div>
                  ))}
                  <div ref={logEndRef} />
                </>
              ) : (
                <p className="text-gray-400 italic font-sans text-sm">
                  No activity yet. Click "Run AI Agent Now" to start.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;