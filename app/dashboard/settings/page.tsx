"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function BrandSettingsPage() {
  const [settings, setSettings] = useState({
    business_name: "",
    description: "",
    tone: "casual",
    keywords: "",
    post_frequency: 1,
    logo_url: "",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;

      if (!userId) return;

      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (data) {
        setSettings({
          ...data,
          keywords: Array.isArray(data.keywords)
            ? data.keywords.join(", ")
            : data.keywords || "",
        });
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;

    if (!userId) {
      alert("Please log in.");
      setLoading(false);
      return;
    }

    let logo_url = settings.logo_url;

    if (logoFile) {
      const { error: uploadError } = await supabase.storage
        .from("logos")
        .upload(`${userId}/logo.png`, logoFile, { upsert: true });

      if (uploadError) {
        alert("Upload failed");
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("logos")
        .getPublicUrl(`${userId}/logo.png`);

      logo_url = publicUrlData?.publicUrl;
    }

    const { error } = await supabase
      .from("user_settings")
      .upsert(
        [{
          ...settings,
          logo_url,
          user_id: userId,
          keywords: settings.keywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean),
        }],
        { onConflict: "user_id" }
      );

    if (error) {
      alert("Failed to save settings.");
    } else {
      alert("Settings updated!");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8 bg-white rounded-lg shadow-md space-y-6">
      <h2 className="text-3xl font-bold text-[#213555]">Brand Settings</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block font-medium">Business Name</label>
          <input
            value={settings.business_name}
            onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
            className="w-full border px-4 py-2 rounded"
            placeholder="e.g. Brazilia Goods"
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium">What do you sell?</label>
          <textarea
            value={settings.description}
            onChange={(e) => setSettings({ ...settings, description: e.target.value })}
            className="w-full border px-4 py-2 rounded"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium">Brand Tone</label>
          <select
            value={settings.tone}
            onChange={(e) => setSettings({ ...settings, tone: e.target.value })}
            className="w-full border px-4 py-2 rounded"
          >
            {["casual", "witty", "formal", "warm", "professional", "playful"].map((tone) => (
              <option key={tone} value={tone}>{tone}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block font-medium">Keywords</label>
          <input
            value={settings.keywords}
            onChange={(e) => setSettings({ ...settings, keywords: e.target.value })}
            className="w-full border px-4 py-2 rounded"
            placeholder="e.g. skincare, eco, minimalist"
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium">Posts / Week</label>
          <input
            type="number"
            min={1}
            max={3}
            value={settings.post_frequency}
            onChange={(e) => setSettings({ ...settings, post_frequency: parseInt(e.target.value) })}
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium">Upload Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
          />
          {settings.logo_url && (
            <img
              src={settings.logo_url}
              alt="Logo Preview"
              className="h-20 mt-2 object-contain"
            />
          )}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="bg-[#213555] hover:bg-[#1A2B45] text-white px-6 py-2 rounded transition"
      >
        {loading ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
}
