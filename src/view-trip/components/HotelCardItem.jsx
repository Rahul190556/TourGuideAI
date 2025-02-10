import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import placeImage from '../place.png'; // Placeholder image
import { createClient } from 'pexels'; // Import Pexels client

const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY; // Use your environment variable for the API key
const client = createClient(PEXELS_API_KEY); // Create the client using your API key

const OSM_BASE_URL = 'https://www.openstreetmap.org';

function HotelCardItem({ hotel }) {
  const [photoUrl, setPhotoUrl] = useState(placeImage);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch hotel images from Pexels API
  useEffect(() => {
    if (hotel?.HotelName) {
      const fetchHotelImages = async () => {
        const query = `${hotel.HotelName} Hotel`; // Use the hotel name as the query
        try {
          setLoading(true);
          const photos = await client.photos.search({ query, per_page: 1 });
          if (photos?.photos?.length > 0) {
            setPhotoUrl(photos.photos[0].src.medium); // Set the first image result
          }
        } catch (err) {
          setError('Error fetching hotel images');
        } finally {
          setLoading(false);
        }
      };

      fetchHotelImages();
    }
  }, [hotel?.HotelName]);

  const osmMapUrl =
    hotel?.GeoCoordinates?.latitude && hotel?.GeoCoordinates?.longitude
      ? `${OSM_BASE_URL}/?mlat=${hotel.GeoCoordinates.latitude}&mlon=${hotel.GeoCoordinates.longitude}#map=15/${hotel.GeoCoordinates.latitude}/${hotel.GeoCoordinates.longitude}`
      : `${OSM_BASE_URL}`;

  return (
    <Link
      to={osmMapUrl}
      className="hover:scale-105 transition-transform cursor-pointer"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="rounded-lg bg-white shadow-lg p-4">
        <div className="relative">
          <img
            src={photoUrl}
            alt={hotel?.HotelName || 'Hotel'}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          {loading && (
            <div className="absolute top-0 left-0 w-full h-full bg-opacity-50 bg-black flex justify-center items-center text-white">
              Loading...
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="font-medium text-lg">{hotel?.HotelName || 'Unknown Hotel'}</h2>
          <h2 className="text-sm text-gray-500">📍 {hotel?.HotelAddress || 'Address not available'}</h2>
          <h2 className="text-sm text-gray-700">💰 {hotel?.Price || 'Price not available'}</h2>
          <h2 className="text-sm text-yellow-500">⭐ {hotel?.Rating || 'Rating not available'}</h2>
          {hotel?.GeoCoordinates?.latitude && hotel?.GeoCoordinates?.longitude ? (
            <p className="text-sm text-gray-600">
              🌍 Latitude: {Number(hotel.GeoCoordinates.latitude).toFixed(4)}, 
              Longitude: {Number(hotel.GeoCoordinates.longitude).toFixed(4)}
            </p>
          ) : (
            <p className="text-sm text-gray-600">🌍 Location coordinates not available</p>
          )}
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>
    </Link>
  );
}

export default HotelCardItem;
