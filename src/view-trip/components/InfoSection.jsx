import { useState, useEffect } from 'react';
import { IoIosSend } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5"; // Import location icon
import { createClient } from "pexels"; // Import Pexels client
import placeImage from '../place.png'; // Placeholder image

// Define a placeholder for photos as fallback
const PHOTO_REF_URL = 'https://via.placeholder.com/1000?text=Photo+Not+Available';

// Create Pexels client using your API key
const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY; // Use environment variable for the Pexels API key
const client = createClient(PEXELS_API_KEY); // Initialize Pexels client

function InfoSection({ trip }) {
  const [photoUrl, setPhotoUrl] = useState(PHOTO_REF_URL);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlacePhoto = async () => {
      if (!trip || !trip.userSelection || !trip.userSelection.location) return;

      const query = trip.userSelection.location?.display_name;

      // Query for a general photo based on the location's name
      let searchQuery = `${query} city, landmarks, tourism`; // More generalized search

      try {
        setLoading(true);
        // Fetch high-quality photo from Pexels based on the location query
        const photos = await client.photos.search({ query: searchQuery, per_page: 1 });

        if (photos?.photos?.length > 0) {
          // Set the first image from Pexels API response
          setPhotoUrl(photos.photos[0].src.large); // Use the 'large' quality image
        } else {
          // Fallback if no images are found
          setPhotoUrl(PHOTO_REF_URL); // Placeholder if no relevant images are found
        }
      } catch (error) {
        console.error('Error fetching place photo:', error.message);
        setPhotoUrl(PHOTO_REF_URL); // Use the placeholder in case of an error
        setError('Error fetching photo'); // Set error state
      } finally {
        setLoading(false);
      }
    };

    fetchPlacePhoto();
  }, [trip]);

  if (!trip || !trip.userSelection) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col justify-start items-center h-screen bg-gradient-to-b from-gray-100 to-gray-400"> {/* Gradient background */}
      <div className="relative w-full flex flex-col justify-center items-center">
        {/* Displaying the loading spinner or message while fetching the image */}
        {loading && (
          <div className="absolute top-0 left-0 w-full h-full bg-opacity-50 bg-black flex justify-center items-center text-white">
            {/* Improved loading spinner */}
            <div className="animate-spin border-t-4 border-white border-8 w-16 h-16 rounded-full"></div>
            <span className="mt-4 text-white text-xl">Fetching image...</span>
          </div>
        )}

        <img
          src={photoUrl ? photoUrl : placeImage}
          alt="Trip Placeholder"
          className={`h-[470px] w-full object-cover rounded-xl mb-4 transition-opacity duration-700 ease-in-out ${loading ? 'opacity-0' : 'opacity-100'}`}
        />
        
        {error && (
          <div className="absolute top-0 left-0 w-full h-full bg-opacity-50 bg-black flex justify-center items-center text-white">
            {error}
          </div>
        )}

        <button className="absolute bottom-[-55px] right-8 p-2 px-4 bg-black text-white rounded-full hover:bg-gray-800 flex items-center gap-2">
          <IoIosSend />
          Send
        </button>
      </div>
      <div className="w-full flex flex-col items-start px-4 mt-4">
        <div className="flex items-center gap-2 mb-4">
          <IoLocationSharp className="text-xl text-gray-600" />
          <h2 className='font-bold text-2xl'>
            {trip.userSelection.location?.display_name || 'Location not available'}
          </h2>
        </div>
        <div className='flex gap-5 justify-start'>
          <h2 className="p-2 px-4 bg-gray-200 rounded-full text-gray-600 text-xs md:text-md">
            📆 {trip.userSelection.days || 'Days not specified'} Day
          </h2>
          <h2 className="p-2 px-4 bg-gray-200 rounded-full text-gray-600 text-xs md:text-md">
            💰 {trip.userSelection.budget ? `${trip.userSelection.budget} Budget` : 'Budget not specified'}
          </h2>
          <h2 className="p-2 px-4 bg-gray-200 rounded-full text-gray-600 text-xs md:text-md">
            🥂 No. Of Travelers: {trip.userSelection.traveler || 'Travelers not specified'}
          </h2>
        </div>
      </div>
    </div>
  );
}

export default InfoSection;
