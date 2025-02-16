import os
import requests
from supabase import create_client, Client
from typing import Optional
from dotenv import load_dotenv
import time

# Load environment variables
load_dotenv('.env.local')

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

# Initialize Brave Search API
BRAVE_API_KEY = os.getenv("BRAVE_API_KEY")
BRAVE_SEARCH_URL = "https://api.search.brave.com/res/v1/images/search"

def fetch_image_url(name: str) -> Optional[str]:
    """
    Fetch the first image URL from Brave Search for a given name
    """
    headers = {
        "Accept": "application/json",
        "X-Subscription-Token": BRAVE_API_KEY
    }
    
    params = {
        "q": f"{name}",  # Simplified query for testing
        "count": 1
    }
    
    print(f"\nDebug info for {name}:")
    print(f"API Key being used: {BRAVE_API_KEY[:5]}...")
    print(f"Full URL: {BRAVE_SEARCH_URL}?q={params['q']}")
    print(f"Headers: {headers}")
    
    try:
        # Rate limiting - sleep for 1.1 seconds between requests
        time.sleep(1.1)
        
        response = requests.get(
            BRAVE_SEARCH_URL, 
            headers=headers, 
            params=params
        )
        
        print(f"Response status code: {response.status_code}")
        print(f"Response headers: {dict(response.headers)}")
        
        if response.status_code == 403:
            print(f"Authentication error. Please check your Brave API key. Status: {response.status_code}")
            print(f"Response: {response.text}")
            return None
            
        response.raise_for_status()
        
        results = response.json()
        print(f"API Response for {name}:", results)
        
        # Extract URL from the correct location in the response
        if "results" in results and results["results"]:
            first_result = results["results"][0]
            if "properties" in first_result and "url" in first_result["properties"]:
                return first_result["properties"]["url"]
            elif "thumbnail" in first_result and "src" in first_result["thumbnail"]:
                return first_result["thumbnail"]["src"]
        
        print(f"No results found in response for {name}")
        return None
        
    except Exception as e:
        print(f"Error fetching image for {name}: {str(e)}")
        print(f"Full error response: {getattr(e, 'response', {}).text if hasattr(e, 'response') else 'No response'}")
        return None

def update_influencer_image_url(influencer_id: str, image_url: str) -> bool:
    """
    Update the image_url column for an influencer
    """
    try:
        supabase.table("influencers").update(
            {"image_url": image_url}
        ).eq("id", influencer_id).execute()
        return True
    except Exception as e:
        print(f"Error updating image_url for influencer {influencer_id}: {str(e)}")
        return False

def process_all_influencers():
    """
    Process all influencers in the database
    """
    # Verify API key is set and looks valid
    if not BRAVE_API_KEY:
        print("Error: BRAVE_API_KEY is not set in environment variables")
        return
    
    if BRAVE_API_KEY == "your_brave_api_key_here":
        print("Error: BRAVE_API_KEY appears to be the placeholder value. Please update with your actual API key")
        return
        
    print(f"Using Brave API key: {BRAVE_API_KEY[:10]}...")
    
    # Test with a known good search term
    print("\nTesting API with a simple query...")
    test_result = fetch_image_url("Barack Obama")
    if test_result is None:
        print("Initial API test failed. Please check your API key and connection.")
        return
    else:
        print("Initial API test successful!")
    
    # Fetch all influencers from the database that don't have an image_url yet
    response = supabase.table("influencers").select("id, name").is_("image_url", None).execute()
    
    total = len(response.data)
    print(f"Found {total} influencers to process")
    
    for i, influencer in enumerate(response.data, 1):
        influencer_id = influencer["id"]
        name = influencer["name"]
        
        print(f"\nProcessing {i}/{total}: {name}")
        
        # Skip if name is empty
        if not name:
            print(f"Skipping {name} - empty name")
            continue
            
        # Fetch image URL from Brave Search
        image_url = fetch_image_url(name)
        if not image_url:
            print(f"No image URL found for {name}")
            continue
            
        # Update the database with the image URL
        success = update_influencer_image_url(influencer_id, image_url)
        if success:
            print(f"Successfully updated image URL for {name}")
        else:
            print(f"Failed to update image URL for {name}")

if __name__ == "__main__":
    process_all_influencers()
