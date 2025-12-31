import { useState, useEffect } from 'react';
import axios from 'axios';
import { SelectBudgetOptions, selectTravelList } from '../constants/options';
import { toast } from 'react-toastify';
import { createChatSession } from '../service/AIModal';
import { Dialog, DialogContent, DialogHeader, DialogDescription } from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import { setDoc, doc } from 'firebase/firestore';
import { db } from "@/service/firebaseConfig";
import travelPlannerLogo from '@/assets/travelplanner.png';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';

const AI_PROMPT = `
Generate a travel plan in JSON format for the following details:
Location: {location}, Duration: {totalDays} days, Travelers: {traveler}, Budget: {budget}.
The JSON structure should contain:
{
  "userSelection": {
    "budget": "{budget}",
    "days": {totalDays},
    "traveler": "{traveler}",
    "location": {
      "country": "Country name",
      "state": "State name",
      "county": "County name",
      "name": "{location}",
      "postcode": "Postal code",
      "address": {}
    }
  },
  "tripData": {
    "HotelOptions": [
      {
        "HotelName": "Hotel name",
        "HotelAddress": "Full address",
        "Price": "Price range",
        "HotelImageUrl": "Image URL",
        "GeoCoordinates": { "latitude": Latitude, "longitude": Longitude },
        "Rating": "Rating as a decimal",
        "Description": "Brief description of the hotel"
      }
       // Additional hotels...
    ],
    "Itinerary": [
      {
        "DayPlan": "Plan for the day",
        "Places": [
          {
            "PlaceName": "Place name",
            "PlaceDetails": "Details about the place",
            "PlaceImageUrl": "Image URL",
            "GeoCoordinates": { "latitude": Latitude, "longitude": Longitude },
            "TicketPricing": "Ticket price details",
            "TimeTravel": "Estimated time spent at the place"
          }
            // Additional places...
        ],
      
        
        "BestTimeToVisit": "Best time of the year to visit"
      }
        // Additional days...
    ]
  },
  "userEmail": "User email address"
}.
1. Provide at least 3-5 hotel options that match the given budget.
2. Generate a day-wise itinerary covering all {totalDays} days, with at least 1-3 places per day.
3. Include all fields, even if data is unavailable, and provide defaults.
`;



function CreateTrip() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [place, setPlace] = useState(null);
  const [days, setDays] = useState('');
  const [formData, setFormData] = useState({});
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedTraveler, setSelectedTraveler] = useState('');
  const [openDialog, setOpenDialog] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Helper to update form data
  const handleData = (name, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  useEffect(() => {
    // console.log('Form data:', formData);
  }, [formData]);

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error),
  });
const onGenerateTrip = async () => {
     // Temporarily bypass Google Sign-In check
    // const user = localStorage.getItem('user');
    // if (!user) {
    //   setOpenDialog(true);
    //   return;
    // }

  // Check if all required fields are filled
  if (!formData?.location || !formData?.days || !formData?.budget || !formData?.traveler) {
    toast("Please fill all the details");
    return;
  }

  setLoading(true);

  // console.log("Form Data Submitted:", formData);
  const FINAL_PROMPT = AI_PROMPT
    .replace("{location}", formData?.location?.label || "")
    .replace("{totalDays}", formData?.days || "")
    .replace("{traveler}", formData?.traveler || "")
    .replace("{budget}", formData?.budget || "")
    .replace("{Days}", formData?.days || "");

  // console.log("Generated AI Prompt:", FINAL_PROMPT);

  try {
    // Fetch AI response
    const response = await createChatSession(FINAL_PROMPT);

    if (!response) {
      throw new Error("Empty response from AI.");
    }

    // console.log("Raw AI Response:", response);

    // Save the response directly without normalization
    await saveAITrip(response);
    toast("Trip successfully generated!");
  } catch (error) {
    // console.error("Error generating trip:", error);
    toast(`An error occurred: ${error.message}`);
  } finally {
    setLoading(false);
  }
};



  // Function to save AI-generated trip data
