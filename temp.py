import requests

# You can use this script to find specific length videos on pexels with a search query I used it as a utility

API_KEY = 'Please_your_key' 
url = 'https://api.pexels.com/videos/search'

# Set the headers for the API request
headers = {
    'Authorization': API_KEY
}

# Define your query parameters
params = {
    'query': 'happy',  # You can specify your search query here
    'per_page': 15  # Number of results per page, adjust as needed
}

# Make the API request
response = requests.get(url, headers=headers, params=params)

# Check if the request was successful
if response.status_code == 200:
    data = response.json()

    # Filter videos with duration <= 8 seconds
    filtered_videos = [video for video in data['videos'] if video['duration'] <= 5]

    # Print or process the filtered videos
    for video in filtered_videos:
        print(f"Video: {video['url']} | Duration: {video['duration']} seconds")
else:
    print(f"Error: {response.status_code}")
