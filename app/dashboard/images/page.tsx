"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function GenerateImagePage() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchBrandSettings = async () => {
    const session = await supabase.auth.getSession();
    const user_id = session.data.session?.user?.id;

    if (!user_id) return;

    const { data, error } = await supabase
      .from("brand_settings")
      .select("keywords, description, tone")
      .eq("user_id", user_id)
      .single();

    if (error) {
      setError("Failed to load brand settings.");
      return;
    }

    if (data) {
      setPrompt(`(${data.keywords.join(", ")}) - ${data.description} - ${data.tone}`);
    }
  };

  useEffect(() => {
    fetchBrandSettings();
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setImageUrl("");
    setError("");

    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("API Error:", data);
        throw new Error(data.error || "Image generation failed.");
      }

      // ✅ Match correct key from response
      setImageUrl(data.imageUrl || data.image_url || ""); // fallback

    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 px-4">
      <h2 className="text-3xl font-bold mb-6 text-[#213555]">Generate Brand Image</h2>

      <textarea
        className="w-full border border-[#213555] p-3 rounded mb-4"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={5}
      />

      <button
        onClick={handleGenerate}
        disabled={!prompt || loading}
        className="bg-[#213555] text-white px-6 py-2 rounded hover:bg-[#1A2B45] transition disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Image"}
      </button>

      {error && <div className="text-red-600 mt-4">{error}</div>}

      {imageUrl && (
        <div className="mt-6">
          <h3 className="font-medium mb-2">Generated Image:</h3>
          <img src={imageUrl} alt="Generated" className="w-full rounded shadow" />
        </div>
      )}
    </div>
  );
}
