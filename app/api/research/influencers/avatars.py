import requests
from typing import List, Dict
from supabase import create_client
import os

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
supabase = create_client(supabase_url, supabase_key)

def get_heygen_avatars() -> List[Dict[str, str]]:
    """
    Fetches avatars from HeyGen API and processes them to get unique avatars
    (first instance of each person only).
    
    Returns:
        List of dicts containing avatar_id, name, and gender for unique avatars
    """
    url = "https://api.heygen.com/v2/avatars"
    
    try:
        response = requests.get(url)
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
                'name': avatar['avatar_name'],
                'gender': avatar['gender']
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
        # Upsert the avatars data
        result = supabase.table('avatars').upsert(
            avatars,
            on_conflict='avatar_id'  # Assuming avatar_id is the primary key
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
        print(f"Avatar ID: {avatar['avatar_id']}, Name: {avatar['name']}, Gender: {avatar['gender']}")
    
    # Update Supabase with the fetched avatars
    update_supabase_avatars(avatars)
