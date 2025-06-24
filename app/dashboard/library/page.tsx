"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
// Import icons for a better UI
import { Image as ImageIcon, Download, BookImage, CircleDashed } from "lucide-react";

// --- Step 1: Types and Updated State ---
type LibraryImage = {
  url: string;
  name: string;
  createdAt: string;
};

// Helper to format date groups
const formatDateGroup = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

// Skeleton component for a polished loading state
const ImageCardSkeleton = () => (
    <div className="w-full aspect-square bg-gray-200 rounded-xl animate-pulse"></div>
);

export default function BrandLibraryPage() {
    const [images, setImages] = useState<LibraryImage[]>([]);
    const [loading, setLoading] = useState(true);

    // --- Step 1: Updated useEffect to fetch metadata ---
    useEffect(() => {
        // ... Paste the updated useEffect logic from above here ...
        const fetchImages = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const user_id = session?.user?.id;
                if (!user_id) throw new Error("User not authenticated.");

                const folder = `${user_id}/`;
                const { data: files, error } = await supabase.storage
                    .from("generated-images")
                    .list(folder, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

                if (error) throw error;
                if (!files || files.length === 0) {
                    setImages([]);
                    setLoading(false);
                    return;
                }

                const imageUrls = await Promise.all(
                    files.map(async (file) => {
                        const { data } = await supabase.storage
                            .from("generated-images")
                            .createSignedUrl(`${folder}${file.name}`, 3600);
                        
                        if (data?.signedUrl) {
                            return {
                                url: data.signedUrl,
                                name: file.name,
                                createdAt: file.created_at,
                            };
                        }
                        return null;
                    })
                );

                setImages(imageUrls.filter(Boolean) as LibraryImage[]);
            } catch (error: any) {
                console.error("Error fetching library images:", error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchImages();
    }, []);

    // Group images by date for rendering
    const groupedImages = images.reduce((acc, image) => {
        const groupKey = formatDateGroup(image.createdAt);
        if (!acc[groupKey]) acc[groupKey] = [];
        acc[groupKey].push(image);
        return acc;
    }, {} as Record<string, LibraryImage[]>);


    return (
        <div className="max-w-7xl mx-auto my-12 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-x-3 mb-8">
                <BookImage className="w-8 h-8 text-gray-500" />
                <h1 className="text-3xl font-bold text-gray-800">Your Brand Library</h1>
            </div>

            {loading && (
                // 4. Elegant Loading Skeleton
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {Array.from({ length: 8 }).map((_, i) => <ImageCardSkeleton key={i} />)}
                </div>
            )}
            
            {!loading && images.length === 0 && (
                // 5. Empty State with a Call to Action
                <div className="text-center py-16 px-6 mt-8 border-2 border-dashed border-gray-200 rounded-xl">
                    <CircleDashed className="w-12 h-12 mx-auto text-gray-300" />
                    <h3 className="mt-4 text-xl font-semibold text-gray-700">Your Library is Empty</h3>
                    <p className="mt-1 text-gray-500">Start by creating your first asset in the generation studio.</p>
                    {/* Optional: Add a Link button to the generation page */}
                    {/* <Link href="/generate">
                        <button className="mt-6 ...">Go to Studio</button>
                    </Link> */}
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
                                {groupImages.map((image) => (
                                    // 3. Enhanced Image Card
                                    <div key={image.url} className="group relative aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-slate-200/80 transition-all duration-300 hover:-translate-y-1">
                                        <img
                                            src={image.url}
                                            alt={image.name}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        {/* Overlay with actions on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                                                <p className="text-sm font-semibold truncate" title={image.name}>
                                                    {image.name.replace(/\.[^/.]+$/, "")}
                                                </p>
                                                <a
                                                    href={image.url + '&download=true'} // Force download
                                                    download={image.name}
                                                    className="absolute top-3 right-3 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full"
                                                    aria-label="Download image"
                                                >
                                                    <Download className="w-5 h-5"/>
                                                </a>
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