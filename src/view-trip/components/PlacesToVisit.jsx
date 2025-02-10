import React from "react";
import PlaceCardItem from "./PlaceCardItem";

function PlacesToVisit({ trip }) {
  const itinerary = trip?.tripData?.tripData?.Itinerary || []; // Safely extract the itinerary
  const hasItinerary = Array.isArray(itinerary) && itinerary.length > 0;

  return (
    <div>
      <h2 className="font-bold text-lg mt-9">Places To Visit</h2>
      <div>
        {hasItinerary ? (
          itinerary.map((dayItem, dayIndex) => (
            <div key={dayIndex} className="mt-5">
              <h2 className="font-medium text-lg">{`Day ${dayIndex + 1}`}</h2>
              <p className="text-gray-700 mb-4">{dayItem.DayPlan || "Plan not specified for this day."}</p>

              <div className="grid md:grid-cols-2 gap-5">
                {Array.isArray(dayItem.Places) && dayItem.Places.length > 0 ? (
                  dayItem.Places.map((place, placeIndex) => (
                    <PlaceCardItem key={placeIndex} place={place} />
                  ))
                ) : (
                  <p className="text-gray-500">No places specified for this day.</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 mt-5">No places to visit are available for this trip.</p>
        )}
      </div>
    </div>
  );
}

export default PlacesToVisit;