const saveAITrip = async (tripData) => {
  if (!tripData) {
    // console.error("Invalid trip data:", tripData);
    toast("Trip data is invalid or empty");
    return;
  }

  setLoading(true);
  const user = JSON.parse(localStorage.getItem('user'));
  const docId = Date.now().toString(); // Use current timestamp as unique ID

  try {
    // Saving the normalized trip data into Firebase under the 'AITrips' collection
    await setDoc(doc(db, "AITrips", docId), {
      userSelection: formData,
      tripData: tripData, // Using normalized trip data
      userEmail: user?.email || "guest",
      id: docId,
    });

    toast("Trip saved successfully!");
    navigate('/view-trip/' + docId);
  } catch (error) {
    console.error('Error saving trip:', error);
    toast("An error occurred while saving the trip");
  } finally {
    setLoading(false); // Ensure loading is stopped even if an error occurs
  }
};



  // Function to get user profile after Google login
  const GetUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
      headers: {
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: 'Application/json',
      },
    }).then((resp) => {
      console.log(resp);
      localStorage.setItem('user', JSON.stringify(resp.data));
      setOpenDialog(false);
      onGenerateTrip();
    });
  };

  let debounceTimer;


  const handleInputChange = (e) => {
  const value = e.target.value;
  setQuery(value);

  if (debounceTimer) clearTimeout(debounceTimer);

  debounceTimer = setTimeout(async () => {
    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        'https://api.locationiq.com/v1/autocomplete.php',
        {
          params: {
            key: import.meta.env.VITE_LOCATIONIQ_KEY,
            q: value,
            limit: 5,   
            dedupe: 1,
          },
        }
      );
      setSuggestions(response.data);
    } catch (error) {
      console.error('Autocomplete error:', error?.response?.status);
    }
  }, 800); // 800ms debounce
};


  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setPlace(suggestion);
    setQuery(suggestion.display_name);
    setSuggestions([]);
    handleData('location', { label: suggestion.display_name, ...suggestion });
  };

  // Handle number of days input change
  const handleDaysChange = (e) => {
    const value = e.target.value;
    setDays(value);
    handleData('days', value);
  };

  // Handle budget selection
  const handleBudgetClick = (item) => {
    setSelectedBudget(item.title);
    handleData('budget', item.title);
  };

  // Handle traveler selection
  const handleTravelerClick = (item) => {
    setSelectedTraveler(item.people);
    handleData('traveler', item.people);
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-100 to-white px-4 py-8">
    
    {/* Header */}
    <div className="text-center max-w-3xl mx-auto mb-14">
      <h2 className="font-bold text-4xl text-gray-900 tracking-tight">
        Tell us your travel preferences 🏕️🌴
      </h2>
      <p className="mt-4 text-gray-600 text-lg">
        Just share a few details and we’ll craft a personalized, day-wise travel plan for you.
      </p>
    </div>

    {/* Main Card */}
    <div className="max-w-6xl mx-auto bg-white/70 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-xl p-6 sm:p-10">

      <div className="flex flex-col gap-12">

        {/* Destination */}
        <div className="max-w-xl mx-auto w-full">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            📍 Destination
          </h2>

          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Enter city, state or country"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black focus:border-black outline-none transition"
          />

          {suggestions.length > 0 && (
            <ul className="mt-2 rounded-xl border border-gray-200 bg-white shadow-lg max-h-60 overflow-y-auto">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.place_id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-2 cursor-pointer text-sm hover:bg-gray-100 transition"
                >
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Days */}
        <div className="max-w-xl mx-auto w-full">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            🗓 Trip Duration
          </h2>

          <input
            type="number"
            value={days}
            onChange={handleDaysChange}
            placeholder="e.g. 3 days"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black focus:border-black outline-none transition"
          />
        </div>

        {/* Budget */}
        <div>
          <h2 className="text-lg font-semibold mb-5 text-gray-800 text-center">
            💰 Select Your Budget
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
            {SelectBudgetOptions.map((item, index) => (
              <div
                key={index}
                onClick={() => handleBudgetClick(item)}
                className={`w-full max-w-xs cursor-pointer rounded-2xl border p-5 text-center transition-all duration-300
                ${
                  selectedBudget === item.title
                    ? "border-black shadow-2xl scale-[1.02]"
                    : "border-gray-200 hover:shadow-lg hover:scale-[1.01]"
                }`}
              >
                <div className="text-3xl mb-2">{item.icons}</div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Travelers */}
        <div>
          <h2 className="text-lg font-semibold mb-5 text-gray-800 text-center">
            👥 Who are you traveling with?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
            {selectTravelList.map((item, index) => (
              <div
                key={index}
                onClick={() => handleTravelerClick(item)}
                className={`w-full max-w-xs cursor-pointer rounded-2xl border p-5 text-center transition-all duration-300
                ${
                  selectedTraveler === item.people
                    ? "border-black shadow-2xl scale-[1.02]"
                    : "border-gray-200 hover:shadow-lg hover:scale-[1.01]"
                }`}
              >
                <div className="text-3xl mb-2">{item.icons}</div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-center mt-8">
          <button
            disabled={loading}
            onClick={onGenerateTrip}
            className="flex items-center gap-3 px-8 py-4 rounded-full bg-black text-white text-lg font-medium
              hover:bg-gray-900 transition disabled:opacity-60"
          >
            {loading && <AiOutlineLoading3Quarters className="animate-spin" />}
            Generate My Trip ✨
          </button>
        </div>
      </div>
    </div>

    {/* Sign In Dialog */}
    <Dialog open={openDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogDescription className="text-center">
            <img
              src={travelPlannerLogo}
              className="w-16 h-16 mx-auto mb-4 rounded-xl"
              alt="logo"
            />
            <h2 className="font-semibold text-xl mb-2">Sign in with Google</h2>
            <p className="text-gray-500 mb-6">
              Login securely to save and manage your trips.
            </p>
            <button
              disabled={loading}
              onClick={login}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-black text-white hover:bg-gray-900 transition"
            >
              <FcGoogle className="h-6 w-6" />
              Continue with Google
            </button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  </div>
);

}

export default CreateTrip;
