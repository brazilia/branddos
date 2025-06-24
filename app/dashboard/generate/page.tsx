"use client";

import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
// Import icons for a better user experience
import { Sparkles, Loader2, ImageIcon, AlertTriangle } from "lucide-react";

export default function ImageForm() {
  // --- CORE FUNCTIONALITY (UNCHANGED) ---
  const [userPrompt, setUserPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createBrowserSupabaseClient();

  const handleGenerate = async () => {
    if (!userPrompt?.trim()) {
      setError("Prompt cannot be empty.");
      return;
    }
    setLoading(true);
    setError(null);
    setGeneratedImage(null); // Clear previous image on new generation
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("User not authenticated");

      const response = await fetch("/api/refine-image-prompt", {
        method: "POST",
        body: JSON.stringify({ userPrompt }),
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`API Error: ${errorMessage}`);
      }
      const data = await response.json();
      setGeneratedImage(data.imageUrl || "");
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };
  // --- END OF CORE FUNCTIONALITY ---

  return (
    // 1. Improved Layout: A central card with soft shadows and a modern feel.
    <div className="bg-white max-w-2xl mx-auto my-12 p-6 sm:p-8 rounded-2xl shadow-2xl shadow-slate-200/70 border border-slate-100">
      <div className="space-y-6">
        
        {/* Title for clarity and context */}
        <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">AI Image Studio</h1>
            <p className="text-gray-500 mt-2">Describe an image and let our AI bring your vision to life.</p>
        </div>

        {/* Form elements section */}
        <div className="space-y-4">
          <label htmlFor="prompt-input" className="block text-sm font-medium text-gray-700">
            Your Creative Prompt
          </label>
          {/* 2. Upgraded Input: A textarea is better for longer prompts. */}
          <textarea
            id="prompt-input"
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder="e.g., A minimalist photo of a sleek black coffee mug on a marble countertop, morning light."
            className="w-full h-24 p-4 text-gray-700 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow duration-200 resize-none"
          />

          {/* 3. Upgraded Button: Uses brand colors, an icon, and a clear loading state. */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-x-2 text-white font-semibold px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Image</span>
              </>
            )}
          </button>
        </div>
        
        {/* 4. Clear Error State: A dedicated, styled UI for displaying errors. */}
        {error && (
          <div className="flex items-center gap-x-3 p-3 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200">
            <AlertTriangle className="w-5 h-5 flex-shrink-0"/>
            <div>{error}</div>
          </div>
        )}
        
        <div className="pt-4">
            <hr className="border-slate-200" />
        </div>

        {/* 5. State-driven Result Area: Shows a different UI for initial, loading, and success states. */}
        <div className="w-full aspect-video bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden border border-slate-200">
          {loading && (
            <div className="flex flex-col items-center text-gray-500 animate-pulse">
                <Loader2 className="w-10 h-10 mb-4 animate-spin"/>
                <p className="font-semibold">Conjuring up your masterpiece...</p>
                <p className="text-sm">This can take a moment.</p>
            </div>
          )}
          
          {!loading && !generatedImage && (
             <div className="text-center text-gray-400">
                <ImageIcon className="w-12 h-12 mx-auto mb-2"/>
                <p className="font-medium">Your generated image will appear here</p>
            </div>
          )}

          {generatedImage && (
             <img 
                src={generatedImage} 
                alt="AI generated image based on user prompt" 
                className="w-full h-full object-cover transition-opacity duration-500 animate-fade-in-up"
                style={{animationDuration: '0.5s'}}
             />
          )}
        </div>

      </div>
    </div>
  );
}