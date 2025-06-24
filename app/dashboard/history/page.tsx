"use client";
import { useEffect, useState } from "react";
// Import icons for a better UI
import { Trash2, History as HistoryIcon, ImageIcon, FileTextIcon, Loader2, AlertTriangle, ChevronDown } from "lucide-react";

// Helper component for truncating text
const TruncatedText = ({ text, initialLength = 100 }: { text: string; initialLength?: number }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    if (text.length <= initialLength) return <p className="text-gray-700">{text}</p>;
  
    return (
        <div>
            <p className="text-gray-700">
                {isExpanded ? text : `${text.slice(0, initialLength)}...`}
            </p>
            <button onClick={() => setIsExpanded(!isExpanded)} className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 mt-1 flex items-center">
                {isExpanded ? "Show less" : "Show more"} <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
        </div>
    );
};

// Skeleton component for a polished loading state
const HistoryCardSkeleton = () => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 animate-pulse">
        <div className="flex justify-between items-start">
            <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded-full w-24"></div>
                <div className="h-5 bg-gray-200 rounded-full w-48"></div>
                <div className="h-5 bg-gray-200 rounded-full w-64"></div>
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
        </div>
    </div>
);


export default function HistoryPage() {
    // --- CORE FUNCTIONALITY (UNCHANGED) ---
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch("/api/history", { method: "GET", credentials: "include" });
                if (!res.ok) {
                    const { error } = await res.json();
                    throw new Error(error || "Failed to fetch history");
                }
                const { history } = await res.json();
                setHistory(history);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const handleDelete = async (postId: string) => {
        // Confirmation dialog for better UX
        if (!window.confirm("Are you sure you want to permanently delete this item?")) return;
        
        const res = await fetch("/api/delete", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ postId }) });
        if (!res.ok) {
            const { error } = await res.json();
            alert("Failed to delete: " + error);
            return;
        }
        setHistory((prev) => prev.filter((item: any) => item.id !== postId));
    };
    // --- END OF CORE FUNCTIONALITY ---

    return (
        <div className="max-w-4xl mx-auto my-12 px-4">
            <div className="flex items-center gap-x-3 mb-8">
                <HistoryIcon className="w-8 h-8 text-gray-500" />
                <h1 className="text-3xl font-bold text-gray-800">Your Generation History</h1>
            </div>

            {loading && (
                <div className="space-y-4">
                    <HistoryCardSkeleton />
                    <HistoryCardSkeleton />
                    <HistoryCardSkeleton />
                </div>
            )}
            
            {error && (
                <div className="flex items-center gap-x-3 p-4 text-red-700 bg-red-100 rounded-lg border border-red-200">
                    <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                    <div>
                        <h3 className="font-semibold">Failed to load history</h3>
                        <p className="text-sm">{error}</p>
                    </div>
                </div>
            )}

            {!loading && !error && (
                history.length === 0 ? (
                    <div className="text-center py-16 px-6 border-2 border-dashed border-gray-200 rounded-xl">
                        <HistoryIcon className="w-12 h-12 mx-auto text-gray-300" />
                        <h3 className="mt-4 text-xl font-semibold text-gray-700">No History Found</h3>
                        <p className="mt-1 text-gray-500">Your generated images and text will appear here.</p>
                    </div>
                ) : (
                    <ul className="space-y-4">
                        {history.map((item) => (
                            <li key={item.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm transition-shadow hover:shadow-lg">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="space-y-3 flex-1">
                                        {/* Tag for visual type distinction */}
                                        <div className="flex items-center gap-x-2 text-sm font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-flex">
                                            {item.type.toLowerCase().includes('image') ? <ImageIcon className="w-4 h-4" /> : <FileTextIcon className="w-4 h-4" />}
                                            <span>{item.type}</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">Prompt:</p>
                                            <TruncatedText text={item.input} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">Result:</p>
                                            {item.type.toLowerCase().includes('image') ? (
                                                <img src={item.output} alt="Generated History" className="mt-2 w-32 h-32 object-cover rounded-lg border border-gray-200"/>
                                            ) : (
                                                <TruncatedText text={item.output} initialLength={150} />
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Improved delete button */}
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        aria-label="Delete item"
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )
            )}
        </div>
    );
}