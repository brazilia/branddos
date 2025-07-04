"use client";

import { useEffect, useState } from "react";
import { BookImage, CircleDashed, Download, Loader2 } from "lucide-react";
import Link from 'next/link';

// --- Type Definition ---
type LibraryImage = {
  url: string;
  name: string;
  createdAt: string;
};

// --- Helper Function ---
const formatDateGroup = (dateString: string): string => {
    // Guard clause for safety in case of bad data
    if (!dateString) return "Unknown Date";

    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

// --- Skeleton Component for Loading State ---
const ImageCardSkeleton = () => (
    <div className="w-full aspect-square bg-gray-200 rounded-xl animate-pulse"></div>
);

// --- Main Page Component ---
export default function BrandLibraryPage() {
    const [images, setImages] = useState<LibraryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/user-data');
                if (!response.ok) {
                    throw new Error('Failed to fetch library data.');
                }
                const data = await response.json();
                setImages(data.library || []);
            } catch (error: any) {
                console.error("Error fetching library data:", error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDownload = async (imageUrl: string, imageName: string) => {
        setDownloading(imageName);
        try {
            const response = await fetch(imageUrl);
            if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
            
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.setAttribute('download', imageName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Download failed:", error);
            alert("Sorry, the download failed. Please refresh the page and try again.");
        } finally {
            setDownloading(null);
        }
    };

    // Correctly typed reduce function to group images by date
    const groupedImages = images.reduce((acc, image) => {
        const groupKey = formatDateGroup(image.createdAt);
        if (!acc[groupKey]) {
            acc[groupKey] = [];
        }
        acc[groupKey].push(image);
        return acc; // This return statement is crucial
    }, {} as Record<string, LibraryImage[]>);


    return (
        <div className="max-w-7xl mx-auto my-12 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-x-3 mb-8">
                <BookImage className="w-8 h-8 text-gray-500" />
                <h1 className="text-3xl font-bold text-gray-800">Your Brand Library</h1>
            </div>

            {loading && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {Array.from({ length: 8 }).map((_, i) => <ImageCardSkeleton key={i} />)}
                </div>
            )}
            
            {!loading && images.length === 0 && (
                <div className="text-center py-16 px-6 mt-8 border-2 border-dashed border-gray-200 rounded-xl bg-slate-50">
                    <CircleDashed className="w-12 h-12 mx-auto text-gray-300" />
                    <h3 className="mt-4 text-xl font-semibold text-gray-700">Your Library is Empty</h3>
                    <p className="mt-1 text-gray-500">Generated images will appear here.</p>
                    <Link href="/generate-image">
                        <button className="mt-6 font-semibold text-white px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-600 hover:opacity-90 transition-opacity">
                            Go to Image Studio
                        </button>
                    </Link>
                </div>
            )}

            {!loading && images.length > 0 && (
                <div className="space-y-12">
                    {Object.entries(groupedImages).map(([groupTitle, groupImages]) => (
                        <div key={groupTitle}>
                            <h2 className="text-xl font-semibold text-gray-700 pb-2 mb-4 border-b border-gray-200">
                                {groupTitle}
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                                {groupImages.map((image: LibraryImage) => (
                                    <div key={image.url} className="group relative aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-slate-200/80 transition-all duration-300 hover:-translate-y-1">
                                        <img
                                            src={image.url}
                                            alt={image.name}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                                                <p className="text-sm font-semibold truncate" title={image.name}>
                                                    {image.name.replace(/\.[^/.]+$/, "")}
                                                </p>
                                                <button
                                                    onClick={() => handleDownload(image.url, image.name)}
                                                    disabled={downloading === image.name}
                                                    className="absolute top-3 right-3 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full disabled:opacity-50 disabled:cursor-wait"
                                                    aria-label="Download image"
                                                >
                                                    {downloading === image.name ? (
                                                        <Loader2 className="w-5 h-5 animate-spin"/>
                                                    ) : (
                                                        <Download className="w-5 h-5"/>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}