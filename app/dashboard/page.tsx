"use client";

import { useState } from "react";
// We no longer need the supabase client on the frontend for this component!
import { Sparkles, Copy, RefreshCw } from "lucide-react";

export default function DashboardPage() {
  const [type, setType] = useState("Instagram Caption");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setOutput("");
    setError("");

    try {
      // THE FIX: Simplified fetch call.
      // No more getSession(), no more access_token, no more Authorization header.
      // The auth helpers handle everything automatically with cookies.
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

  // ... the rest of your component (copyToClipboard, handleKeyPress, and all the JSX) is perfect and requires NO changes.
  
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading && input) {
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-stone-100 via-amber-50 to-orange-50">
      
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <h1 className="text-4xl font-black text-stone-800 mb-2">Content Generator</h1>
        <p className="text-stone-600 text-lg">Create engaging social media content in seconds</p>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          
          {/* Input Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-stone-200 shadow-lg">
            <h2 className="text-2xl font-bold text-stone-800 mb-8">Input</h2>
            
            <div className="space-y-6">
              {/* Post Type Selector */}
              <div>
                <label className="block font-semibold text-stone-700 mb-3">Post Type</label>
                <select
                  className="w-full px-4 py-4 rounded-2xl border border-stone-300 font-medium transition-all duration-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option>Instagram Caption</option>
                  <option>Tweet</option>
                  <option>Reply to Comment</option>
                  <option>LinkedIn Post</option>
                  <option>Facebook Post</option>
                  <option>YouTube Description</option>
                  <option>TikTok Caption</option>
                </select>
              </div>

              {/* Input Field */}
              <div>
                <label className="block font-semibold text-stone-700 mb-3">Your Idea</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-4 rounded-2xl border border-stone-300 font-medium transition-all duration-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white resize-none"
                  placeholder="e.g., announce new product drop, share behind the scenes, promote upcoming event..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={loading || !input}
                className="w-full py-4 rounded-2xl font-bold text-lg text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center space-x-3 shadow-lg"
                style={{ 
                  background: loading ? 'rgba(120, 113, 108, 0.7)' : 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                }}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Content</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-stone-200 shadow-lg">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-stone-800">Generated Content</h2>
              {output && (
                <button
                  onClick={copyToClipboard}
                  className="p-3 rounded-2xl transition-all duration-300 hover:scale-110 bg-stone-100 hover:bg-emerald-100 border border-stone-200"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <div className="w-5 h-5 text-emerald-600 font-bold flex items-center justify-center">✓</div>
                  ) : (
                    <Copy className="w-5 h-5 text-stone-600" />
                  )}
                </button>
              )}
            </div>
            
            {/* Error Display */}
            {error && (
              <div className="p-6 rounded-2xl mb-6 border-l-4 border-red-500 bg-red-50">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Output Display */}
            {output ? (
              <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-stone-600 uppercase tracking-wider px-3 py-1 rounded-full bg-stone-200">
                    {type}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-bold text-white bg-emerald-500">
                    Ready to use
                  </span>
                </div>
                <p className="text-stone-800 leading-relaxed whitespace-pre-wrap font-medium">
                  {output}
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50">
                <div className="text-center">
                  <Sparkles className="w-12 h-12 text-stone-400 mx-auto mb-4" />
                  <p className="text-stone-600 font-medium">
                    Your generated content will appear here
                  </p>
                  <p className="text-stone-500 text-sm mt-2">
                    Enter your idea and click generate to get started
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-16 bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-stone-200 shadow-lg">
          <h3 className="text-xl font-bold text-stone-800 mb-6">💡 Quick Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-stone-800">Be Specific</h4>
              <p className="text-stone-600 text-sm">Include details like target audience, tone, or specific features to mention for better results.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-stone-800">Add Context</h4>
              <p className="text-stone-600 text-sm">Mention your industry, brand personality, or campaign goals for more targeted content.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-stone-800">Experiment</h4>
              <p className="text-stone-600 text-sm">Try different post types and styles to discover what resonates best with your audience.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}