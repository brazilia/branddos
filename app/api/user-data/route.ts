// app/api/user-data/route.ts
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
    try {
        // THE FIX: Use the single, modern, cookie-based client for all operations.
        const supabase = createRouteHandlerClient({ cookies });
        
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized: Invalid token.' }, { status: 401 });
        }

        // Fetch both post history and library images in parallel for speed.
        const [postsRes, filesRes] = await Promise.all([
            // Reading from 'posts' to match what the 'generate' API writes to.
            supabase.from('posts').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
            // The same client is already authenticated to list storage files.
            supabase.storage.from('generated-images').list(user.id, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } })
        ]);
        
        if (postsRes.error) throw postsRes.error;
        if (filesRes.error) throw filesRes.error;

        // Process files to get temporary, secure URLs for display.
        const libraryImages = await Promise.all(
            (filesRes.data || []).map(async (file) => {
                const { data } = await supabase.storage
                    .from('generated-images')
                    .createSignedUrl(`${user.id}/${file.name}`, 3600); // URL is valid for 1 hour
                
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
        
        return NextResponse.json({ 
            // Return 'posts' instead of 'history' for consistency.
            posts: postsRes.data,
            library: libraryImages.filter(Boolean),
        });

    } catch (error: any) {
        console.error("User Data Fetch Error:", error);
        return NextResponse.json({ error: 'Failed to fetch user data', details: error.message }, { status: 500 });
    }
}