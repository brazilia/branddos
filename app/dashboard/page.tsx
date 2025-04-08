"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardPage() {
  const [type, setType] = useState("Instagram Caption");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setOutput("");
    setError("");

    try {
      const session = await supabase.auth.getSession();
      const accessToken = session.data.session?.access_token;

      if (!accessToken) {
        throw new Error("You must be logged in to generate content.");
      }

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({ input, type }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setOutput(data.output);
    } catch (err: any) {
      console.error("Error generating:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-[#213555]">Generate Content</h2>

      <div className="space-y-4">
        <label className="block font-medium text-[#3E5879]">Post Type</label>
        <select
          className="w-full border border-[#213555] px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#3E5879]"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option>Instagram Caption</option>
          <option>Tweet</option>
          <option>Reply to Comment</option>
        </select>

        <label className="block font-medium text-[#3E5879]">Prompt / Idea</label>
        <input
          type="text"
          className="w-full border border-[#213555] px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#3E5879]"
          placeholder="e.g. announce new product drop"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={handleGenerate}
          disabled={loading || !input}
          className="bg-[#213555] text-white px-6 py-2 rounded hover:bg-[#1A2B45] transition disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {error && (
        <div className="mt-6 text-red-600 font-semibold">{error}</div>
      )}

      {output && (
        <div className="mt-10 p-6 border border-[#213555] rounded bg-[#F5F8FA] text-[#213555]">
          <h3 className="font-semibold mb-2">Generated:</h3>
          <p className="whitespace-pre-wrap">{output}</p>
        </div>
      )}
    </div>
  );
}
