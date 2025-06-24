"use client";

import { useEffect, useState, ChangeEvent, KeyboardEvent } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { UploadCloud, Image as ImageIcon, X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// --- New Sub-Component: A better Logo Uploader ---
const LogoUploader = ({
  currentLogoUrl,
  onFileSelect,
}: {
  currentLogoUrl: string;
  onFileSelect: (file: File | null) => void;
}) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileSelect(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const imageUrl = preview || currentLogoUrl;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Brand Logo</label>
      <div className="mt-1 flex items-center gap-4">
        <span className="inline-block h-20 w-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-300">
          {imageUrl ? (
            <img src={imageUrl} alt="Brand Logo" className="h-full w-full object-contain" />
          ) : (
            <ImageIcon className="h-full w-full text-gray-300 p-4" />
          )}
        </span>
        <label htmlFor="logo-upload" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <span>{imageUrl ? "Change" : "Upload"}</span>
          <input id="logo-upload" name="logo-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
        </label>
      </div>
    </div>
  );
};


// --- New Sub-Component: A User-Friendly Keyword Input ---
const KeywordInput = ({
    value,
    onChange
}: {
    value: string[];
    onChange: (keywords: string[]) => void;
}) => {
    const [inputValue, setInputValue] = useState("");

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newKeyword = inputValue.trim();
            if (newKeyword && !value.includes(newKeyword)) {
                onChange([...value, newKeyword]);
            }
            setInputValue("");
        }
    };

    const removeKeyword = (keywordToRemove: string) => {
        onChange(value.filter(keyword => keyword !== keywordToRemove));
    };
    
    return (
        <div>
            <input 
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a keyword and press Enter..."
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <div className="mt-2 flex flex-wrap gap-2">
                {value.map(keyword => (
                    <div key={keyword} className="flex items-center gap-1 bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full">
                        {keyword}
                        <button onClick={() => removeKeyword(keyword)} className="text-blue-500 hover:text-blue-700">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

// --- The Main Settings Page Component ---
export default function SettingsPage() {
    const supabase = createClientComponentClient();
    const [form, setForm] = useState({
        brand_name: "",
        description: "",
        tone: "Friendly", // Default value
        keywords: [] as string[],
        logo_url: "",
        post_frequency: 3, // Default value
    });
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error', message: string} | null>(null);


    // This logic stays the same
    useEffect(() => {
        const fetchSettings = async () => {
            const { data } = await supabase.from("brand_settings").select("*").maybeSingle();
            if (data) setForm({ ...form, ...data }); // merge defaults with fetched data
        };
        fetchSettings();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === 'post_frequency' ? parseInt(value, 10) : value,
        }));
    };

    const handleKeywordsChange = (newKeywords: string[]) => {
      setForm(prev => ({ ...prev, keywords: newKeywords }));
    };

    const handleSubmit = async () => {
        setIsSaving(true);
        setSaveStatus(null);
        let uploadedLogoUrl = form.logo_url;
    
        if (logoFile) {
            const fileExt = logoFile.name.split(".").pop();
            const filePath = `${Date.now()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage.from("logos").upload(filePath, logoFile);
    
            if (uploadError) {
                setSaveStatus({ type: 'error', message: 'Logo upload failed. Please try again.' });
                setIsSaving(false);
                return;
            }
            
            const { data: publicUrlData } = supabase.storage.from("logos").getPublicUrl(filePath);
            uploadedLogoUrl = publicUrlData.publicUrl;
        }

        const finalFormState = { ...form, logo_url: uploadedLogoUrl };
    
        const response = await fetch("/api/save-settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(finalFormState),
        });
    
        const result = await response.json();
        if (!response.ok) {
            setSaveStatus({ type: 'error', message: result.error || "Something went wrong."});
        } else {
            setForm(finalFormState); // Ensure UI state matches saved state
            setSaveStatus({ type: 'success', message: 'Your settings have been saved successfully!' });
        }
        setIsSaving(false);
    };


    return (
      <div className="max-w-4xl mx-auto my-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">

          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Brand Settings</h1>
            <p className="mt-1 text-gray-500">This information helps the AI tailor content specifically to your brand's personality.</p>
          </div>

          {/* Core Identity Section */}
          <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Core Identity</h2>
            <div>
              <label htmlFor="brand_name" className="block text-sm font-medium text-gray-700">Brand Name</label>
              <input type="text" name="brand_name" id="brand_name" value={form.brand_name} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="e.g., BrandDos" />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Brand Description</label>
              <textarea name="description" id="description" value={form.description} onChange={handleChange} rows={4} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="Describe what your business does, its mission, and its values..."></textarea>
            </div>
            <LogoUploader currentLogoUrl={form.logo_url} onFileSelect={setLogoFile} />
          </div>

          {/* AI Tuning Section */}
          <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">AI Generation Tuning</h2>
             <div>
                <label htmlFor="tone" className="block text-sm font-medium text-gray-700">Brand Tone</label>
                <select id="tone" name="tone" value={form.tone} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <option>Friendly</option>
                    <option>Professional</option>
                    <option>Witty</option>
                    <option>Inspirational</option>
                    <option>Authoritative</option>
                </select>
                <p className="mt-2 text-sm text-gray-500">The primary voice the AI should use in its writing.</p>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Keywords</label>
                <KeywordInput value={form.keywords} onChange={handleKeywordsChange} />
                <p className="mt-2 text-sm text-gray-500">Important terms related to your industry or products.</p>
            </div>
             <div>
                <label htmlFor="post_frequency" className="block text-sm font-medium text-gray-700">Weekly Post Frequency ({form.post_frequency})</label>
                <input type="range" min="1" max="7" id="post_frequency" name="post_frequency" value={form.post_frequency} onChange={handleChange} className="mt-1 block w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                 <div className="flex justify-between text-xs text-gray-500 px-1 mt-1">
                    <span>Once a week</span>
                    <span>Daily</span>
                </div>
            </div>
          </div>
          
          {/* Action Bar */}
          <div className="flex items-center justify-end gap-4 pt-4">
              {saveStatus && (
                <div className={cn("flex items-center gap-2 text-sm", saveStatus.type === 'success' ? 'text-green-600' : 'text-red-600')}>
                    {saveStatus.type === 'success' ? <CheckCircle className="w-5 h-5"/> : <AlertCircle className="w-5 h-5"/>}
                    {saveStatus.message}
                </div>
              )}
              <button
                onClick={handleSubmit}
                disabled={isSaving}
                className="inline-flex items-center gap-2 justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {isSaving && <Loader2 className="w-5 h-5 animate-spin" />}
                {isSaving ? "Saving..." : "Save Settings"}
              </button>
          </div>
        </div>
      </div>
    );
};