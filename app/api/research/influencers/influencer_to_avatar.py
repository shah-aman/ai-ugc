from supabase import create_client
from openai import OpenAI
import os
from dotenv import load_dotenv
from typing import Dict, List, Optional
from pydantic import BaseModel
from multiprocessing import Pool, cpu_count
from functools import partial

load_dotenv()

# Initialize clients
supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY")
)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class AvatarMatch(BaseModel):
    reasoning: str
    best_match_avatar_id: str
    confidence_score: float

def get_all_avatars() -> List[Dict]:
    """Fetch all avatars and their descriptions from Supabase."""
    response = supabase.table("avatars").select("avatar_id, description").execute()
    return response.data

def get_influencers_without_avatars() -> List[Dict]:
    """Fetch influencers that don't have an avatar assigned yet."""
    response = supabase.table("influencers")\
        .select("id, image_url")\
        .is_("avatar_id", "null")\
        .execute()
    return response.data

def process_single_influencer(influencer: Dict, avatars: List[Dict]) -> Optional[Dict]:
    """Process a single influencer and return the result."""
    print(f"Processing influencer {influencer['id']}...")
    
    try:
        # Create new OpenAI client for each process
        process_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
        avatar_descriptions = "\n".join([
            f"Avatar {avatar['avatar_id']}: {avatar['description']}"
            for avatar in avatars
        ])
        
        prompt = f"""Given the image of this person, analyze their appearance and match them with the most suitable avatar from the following descriptions. Consider facial features, overall appearance, and style:

{avatar_descriptions}"""

        response = process_client.beta.chat.completions.parse(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {"url": influencer['image_url']}
                        }
                    ]
                }
            ],
            response_format=AvatarMatch,
            max_tokens=1000,
            temperature=0.2
        )
        
        match_result = response.choices[0].message.parsed
        print(f"Influencer {influencer['id']} - Match confidence: {match_result.confidence_score}")
        print(f"Influencer {influencer['id']} - Reasoning: {match_result.reasoning}")
        
        return {
            'influencer_id': influencer['id'],
            'avatar_id': match_result.best_match_avatar_id,
            'success': True
        }
    except Exception as e:
        print(f"Error processing influencer {influencer['id']}: {e}")
        return {
            'influencer_id': influencer['id'],
            'success': False,
            'error': str(e)
        }

def update_influencer_avatar(influencer_id: str, avatar_id: str):
    """Update the avatar_id for an influencer in Supabase."""
    # Create new Supabase client for thread safety
    process_supabase = create_client(
        os.getenv("SUPABASE_URL"),
        os.getenv("SUPABASE_SERVICE_KEY")
    )
    process_supabase.table("influencers")\
        .update({"avatar_id": avatar_id})\
        .eq("id", influencer_id)\
        .execute()

def main():
    # Get all avatars and their descriptions
    avatars = get_all_avatars()
    if not avatars:
        print("No avatars found in the database")
        return

    # Get influencers without avatars
    influencers = get_influencers_without_avatars()
    if not influencers:
        print("No influencers found without avatars")
        return

    # Determine number of processes (use 75% of available CPUs)
    num_processes = 8
    print(f"Processing with {num_processes} processes...")

    # Create a partial function with the avatars parameter fixed
    process_func = partial(process_single_influencer, avatars=avatars)

    # Process influencers in parallel
    with Pool(num_processes) as pool:
        results = pool.map(process_func, influencers)

    # Process results and update database
    successful = 0
    failed = 0
    
    for result in results:
        if result['success']:
            update_influencer_avatar(result['influencer_id'], result['avatar_id'])
            successful += 1
            print(f"Updated influencer {result['influencer_id']} with avatar {result['avatar_id']}")
        else:
            failed += 1
            print(f"Failed to process influencer {result['influencer_id']}: {result.get('error', 'Unknown error')}")

    print(f"\nProcessing complete:")
    print(f"Successfully processed: {successful}")
    print(f"Failed to process: {failed}")

if __name__ == "__main__":
    main()
