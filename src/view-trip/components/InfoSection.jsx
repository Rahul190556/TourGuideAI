import { useState, useEffect } from "react";
import { IoLocationSharp } from "react-icons/io5";
import { createClient } from "pexels";
import placeImage from "../place.png";
import { FaDownload } from "react-icons/fa";

const PHOTO_REF_URL = "https://via.placeholder.com/1000?text=Photo+Not+Available";
const client = createClient(import.meta.env.VITE_PEXELS_API_KEY);

function InfoSection({ trip }) {
  const [photoUrl, setPhotoUrl] = useState(PHOTO_REF_URL);
  const [loading, setLoading] = useState(true);
  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    if (!trip?.userSelection?.location) return;

    const fetchPhoto = async () => {
      try {
        const query = `${trip.userSelection.location.display_name} city landmarks`;
        const res = await client.photos.search({ query, per_page: 1 });
        if (res?.photos?.length) {
          setPhotoUrl(res.photos[0].src.large);
        }
      } catch {
        setPhotoUrl(PHOTO_REF_URL);
      } finally {
        setLoading(false);
      }
    };

    fetchPhoto();
  }, [trip]);

  const handlePrintPDF = async () => {
    try {
      setPrinting(true);

      // Small delay so UI updates before print dialog
      setTimeout(() => {
        window.print();
        setPrinting(false);
      }, 300);

    } catch (err) {
      console.error("Print failed:", err);
      setPrinting(false);
    }
  };

  if (!trip?.userSelection) return null;

  return (
    <section className="bg-gradient-to-b from-gray-100 to-gray-300 rounded-2xl overflow-hidden">
      
      {/* IMAGE */}
      <div className="relative w-full aspect-[16/9] max-h-[420px]">
        {loading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="animate-spin border-4 border-white border-t-transparent rounded-full h-12 w-12" />
          </div>
        )}

        <img
          src={photoUrl || placeImage}
          alt="Trip"
          className="w-full h-full object-cover"
        />

        {/* Desktop Print Button */}
        <div className="no-print">
          <button
            onClick={handlePrintPDF}
            disabled={printing}
            className={`hidden md:flex absolute bottom-4 right-4 items-center gap-2 px-4 py-2 rounded-full 
              ${printing ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} 
              text-white shadow-lg transition`}
          >
            {printing ? (
              <>
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full h-4 w-4" />
                Preparing…
              </>
            ) : (
              <>
                <FaDownload />
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 md:p-6 space-y-4">

        {/* Mobile Print Button */}
        <div className="no-print">
          <button
            onClick={handlePrintPDF}
            disabled={printing}
            className="md:hidden w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white shadow hover:bg-blue-700 disabled:opacity-60"
          >
            <FaDownload />
            {printing ? "Preparing…" : "Download Itinerary (PDF)"}
          </button>
        </div>

        {/* Location */}
        <div className="flex items-start gap-2">
          <IoLocationSharp className="text-xl text-gray-700 mt-1" />
          <h2 className="font-bold text-lg md:text-2xl">
            {trip.userSelection.location.display_name}
          </h2>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-3">
          <span className="px-4 py-2 bg-gray-200 rounded-full text-sm">
            📆 {trip.userSelection.days} Days
          </span>
          <span className="px-4 py-2 bg-gray-200 rounded-full text-sm">
            💰 {trip.userSelection.budget}
          </span>
          <span className="px-4 py-2 bg-gray-200 rounded-full text-sm">
            🥂 {trip.userSelection.traveler} Travelers
          </span>
        </div>
      </div>
    </section>
  );
}

export default InfoSection;
