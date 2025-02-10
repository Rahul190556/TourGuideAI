import { useState, useEffect } from "react";
import { FaMapLocationDot } from "react-icons/fa6";
import { Link } from "react-router-dom";
import placeImage from "../place.png"; // Placeholder image
import { createClient } from "pexels"; // Import Pexels client

const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY; // Use your environment variable for the API key
const client = createClient(PEXELS_API_KEY); // Create the client using your API key

function PlaceCardItem({ place }) {
  const [photoUrl, setPhotoUrl] = useState(placeImage); // Default placeholder image

  // Fetch image from Pexels API using the place name or description
  useEffect(() => {
    if (place?.PlaceName) {
      const fetchImage = async () => {
        const query = place.PlaceName || place.PlaceDetails || "place"; // Fallback if place name is unavailable

        try {
          const photos = await client.photos.search({ query, per_page: 1 }); // Search for photos based on the place name
          if (photos?.photos?.length > 0) {
            // Fetch the medium-sized image from Pexels API response
            setPhotoUrl(photos.photos[0].src.medium);
          }
        } catch (error) {
          console.error("Error fetching image from Pexels API", error);
        }
      };

      fetchImage();
    }
  }, [place?.PlaceName, place?.PlaceDetails]);

  // OpenStreetMap URL construction
  const osmMapUrl =
    place?.GeoCoordinates?.latitude && place?.GeoCoordinates?.longitude
      ? `https://www.openstreetmap.org/?mlat=${place.GeoCoordinates.latitude}&mlon=${place.GeoCoordinates.longitude}#map=15/${place.GeoCoordinates.latitude}/${place.GeoCoordinates.longitude}`
      : `https://www.openstreetmap.org/search?query=${encodeURIComponent(place?.PlaceName || "")}`;

  return (
    <Link to={osmMapUrl} target="_blank" rel="noopener noreferrer" className="block">
      <div className="border rounded-xl p-3 mt-2 flex gap-5 hover:scale-105 transition-all hover:shadow-md cursor-pointer">
        <img
          src={photoUrl}
          alt={place?.PlaceName || "Place"}
          className="w-[130px] h-[130px] rounded-xl object-cover"
        />
        <div>
          <h2 className="font-bold text-lg">{place?.PlaceName || "Unknown Place"}</h2>
          <p className="text-sm text-gray-400 mb-2">{place?.PlaceDetails || "No details available"}</p>
          <h2 className="text-sm">🎟️ {place?.TicketPricing || "No pricing info"}</h2>
          {place?.GeoCoordinates && (
            <p className="text-sm text-gray-600">
              🌍 Latitude: {Number(place.GeoCoordinates.latitude).toFixed(4)}, Longitude:{" "}
              {Number(place.GeoCoordinates.longitude).toFixed(4)}
            </p>
          )}
          <button className="mt-3 flex items-center gap-1 text-blue-500">
            <FaMapLocationDot />
            View on Map
          </button>
        </div>
      </div>
    </Link>
  );
}

export default PlaceCardItem;
