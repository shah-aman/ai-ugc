import { NextResponse } from 'next/server';
import { getSupabase } from '@/supabase/utils';

export async function GET(request: Request) {
    try {
        const supabase = getSupabase();
        const { data: influencers, error } = await supabase
            .from('influencers')
            .select('*');

        if (error) {
            return NextResponse.json(
                { error: 'Failed to fetch influencers' },
                { status: 500 }
            );
        }

        return NextResponse.json(influencers);
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}