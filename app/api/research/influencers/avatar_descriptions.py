import os
from groq import Groq
from supabase import create_client, Client

# Initialize Supabase client
supabase: Client = create_client(
    os.environ.get("SUPABASE_URL", ""),
    os.environ.get("SUPABASE_SERVICE_KEY", "")
)

# Initialize Groq client
groq_client = Groq(
    api_key=os.environ.get("GROQ_API_KEY", "")
)

def get_image_description(image_url: str) -> str:
    """Get description of an image using Groq's vision model"""
    try:
        completion = groq_client.chat.completions.create(
            model="llama-3.2-11b-vision-preview",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text", 
                            "text": "Describe the person in this image -- their gender, race, facial features, age, etc. No need to describe the image or their clothing, just the person themselves and the vibe they give off. Don't start with 'The person in the image is'. Just directly give the description. Keep it to 1-2 sentences. Example: 'A young woman with long brown hair and blue eyes, wearing a white t-shirt and blue jeans. She has a friendly and approachable smile.'"
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": image_url
                            }
                        }
                    ]
                }
            ],
            temperature=1,
            max_completion_tokens=1024,
            top_p=1,
            stream=False,
            stop=None,
        )
        return completion.choices[0].message.content
    except Exception as e:
        print(f"Error getting description for {image_url}: {str(e)}")
        return ""

def update_avatar_descriptions():
    """Fetch avatars without descriptions and update them using Groq vision"""
    try:
        # Fetch rows where description is null or empty
        response = supabase.table('avatars').select('avatar_id, image_url').execute()
        
        for row in response.data:
            if row['image_url']:
                print(f"Processing avatar {row['avatar_id']} with image URL: {row['image_url']}")
                
                # Get description from Groq
                description = get_image_description(row['image_url'])
                
                if description:
                    # Update the description in the database
                    supabase.table('avatars').update({
                        'description': description
                    }).eq('avatar_id', row['avatar_id']).execute()
                    
                    print(f"Updated description for avatar {row['avatar_id']}")
                    print(f"Description: {description}")
                else:
                    print("No description generated")
            else:
                print("No image URL found for the first row")
        else:
            print("No avatars found in the database")
            
    except Exception as e:
        print(f"Error updating avatar descriptions: {str(e)}")

if __name__ == "__main__":
    update_avatar_descriptions()
