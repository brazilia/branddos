// app/api/user-data/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Authorization header is missing.' }, { status: 401 });
        }
        const accessToken = authHeader.split(' ')[1];

        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
        
        // This is a special client instance authenticated as the user for Storage calls.
        const supabaseAuthed = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
            global: { headers: { Authorization: `Bearer ${accessToken}` } }
        });
        
        const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized: Invalid token.' }, { status: 401 });
        }

        // Fetch both history and library images in parallel
        const [historyRes, filesRes] = await Promise.all([
            supabase.from('history').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
            supabaseAuthed.storage.from('generated-images').list(user.id, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } })
        ]);
        
        if (historyRes.error) throw historyRes.error;
        if (filesRes.error) throw filesRes.error;

        // Process files to get signed URLs
        const libraryImages = await Promise.all(
            (filesRes.data || []).map(async (file) => {
                const { data } = await supabaseAuthed.storage
                    .from('generated-images')
                    .createSignedUrl(`${user.id}/${file.name}`, 3600); // 1 hour expiry
                
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
            history: historyRes.data,
            library: libraryImages.filter(Boolean),
        });

    } catch (error: any) {
        console.error("User Data Fetch Error:", error);
        return NextResponse.json({ error: 'Failed to fetch user data', details: error.message }, { status: 500 });
    }
}