# TourGuideAI

**TourGuideAI** is an AI-powered travel assistant that helps you plan the perfect trip based on your preferences. It provides hotel and itinerary recommendations tailored to your travel details, including your destination, trip duration, budget, and travel companions. Powered by **Gemini AI**, it suggests personalized travel plans and integrates **OpenStreetMap** for showing hotel locations and places of interest, along with real-time hotel prices and ratings. Additionally, it uses **Firebase** to save user preferences and trip details for future reference.

## Features

- **AI-powered Recommendations**: Uses Gemini AI to generate customized hotel suggestions and an itinerary based on:
  - Destination choice
  - Number of days planned for the trip
  - Budget
  - Travel companions (solo, family, group, etc.)

- **Map Integration**: Displays hotels and places on an interactive map powered by **OpenStreetMap**, giving users a visual guide of nearby attractions and hotels.

- **Hotel Prices & Ratings**: Provides up-to-date hotel prices and ratings to help you choose the best options according to your preferences.

- **Itinerary Suggestions**: Based on your trip duration and preferences, it offers suggested itineraries for places to visit and activities to do during your stay.

- **Firebase Integration**: Saves user trip details, preferences, and recommendations in **Firebase** for easy access and future reference.

## Technologies Used

- **Gemini AI**: For generating personalized hotel recommendations and itineraries.
- **OpenStreetMap**: For integrating interactive maps to show hotel locations and nearby places.
- **React**: For building the frontend of the application.
- **Firebase**: For storing and managing user data (trip details, preferences, hotel recommendations, etc.).

## How It Works

1. **User Input**: Users input details such as:
   - Destination
   - Number of days
   - Budget
   - Type of travel companions (e.g., solo, family, friends)

2. **Gemini AI**: Based on the user’s preferences, Gemini AI processes this data and suggests:
   - Hotels that match the budget and location.
   - Suggested itinerary for the trip, including activities and attractions.

3. **Hotel Details**: The app fetches real-time hotel data, including:
   - Hotel names, prices, and ratings.
   - Interactive map to show hotel locations and nearby places of interest.

4. **Firebase**: The trip details and recommendations are saved in Firebase, allowing users to view and manage their saved trips.

5. **Interactive Map**: The map shows:
   - Hotel locations.
   - Points of interest (restaurants, attractions, etc.).
   - A user-friendly interface to explore the trip's destination visually.

## Setup

To run this project locally, follow these steps:

### Prerequisites

- **Node.js**: Ensure that [Node.js](https://nodejs.org/) is installed on your machine.
- **npm**: npm comes bundled with Node.js.
- **API Keys**:
  - **Gemini AI API** for generating hotel recommendations and itineraries.
  - **OpenStreetMap API** for fetching map data.
  - **Firebase** project credentials to connect Firebase to your app.

### Clone the Repository

```bash
git clone https://github.com/Rahul190556/TourGuideAI.git
cd TourGuideAI


[Tour Guide AI](https://www.loom.com/share/aa45931a44aa45cf9ceb031adbd9344d?sid=6f4ca45d-ea28-4660-81ab-2d52c65ff1ae)

