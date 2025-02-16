import { NextResponse } from 'next/server'
import { getSupabase } from "@/supabase/utils";

export async function GET() {
  try {
    const supabase = getSupabase();

    const { data: scripts, error: scriptsError } = await supabase
      .from('scripts')
      .select('*')
      .not('processed_video_link', 'is', null)

    if (scriptsError) throw scriptsError

    const uniqueProductLinks = [...new Set(scripts.map(script => script.product_link))]

    const { data: research, error: researchError } = await supabase
      .from('research')
      .select('*')
      .in('product_link', uniqueProductLinks)

    if (researchError) throw researchError

    const { data: bRoll, error: bRollError } = await supabase
      .from('b_roll')
      .select('*')
      .in('product_link', uniqueProductLinks)

    if (bRollError) throw bRollError

    const response = {
      scripts,
      research,
      bRoll,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in gallery route:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
