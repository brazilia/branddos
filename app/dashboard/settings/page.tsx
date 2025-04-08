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

  useEffect(() => {
    const fetchSettings = async () => {
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user.id;

      if (!userId) {
        console.error("No user session found");
        return;
      }

      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("Error fetching settings:", error);
      } else if (data) {
        setSettings({
          ...data,
          keywords: Array.isArray(data.keywords) ? data.keywords.join(", ") : data.keywords || "",
        });
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user.id;
  
    if (!userId) {
      alert("User not logged in");
      return;
    }
  
    let logo_url = settings.logo_url;
  
    if (logoFile) {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("logos")
        .upload(`${userId}/logo.png`, logoFile, { upsert: true });
  
      if (uploadError) {
        console.error("Upload error:", uploadError);
        alert("Failed to upload logo");
        return;
      }
  
      const { data: publicUrlData } = supabase.storage
        .from("logos")
        .getPublicUrl(`${userId}/logo.png`);
  
      logo_url = publicUrlData?.publicUrl;
    }
  
    const newSettings = {
      ...settings,
      user_id: userId,
      logo_url,
      // 👇 store as plain string in DB
      keywords: settings.keywords,
    };
  
    const { error: upsertError } = await supabase
      .from("user_settings")
      .upsert([newSettings], { onConflict: "user_id" });
  
    if (upsertError) {
      console.error("Upsert error:", upsertError);
      alert("Failed to save settings");
    } else {
      alert("Settings saved!");
    }
  };
  

  return (
    <div className="max-w-3xl mx-auto p-6 bg-[#F5EFE7] rounded shadow space-y-4">
      <h2 className="text-2xl font-bold text-[#213555]">Brand Settings</h2>

      <div className="space-y-2">
        <label className="block text-[#3E5879]">Business Name</label>
        <input
          type="text"
          value={settings.business_name}
          onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-[#3E5879]">What do you sell?</label>
        <textarea
          value={settings.description}
          onChange={(e) => setSettings({ ...settings, description: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-[#3E5879]">Brand Tone</label>
        <select
          value={settings.tone}
          onChange={(e) => setSettings({ ...settings, tone: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="casual">Casual</option>
          <option value="witty">Witty</option>
          <option value="formal">Formal</option>
          <option value="warm">Warm</option>
          <option value="professional">Professional</option>
          <option value="playful">Playful</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-[#3E5879]">Keywords (comma separated)</label>
        <input
          type="text"
          value={settings.keywords}
          onChange={(e) => setSettings({ ...settings, keywords: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-[#3E5879]">Post Frequency (per week)</label>
        <input
          type="number"
          min={1}
          max={3}
          value={settings.post_frequency}
          onChange={(e) => setSettings({ ...settings, post_frequency: parseInt(e.target.value) })}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-[#3E5879]">Logo Upload</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
        />
      </div>

      <button
        onClick={handleSave}
        className="bg-[#213555] text-white px-4 py-2 rounded"
      >
        Save Settings
      </button>
    </div>
  );
}
