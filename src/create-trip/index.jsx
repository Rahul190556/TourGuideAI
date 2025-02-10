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
    console.log('Form data:', formData);
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

  // Handle location input change and suggestions
  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      try {
        const response = await axios.get('https://api.locationiq.com/v1/autocomplete.php', {
          params: {
            key: 'pk.c51ba700c7aa3288f19b95fbaddbaeff',
            q: value,
            limit: 100,
            dedupe: 1,
          },
        });
        setSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching autocomplete suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
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
    <div className="min-h-screen bg-gradient-to-b from-white-300 via-blue-100 to-white p-2 relative border-none">
      <h2 className="font-bold text-3xl text-gray-800 text-center">Tell us your travel preferences🏕️🌴</h2>
      <p className="mt-3 text-gray-500 text-xl text-center">
        Just provide basic information, and our trip planner will generate a customized itinerary based on your preferences.
      </p>
      
      <div className="mt-10 sm:mt-16 md:mt-20 flex flex-col gap-9 px-5 md:px-10 lg:px-16">
        {/* Destination */}
        <div className="w-full md:w-1/2 lg:w-1/2 mx-auto">
          <h2 className="text-xl my-3 font-medium">What is your destination of choice?</h2>
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Enter a location"
            className="w-full md:w-[80%] p-2 border border-gray-300 rounded"
          />
          {suggestions.length > 0 && (
            <ul className="border border-gray-300 rounded mt-2 max-w-md mx-auto">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.place_id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                >
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Number of Days */}
        <div className="w-full md:w-1/2 lg:w-1/2 mx-auto">
          <h2 className="text-xl my-3 font-medium">How many days are you planning your trip?</h2>
          <input
            type="number"
            value={days}
            onChange={handleDaysChange}
            placeholder="Ex. 3"
            className="w-full md:w-[80%] p-2 border border-gray-300 rounded"
          />
        </div>
        
        {/* Budget Selection */}
        <div>
          <h2 className="text-xl my-3 font-medium">What is Your Budget?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5 justify-center">
            {SelectBudgetOptions.map((item, index) => (
              <div
                key={index}
                onClick={() => handleBudgetClick(item)}
                className={`p-2 border cursor-pointer rounded-lg text-center w-full sm:w-[80%] md:w-[60%] lg:w-80 transition-all duration-200
                  ${selectedBudget === item.title ? 'shadow-xl border-2 border-black' : 'hover:shadow-lg border-gray-300'}`}
              >
                <h2 className="text-2xl">{item.icons}</h2>
                <h2 className="font-bold text-md">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        {/* Traveler Selection */}
        <div>
          <h2 className="text-xl my-3 font-medium">Who do you plan on traveling with on your next adventure?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5 justify-center">
            {selectTravelList.map((item, index) => (
              <div
                key={index}
                onClick={() => handleTravelerClick(item)}
                className={`p-2 border cursor-pointer rounded-lg text-center w-full sm:w-[80%] md:w-[60%] lg:w-80 transition-all duration-200
                  ${selectedTraveler === item.people ? 'shadow-xl border-2 border-black' : 'hover:shadow-lg border-gray-300'}`}
              >
                <h2 className="text-2xl">{item.icons}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Trip Button */}
        <div className="my-10 justify-end flex">
          <button
            disabled={loading}
            className="bg-black text-white rounded px-4 py-2 mt-10 transition-all duration-200 hover:bg-blue-500"
            onClick={onGenerateTrip}
          >
            {loading ? <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" /> : 'Generate Trip'}
          </button>
        </div>
      </div>

      {/* Dialog for Google login */}
      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img
                src={travelPlannerLogo}
                className="w-1/4 h-auto mx-auto rounded-lg mb-5"
                alt="logo"
              />
              <h2 className="font-bold text-lg mt-7">Sign In With Google</h2>
              <p>Sign in to the App with Google authentication securely.</p>
              <button
                disabled={loading}
                onClick={login}
                className="w-full mt-5 flex gap-4 items-center justify-center p-3 bg-green-600 text-white rounded hover:bg-green-700 transition duration-300"
              >
                <FcGoogle className="h-7 w-7" />
                Sign In With Google
              </button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;
