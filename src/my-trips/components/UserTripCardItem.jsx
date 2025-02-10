

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoIosSend } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5"; // Import location icon
import placeImage from '../place.png'; // Placeholder image
import { createClient } from "pexels"; // Import Pexels client

// Define a placeholder for photos as fallback
const PHOTO_REF_URL = 'https://via.placeholder.com/1000?text=Photo+Not+Available';

// Create Pexels client using your API key
const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY; 
const client = createClient(PEXELS_API_KEY); 

function UserTripCardItem({ trip, onDelete }) {
  const [photoUrl, setPhotoUrl] = useState(PHOTO_REF_URL);
  const [loading, setLoading] = useState(true); // Loading state for image fetching
  const [error, setError] = useState(null); // Error state for fetching photo
  const [showModal, setShowModal] = useState(false); // Modal state for deletion confirmation

  useEffect(() => {
    const fetchPlacePhoto = async () => {
      const location = trip?.userSelection?.location?.display_name;
      if (!location) return;

      try {
        setLoading(true); // Set loading to true while fetching the photo
        // Fetch the photo using Pexels API
        const photos = await client.photos.search({ query: location, per_page: 1 });

        if (photos?.photos?.length > 0) {
          // Set the fetched image URL
          setPhotoUrl(photos.photos[0].src.large); // Use large quality image
        } else {
          // Fallback if no relevant images are found
          setPhotoUrl(PHOTO_REF_URL);
        }
      } catch (error) {
        console.error('Error fetching place photo:', error.message);
        setPhotoUrl(PHOTO_REF_URL); // Use placeholder if there’s an error
        setError('Error fetching photo');
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchPlacePhoto();
  }, [trip]);

  const handleDelete = () => {
    setShowModal(true); // Show the confirmation modal when delete is clicked
  };

  const confirmDelete = () => {
    onDelete(trip.id);
    setShowModal(false); // Close the modal after confirming the deletion
  };

  const cancelDelete = () => {
    setShowModal(false); // Close the modal if the user cancels the deletion
  };

  return (
    <div className="relative flex flex-col items-center bg-white shadow-xl rounded-lg overflow-hidden mb-6 hover:scale-105 transform transition-all">
      <Link to={`/view-trip/${trip.id}`} className="w-full">
        <div className="relative">
          {/* Displaying the loading spinner or message while fetching the image */}
          {loading && (
            <div className="absolute top-0 left-0 w-full h-full bg-opacity-50 bg-black flex justify-center items-center text-white">
              <div className="animate-spin border-t-4 border-white border-8 w-16 h-16 rounded-full"></div>
            </div>
          )}

          {/* Image to show, fallback to placeholder */}
          <img
            src={photoUrl || placeImage}
            alt={trip.userSelection?.location?.display_name || 'Trip Location'}
            className={`h-48 w-full object-cover rounded-t-lg mb-4 ${loading ? 'opacity-50' : 'opacity-100'}`}
          />
        </div>

        <div className="w-full flex flex-col items-start px-4 mt-4">
          <h2 className="font-semibold text-lg text-gray-800">
            {trip.userSelection?.location?.display_name || 'Location not available'}
          </h2>
          <p className="text-sm text-gray-500">
            {trip.userSelection?.days ? `${trip.userSelection.days} Days trip` : 'Duration not available'} with {trip.userSelection?.budget || 'Budget not available'}
          </p>
        </div>
      </Link>

      {/* Delete button */}
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 bg-red-500 text-white px-3 py-2 rounded-full hover:bg-red-600 transition-all"
      >
        Delete
      </button>

      {/* Confirmation modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full text-center shadow-lg">
            <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
            <p className="text-gray-600 mb-6">
              Do you really want to delete <span className="font-semibold">{trip.userSelection?.location?.display_name || 'this trip'}</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                onClick={confirmDelete}
              >
                Delete
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                onClick={cancelDelete}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserTripCardItem;
