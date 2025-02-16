import requests
from typing import List, Dict
from supabase import create_client
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
supabase = create_client(supabase_url, supabase_key)

def get_heygen_avatars() -> List[Dict[str, str]]:
    """
    Fetches avatars from HeyGen API and processes them to get unique avatars
    (first instance of each person only).
    
    Returns:
        List of dicts containing avatar_id, name (first word only), gender, and image_url
    """
    url = "https://api.heygen.com/v2/avatars"
    
    # Add HeyGen API key to headers
    headers = {
        "X-Api-Key": os.getenv("HEYGEN_API_KEY")
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        data = response.json()
        if not data or 'data' not in data or 'avatars' not in data['data']:
            return []
        
        seen_people = set()
        unique_avatars = []
        
        for avatar in data['data']['avatars']:
            # Get the first word of the avatar name as the person identifier
            person_name = avatar['avatar_name'].split()[0]
            
            # Skip if we've already seen this person
            if person_name in seen_people:
                continue
                
            # Add to our processed list and mark as seen
            seen_people.add(person_name)
            unique_avatars.append({
                'avatar_id': avatar['avatar_id'],
                'name': person_name,  # Only store the first word
                'gender': avatar['gender'],
                'image_url': avatar['preview_image_url']
            })
        
        return unique_avatars
        
    except requests.RequestException as e:
        print(f"Error fetching avatars: {str(e)}")
        return []

def update_supabase_avatars(avatars: List[Dict[str, str]]) -> None:
    """
    Updates the avatars table in Supabase with the provided avatar data.
    Upserts the data to avoid duplicates.
    """
    try:
        # Specify the columns explicitly
        result = supabase.table('avatars').upsert(
            [
                {
                    'avatar_id': avatar['avatar_id'],
                    'name': avatar['name'],
                    'gender': avatar['gender'],
                    'image_url': avatar['image_url']
                }
                for avatar in avatars
            ]
        ).execute()
        
        print(f"Successfully updated {len(avatars)} avatars in Supabase")
        return result
        
    except Exception as e:
        print(f"Error updating Supabase: {str(e)}")
        return None

if __name__ == "__main__":
    # Test the functions
    avatars = get_heygen_avatars()
    for avatar in avatars:
        print(f"Avatar ID: {avatar['avatar_id']}, Name: {avatar['name']}, Gender: {avatar['gender']}, Image URL: {avatar['image_url']}")
    
    # Update Supabase with the fetched avatars
    if avatars:
        update_supabase_avatars(avatars)
